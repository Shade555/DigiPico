import { proxyActivities, workflowInfo } from '@temporalio/workflow';
// import type { NewsActivities } from '../activities/news';

// Mocking the activities proxy for the hackathon
const { fetchDailyNews, sendPushNotification } = proxyActivities<any>({
  startToCloseTimeout: '1 minute',
});

/**
 * A Temporal Cron Workflow that runs daily.
 * It fetches the top tech news using SerpApi and sends a push notification to the user.
 */
export async function dailyTechNewsWorkflow(userId: string) {
  console.log(`Starting daily tech news workflow for user ${userId}`);
  
  try {
    // 1. Fetch exactly one piece of high-quality tech news (via SerpApi/Mastra)
    const news = await fetchDailyNews();
    
    // 2. Format the notification payload
    const title = "Pico's Daily Tech Discovery 🐣";
    const body = `Did you know? ${news.title}`;
    
    // 3. Send the push notification (via Firebase/WebPush to Phone & Windows)
    await sendPushNotification(userId, title, body);
    
    console.log(`Successfully sent daily news to ${userId}`);
    return { success: true, newsTitle: news.title };
  } catch (error) {
    console.error("Failed to send daily news:", error);
    throw error; // Temporal will automatically retry based on the policy!
  }
}
