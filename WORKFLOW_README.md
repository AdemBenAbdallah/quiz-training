# Automated Reminder Email System

This project uses [UseWorkflow](https://useworkflow.dev/) to automate reminder emails for users who haven't started practicing for their AWS DVA-C02 exam.

## 🚀 Features

- **Automated Reminder Emails**: Sends reminder emails to inactive users after 2 days
- **Smart Scheduling**: Only sends reminders once per 7 days to avoid spam
- **Multiple Email Templates**: Uses randomized templates to keep content fresh
- **Automatic Retry**: Failed email sends are automatically retried
- **Continuous Operation**: Workflow runs every 24 hours automatically
- **Management Dashboard**: Monitor workflow statistics and manually trigger workflows
- **Real-time Monitoring**: Use Workflow DevKit for detailed insights

## 📋 Requirements

- Node.js 18+
- PostgreSQL database
- Resend API key for email sending
- UseWorkflow DevKit installed (already configured)

## 🔧 Setup

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_training"

# Email Service
RESEND_API_KEY="re_1234567890abcdefghijklmnopqrstuvwxyz"

# Workflow Security
WORKFLOW_API_KEY="your-secure-workflow-api-key"
NEXT_PUBLIC_WORKFLOW_API_KEY="your-secure-workflow-api-key"

# Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 2. Database Schema

The workflow uses the existing `user` table with an additional field:
- `lastReminderSentAt`: Tracks when users last received a reminder email

Run the database migration to ensure the schema is up to date:

```bash
npm run db:push
```

### 3. Initialize the Workflow

Start the automated reminder email workflow:

```bash
npm run init-workflow
```

### 4. Monitor the Workflow

Visit the management dashboard at `/workflow-dashboard` to:
- View workflow statistics
- Manually trigger workflows
- Monitor user engagement metrics

## 🔄 Workflow Logic

### Target Users

The workflow sends reminder emails to users who:
1. Created their account more than 2 days ago
2. Haven't started any quiz progress (no records in `userQuizProgress`)
3. Haven't received a reminder email in the last 7 days

### Email Templates

The workflow uses 3 different email templates that are randomly selected for each user:

1. **"Your AWS DVA-C02 practice is waiting"**
   - Friendly reminder about available practice content
   - Encourages immediate action

2. **"Studying for the DVA-C02 doesn't have to be a grind"**
   - Addresses common study pain points
   - Highlights the gamified approach

3. **"A quick question for you"**
   - Personal, conversational tone
   - Includes feedback request

### Schedule

- **Initial Delay**: 2 days after account creation
- **Frequency**: Once per 7 days maximum per user
- **Interval**: Workflow runs every 24 hours
- **Retry**: Failed emails are automatically retried

## 🛠️ Commands

```bash
# Initialize/start the workflow
npm run init-workflow

# Open Workflow DevKit web interface
npm run workflow:inspect

# Start workflow development server
npm run workflow:dev

# Manual email sending (legacy)
npm run send-reminders
```

## 🌐 API Endpoints

### POST `/api/workflows/reminder-emails`

Start the reminder email workflow manually.

**Headers:**
```
Authorization: Bearer {WORKFLOW_API_KEY}
Content-Type: application/json
```

**Response:**
```json
{
  "message": "Reminder email workflow started successfully",
  "workflowId": "wrk_1234567890"
}
```

### GET `/api/workflows/stats`

Get current workflow statistics.

**Response:**
```json
{
  "totalUsers": 150,
  "inactiveUsers": 45,
  "eligibleForReminder": 12,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## 📊 Management Dashboard

Visit `/workflow-dashboard` to access the management interface:

### Statistics Overview
- **Total Users**: All registered users
- **Inactive Users**: Users eligible for reminders (inactive > 2 days)
- **Eligible for Reminder**: Users who can receive emails (haven't been emailed in 7 days)

### Actions
- **Start Workflow**: Manually trigger the reminder email workflow
- **Refresh Stats**: Update the displayed statistics
- **View Logs**: Access detailed workflow execution logs via Workflow DevKit

## 🔍 Monitoring & Debugging

### Workflow DevKit

Use the Workflow DevKit CLI for advanced monitoring:

```bash
# List all workflow runs
npx workflow inspect runs

# Open web interface for detailed view
npx workflow inspect runs --web

# Get specific workflow run details
npx workflow inspect run wrk_1234567890

# View step-by-step execution
npx workflow inspect steps wrk_1234567890
```

### Error Handling

The workflow includes comprehensive error handling:

- **Retry Logic**: Failed email sends are automatically retried
- **Fatal Errors**: Invalid email addresses stop retries immediately
- **Logging**: All errors are logged with detailed context
- **Continuation**: Workflow continues running even if individual emails fail

### Common Issues

1. **Email Sending Failures**
   - Check `RESEND_API_KEY` in environment variables
   - Verify email limits and sender domain configuration
   - Review error logs in Workflow DevKit

2. **Database Connection Issues**
   - Ensure `DATABASE_URL` is correct
   - Check database server availability
   - Verify schema migrations are applied

3. **Workflow Not Running**
   - Check if workflow was properly initialized
   - Verify environment variables are set
   - Review workflow status in Workflow DevKit

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your Git repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - workflows will run automatically

### Other Platforms

For other deployment platforms:

1. Ensure Node.js 18+ runtime
2. Set all required environment variables
3. Run `npm run init-workflow` after deployment
4. Configure any necessary cron jobs or background task services

## 🔒 Security

- API endpoints are protected with authorization headers
- Workflow API keys should be rotated regularly
- Database operations use parameterized queries
- Email content is sanitized and templated

## 📈 Performance Considerations

- **Batching**: Large numbers of users are processed in batches
- **Rate Limiting**: 10-second delays between emails prevent rate limits
- **Database Optimization**: Indexed queries for efficient user lookup
- **Memory Management**: Workflow state is persisted between runs

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

Test the workflow with a development database:

```bash
# Create test users
npm run create-test-users

# Run workflow in test mode
npm run init-workflow -- --test
```

### Manual Testing

1. Create a test user account
2. Wait 2+ days or modify the database to simulate time passage
3. Visit `/workflow-dashboard` and start the workflow
4. Check your email (ensure Resend is configured for test mode)

## 📚 Additional Resources

- [UseWorkflow Documentation](https://useworkflow.dev/docs)
- [Resend API Documentation](https://resend.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [Next.js API Routes](https://next.js.org/docs/app/building-your-application/routing/api-routes)

## 🤝 Contributing

When contributing to this workflow system:

1. Test changes in development environment first
2. Update this documentation for any new features
3. Ensure backward compatibility with existing user data
4. Add appropriate error handling and logging
5. Test email templates for different email clients

## 📞 Support

For issues with the workflow system:

1. Check the Workflow DevKit interface for error details
2. Review application logs for database or API errors
3. Verify environment variables are correctly set
4. Test with a small number of users first
5. Consult this documentation and the linked resources

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Adem Ben Abdallah
```

## Summary

I've successfully implemented a comprehensive automated reminder email system using UseWorkflow for your AWS quiz training application. Here's what was created:

### 🎯 **Core Implementation**

1. **Workflow File** (`/workflows/send-reminder-emails.ts`):
   - Automated workflow that runs every 24 hours
   - Sends reminder emails to inactive users
   - Uses randomized email templates
   - Tracks sent reminders to avoid spam

2. **API Routes**:
   - `/api/workflows/reminder-emails` - Trigger the workflow
   - `/api/workflows/stats` - Get workflow statistics

3. **Management Dashboard** (`/workflow-dashboard`):
   - Monitor workflow statistics
   - Manually trigger workflows
   - View user engagement metrics

### 🔧 **Key Features**

- **Smart Targeting**: Only emails users who haven't started quizzes after 2 days
- **Anti-Spam**: Limits reminders to once per 7 days per user
- **Auto-Retry**: Failed emails are automatically retried
- **Continuous Operation**: Runs every 24 hours automatically
- **Real-time Monitoring**: Dashboard shows current stats and workflow status

### 🚀 **Quick Start**

1. Set up environment variables:
   ```bash
   RESEND_API_KEY=your_api_key
   WORKFLOW_API_KEY=your_secure_key
   DATABASE_URL=your_database_url
   ```

2. Initialize the workflow:
   ```bash
   npm run init-workflow
   ```

3. Monitor at `/workflow-dashboard`

### 📧 **Email Templates**

The system uses 3 different email templates that are randomly selected to keep the content fresh and engaging for users who haven't started their AWS exam practice.

The workflow is now ready to automatically help users stay engaged with their AWS certification preparation! You can monitor its progress through the dashboard and use the Workflow DevKit for detailed insights and debugging.
