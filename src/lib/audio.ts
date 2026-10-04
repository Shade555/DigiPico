export async function textToSpeech(text: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.warn("Audio generation skipped or failed. Is ELEVENLABS_API_KEY set on the server?");
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error generating audio:", error);
    return null;
  }
}
