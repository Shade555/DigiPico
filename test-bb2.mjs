(async () => {
  try {
    const { BackboardClient } = await import('backboard-sdk');
    const client = new BackboardClient({ apiKey: 'espr_NEEDKMyVRgVD9Ky-TnM5BpO-u8wnUSQGwXF9JWJJUOc' });
    const res = await client.sendMessage({
      content: 'Return strictly the JSON array: [{"test": 1}]',
      model: 'google/gemma-3-4b-it'
    });
    console.log(res);
  } catch (e) {
    console.error("ERROR:", e);
  }
})();
