import { auth } from "@/lib/auth";
import { sendReminderEmails } from "@/workflows/send-reminder-emails";
import logger from "@/lib/logger";
import { connection, NextResponse } from "next/server";
import { start } from "workflow/api";

export async function POST(request: Request) {
  try {
    await connection();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Start the reminder email workflow
    const workflow = await start(sendReminderEmails, []);

    return NextResponse.json({
      message: "Reminder email workflow started successfully",
      workflowId: workflow.runId,
    });
  } catch (error) {
    logger.error("Error starting reminder email workflow:", error);
    return NextResponse.json(
      { error: "Failed to start workflow" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Reminder email workflow endpoint",
    description: "POST to this endpoint to start the reminder email workflow",
  });
}
