import { and, eq, isNull, lte, or } from "drizzle-orm";
import { Resend } from "resend";
import { sleep } from "workflow";
import { db } from "../db";
import { userLevelProgress, user as userSchema } from "../db/schema";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface EmailTemplate {
  subject: string;
  body: string;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    subject: "Your AWS DVA-C02 practice is waiting",
    body: `Hi {{userName}},

You recently signed up for AWS Quiz Game to start practicing for your Developer Associate (DVA-C02) exam.

That certification is a huge step, and key to passing is consistent practice. Your free Level 1 is ready and waiting for you.

Why not take 10 minutes right now to knock out first level?

Start Level 1 (Free Questions)

You've got this!

- The AWS Quiz Game Team`,
  },
  {
    subject: "Studying for the DVA-C02 doesn't have to be a grind",
    body: `Hi {{userName}},

Let's be honest: studying for the DVA-C02 can be overwhelming. It's easy to get lost in long video courses or dry documentation.

We built the AWS Quiz Game to fix this.

We turned exam prep into a game. Instead of just reading, you "level up" from one topic to the next. You get to see your progress and build confidence for exam day.

Your free Level 1 is the perfect place to start.

Jump back into Level 1

Keep up the great work!

- The AWS Quiz Game Team`,
  },
  {
    subject: "A quick question for you",
    body: `Hi {{userName}},

We noticed you haven't had a chance to start your AWS exam practice yet.

Passing the Developer Associate exam is one of the best ways to advance your career. We don't want you to miss out on your goal.

If you're still planning to get certified, the first step is waiting for you.

Start your free Level 1 practice

P.S. — If you signed up but found the app wasn't what you were looking for, would you mind just hitting reply and letting us know why? Your feedback is incredibly helpful.`,
  },
];

export async function sendReminderEmails() {
  "use workflow";

  console.log("🚀 Starting reminder email workflow...");

  try {
    // Get inactive users (users who haven't started quiz progress after 2 days)
    // and haven't received a reminder in the last 7 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const inactiveUsers = await getInactiveUsers(twoDaysAgo, sevenDaysAgo);
    console.log(`Found ${inactiveUsers.length} inactive users.`);

    // Send emails to inactive users
    for (const userData of inactiveUsers) {
      await sendReminderEmail(userData);

      // Sleep between emails to avoid rate limiting
      await sleep("10s");
    }

    // Schedule next run in 24 hours
    await sleep("24h");

    // Restart the workflow for the next batch
    return await sendReminderEmails();
  } catch (error) {
    console.error("❌ Error in reminder email workflow:", error);
    throw error;
  }
}

async function getInactiveUsers(twoDaysAgo: Date, sevenDaysAgo: Date) {
  "use step";

  return await db
    .select()
    .from(userSchema)
    .leftJoin(userLevelProgress, eq(userSchema.id, userLevelProgress.userId))
    .where(
      and(
        lte(userSchema.createdAt, twoDaysAgo),
        isNull(userLevelProgress.id),
        // Only send reminders to users who haven't received one in last 7 days
        or(
          isNull(userSchema.lastReminderSentAt),
          lte(userSchema.lastReminderSentAt, sevenDaysAgo),
        ),
      ),
    );
}

async function sendReminderEmail(userData: {
  user: { id: string; name: string; email: string };
}) {
  "use step";

  const { user } = userData;

  try {
    // Select a random email template
    const randomEmail =
      EMAIL_TEMPLATES[Math.floor(Math.random() * EMAIL_TEMPLATES.length)];

    // Personalize the email body
    const emailBody = randomEmail.body.replace(
      new RegExp("{{userName}}", "g"),
      user.name,
    );

    // Send the email
    await resend.emails.send({
      from: "Aws Quiz Game <support@certquickly.com>",
      to: user.email,
      subject: randomEmail.subject,
      text: emailBody,
    });

    console.log(`✅ Email sent to ${user.email}`);

    // Mark user as having received a reminder
    await markUserAsNotified(user.id);
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
    throw error;
  }
}

async function markUserAsNotified(userId: string) {
  "use step";

  // Update the user's last reminder sent timestamp
  await db
    .update(userSchema)
    .set({ lastReminderSentAt: new Date() })
    .where(eq(userSchema.id, userId));

  console.log(`📝 Marked user ${userId} as notified`);
}
