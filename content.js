window.toggleSidebar = () => {
  if (document.getElementById("sd-assistant")) {
    document.getElementById("sd-assistant").remove();
    return;
  }

  const panel = document.createElement("div");
  panel.id = "sd-assistant";
  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h4>AI Assistant (Ollama)</h4>
      <button id="closeAssistant" style="font-size: 16px; background: none; border: none; cursor: pointer;">❌</button>
    </div>
    <textarea id="sr-details" placeholder="Paste SR details here..."></textarea>
    <button id="loadSR">Auto-Load from Page</button>
    <button id="analyzeBtn">Analyze</button>
    <pre id="assistantOutput">Response will appear here...</pre>
  `;
  document.body.appendChild(panel);

  document.getElementById("closeAssistant").onclick = () => {
    document.getElementById("sd-assistant")?.remove();
  };

  document.getElementById("loadSR").onclick = () => {
    const title = document.querySelector("h1")?.innerText || "No Title Found";
    const description = document.querySelector("p, .description, .sr-description")?.innerText || "No Description Found";
    document.getElementById("sr-details").value = `Title: ${title}\nDescription: ${description}`;
  };

  document.getElementById("analyzeBtn").onclick = async () => {
    const text = document.getElementById("sr-details").value;

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: `You are a helpful IT assistant for ServiceDesk. Analyze the following SR:
${text}

Provide:
1. First user response.
2. Step-by-step resolution.
3. Clarifying questions.`,
        stream: false
      })
    });

    const data = await res.json();
    document.getElementById("assistantOutput").innerText = data.response;
  };
};