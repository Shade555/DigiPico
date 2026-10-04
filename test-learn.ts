import { BackboardClient } from 'backboard-sdk';

async function test() {
  const backboardClient = new BackboardClient({ 
    apiKey: 'espr_NEEDKMyVRgVD9Ky-TnM5BpO-u8wnUSQGwXF9JWJJUOc' 
  });
  
  const prompt = `Generate a 5-step learning curriculum for the topic: "React". 
Return strictly a JSON array of 5 objects. Each object must have:
"id" (number), "title" (string), "type" (concept | quiz | project), and "status" (completed | current | locked).
Make the first two 'completed', the third 'current', and the rest 'locked'.`;

  console.log("Sending prompt to backboard...");
  try {
    const res = await backboardClient.sendMessage({
      content: prompt,
      model: 'google/gemma-4-31B',
    });
    console.log("Response:", res.content);
    
    const jsonMatch = res.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      console.log("Parsed JSON:", JSON.parse(jsonMatch[0]));
    } else {
      console.log("Failed to match JSON");
    }
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
test();
