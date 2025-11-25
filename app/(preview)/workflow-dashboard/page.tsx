import { db } from "@/db";
import { user, userQuizProgress } from "@/db/schema";
import { and, eq, isNull, lte, or } from "drizzle-orm";
import { AlertCircle, Clock, Mail, RefreshCw, Users } from "lucide-react";

interface WorkflowStats {
  totalUsers: number;
  inactiveUsers: number;
  eligibleForReminder: number;
  lastUpdated: string;
}

async function getWorkflowStats(): Promise<WorkflowStats> {
  // Access headers to allow using new Date() in server component
  const { headers } = await import("next/headers");
  headers(); // Access headers to enable Date usage

  // Get total users
  const totalUsers = await db.select().from(user);

  // Get inactive users (haven't started quiz after 2 days)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const inactiveUsers = await db
    .select()
    .from(user)
    .leftJoin(userQuizProgress, eq(user.id, userQuizProgress.userId))
    .where(and(lte(user.createdAt, twoDaysAgo), isNull(userQuizProgress.id)));

  // Get users who haven't received reminders in the last 7 days
  const eligibleForReminder = await db
    .select()
    .from(user)
    .leftJoin(userQuizProgress, eq(user.id, userQuizProgress.userId))
    .where(
      and(
        lte(user.createdAt, twoDaysAgo),
        isNull(userQuizProgress.id),
        // Only send reminders to users who haven't received one in the last 7 days
        or(
          isNull(user.lastReminderSentAt),
          lte(user.lastReminderSentAt, sevenDaysAgo),
        ),
      ),
    );

  // Get current timestamp after database operations
  const now = new Date();

  return {
    totalUsers: totalUsers.length,
    inactiveUsers: inactiveUsers.length,
    eligibleForReminder: eligibleForReminder.length,
    lastUpdated: now.toISOString(),
  };
}

async function startWorkflowAction() {
  "use server";

  try {
    const { start } = await import("workflow/api");
    const { sendReminderEmails } = await import(
      "@/workflows/send-reminder-emails"
    );

    const workflow = await start(sendReminderEmails, []);

    // Redirect with success message
    const url = new URL("/workflow-dashboard", "http://localhost:3000");
    url.searchParams.set(
      "workflowResult",
      JSON.stringify({
        success: true,
        message: `Workflow started successfully! ID: ${workflow.runId}`,
        workflowId: workflow.runId,
      }),
    );

    const { redirect } = await import("next/navigation");
    redirect(url.toString());
  } catch (error) {
    // Redirect with error message
    const url = new URL("/workflow-dashboard", "http://localhost:3000");
    url.searchParams.set(
      "workflowResult",
      JSON.stringify({
        success: false,
        message: `Error starting workflow: ${error instanceof Error ? error.message : "Unknown error"}`,
        workflowId: null,
      }),
    );

    const { redirect } = await import("next/navigation");
    redirect(url.toString());
  }
}

export default async function WorkflowDashboard({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Get stats and workflow status from server
  const stats = await getWorkflowStats();

  // Handle form submission result (properly await searchParams)
  let workflowResult = null;
  const resolvedSearchParams = await searchParams;
  if (resolvedSearchParams?.workflowResult) {
    const resultString = Array.isArray(resolvedSearchParams.workflowResult)
      ? resolvedSearchParams.workflowResult[0]
      : resolvedSearchParams.workflowResult;
    try {
      workflowResult = JSON.parse(resultString);
    } catch (error) {
      workflowResult = null;
    }
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black rounded-lg shadow-xl p-8 border border-red-900/30">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-red-500" />
            Workflow Management Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-red-400">
                  Total Users
                </h3>
                <Users className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-300">
                {stats.totalUsers}
              </p>
            </div>

            <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-orange-400">
                  Inactive Users
                </h3>
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-orange-300">
                {stats.inactiveUsers}
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-yellow-400">
                  Eligible for Reminder
                </h3>
                <Mail className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-yellow-300">
                {stats.eligibleForReminder}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Last Updated
            </h3>
            <p className="text-gray-300">
              {new Date(stats.lastUpdated).toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <form action={startWorkflowAction}>
              <button
                type="submit"
                disabled={stats.eligibleForReminder === 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                  stats.eligibleForReminder === 0
                    ? "bg-red-800 cursor-not-allowed opacity-50"
                    : "bg-red-600 hover:bg-red-500 hover:shadow-lg hover:scale-105 active:scale-95 border border-red-400/30"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {stats.eligibleForReminder === 0
                    ? "No Users Eligible for Reminder"
                    : `Start Reminder Workflow (${stats.eligibleForReminder} users)`}
                </div>
              </button>
            </form>

            {workflowResult && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  workflowResult.success
                    ? "bg-green-950/30 border-green-500/30"
                    : "bg-red-950/30 border-red-500/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {workflowResult.success ? (
                    <RefreshCw className="w-4 h-4 text-green-300" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-300" />
                  )}
                  <span className="text-sm font-medium">
                    {workflowResult.success ? "Success" : "Error"}
                  </span>
                </div>
                <p
                  className={`text-${workflowResult.success ? "green" : "red"}-300`}
                >
                  {workflowResult.message}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-black rounded-lg border border-red-900/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              About This Workflow
            </h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Sends reminder emails to users who have not started quiz
                practice after 2 days
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                Only sends reminders once per 7 days to avoid spam
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                Uses randomized email templates to keep content fresh
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Automatically retries failed email sends
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Workflow runs continuously with 24-hour intervals
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
