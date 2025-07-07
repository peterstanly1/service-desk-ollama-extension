body: JSON.stringify({
  model: "llama3:latest",
  prompt: "Your prompt here...",
}),
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateOllamaResponse') {
    const model = request.model || 'llama3';
    const prompt = request.prompt;
    const port = request.port || '11434';

    fetch(`http://localhost:${port}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt })
    })
      .then(res => res.json())
      .then(data => sendResponse({ success: true, response: data.response }))
      .catch(error => sendResponse({ success: false, error: error.message }));

    return true; // tells Chrome the response is async
  }
});
