chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getOllamaSettings') {
    chrome.storage.sync.get(['ollamaModel', 'ollamaPort', 'defaultPrompt'], (result) => {
      sendResponse({
        model: data.ollamaModel || 'llama3:latest',
        port: data.ollamaPort || '11434',
        prompt: data.defaultPrompt || 'You are an IT service desk assistant. Based on the SR conversation history, generate a professional reply.'
      });
    });
    return true; // Needed to use sendResponse asynchronously
  }

  if (request.action === 'generateOllamaResponse') {
    const { model, prompt, port } = request;

    fetch(`http://localhost:${port}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false })
    })
      .then(res => res.json())
      .then(data => sendResponse({ success: true, response: data.response }))
      .catch(error => sendResponse({ success: false, error: error.message }));

    return true;
  }
});
