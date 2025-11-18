import dotenv from "dotenv";
import { and, eq, isNull, lte } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "../db";
import { userQuizProgress, user as userSchema } from "../db/schema";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set.");
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY environment variable is not set.");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY!);

const EMAIL_TEMPLATES = [
  {
    subject: "Your AWS DVA-C02 practice is waiting",
    body: `Hi [User's Name],

You recently signed up for the AWS Quiz Game to start practicing for your Developer Associate (DVA-C02) exam.

That certification is a huge step, and the key to passing is consistent practice. Your free Level 1 is ready and waiting for you.

Why not take 10 minutes right now to knock out the first part?

Start Part 1 (8 Free Questions)

You've got this!

- The AWS Quiz Game Team`,
  },
  {
    subject: "Studying for the DVA-C02 doesn't have to be a grind",
    body: `Hi [User's Name],

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
    body: `Hi [User's Name],

We noticed you haven't had a chance to start your AWS exam practice yet.

Passing the Developer Associate exam is one of the best ways to advance your career. We don't want you to miss out on your goal.

If you're still planning to get certified, the first step is waiting for you.

Start your free Level 1 practice

P.S. — If you signed up but found the app wasn't what you were looking for, would you mind just hitting reply and letting us know why? Your feedback is incredibly helpful.`,
  },
];

async function sendReminderEmails() {
  console.log("🚀 Sending reminder emails...");

  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const inactiveUsers = await db
      .select()
      .from(userSchema)
      .leftJoin(userQuizProgress, eq(userSchema.id, userQuizProgress.userId))
      .where(
        and(lte(userSchema.createdAt, twoDaysAgo), isNull(userQuizProgress.id)),
      );

    console.log(`Found ${inactiveUsers.length} inactive users.`);

    for (const { user } of inactiveUsers) {
      const randomEmail =
        EMAIL_TEMPLATES[Math.floor(Math.random() * EMAIL_TEMPLATES.length)];

      const emailBody = randomEmail.body.replace("[User's Name]", user.name);

      await resend.emails.send({
        from: "Aws Quiz Game <support@adembenabdallah.com>",
        to: user.email,
        subject: randomEmail.subject,
        text: emailBody,
      });

      console.log(`Email sent to ${user.email}`);
    }
  } catch (error: any) {
    if (error.cause?.code === "ECONNREFUSED") {
      console.error(
        "❌ Database connection refused. Please ensure your database server is running and the DATABASE_URL is correct.",
      );
    } else {
      console.error("❌ Error sending reminder emails:", error);
    }
    process.exit(1);
  }
}

sendReminderEmails();
