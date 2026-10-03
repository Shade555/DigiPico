import { proxyActivities } from '@temporalio/workflow';
// import type * as activities from './activities';

// const { sendWeeklyDigest } = proxyActivities<typeof activities>({
//   startToCloseTimeout: '1 minute',
// });

export async function weeklyDigestWorkflow(userId: string): Promise<void> {
  // 1. Gather User's learned topics this week
  // 2. Ask Gemma 4 to summarize and find 3 new tech recommendations
  // 3. Send email/notification via digest
  
  console.log(`Starting Weekly Digest Workflow for user: ${userId}`);
  // await sendWeeklyDigest(userId);
}
