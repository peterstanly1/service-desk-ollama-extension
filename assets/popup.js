document.getElementById("openSidebar").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.toggleSidebar && window.toggleSidebar()
  });
});

document.getElementById("uploadPolicies").onclick = async () => {
  const prompt = document.getElementById("policyPrompt").value;
  const files = document.getElementById("policyUpload").files;

  const contents = await Promise.all(Array.from(files).map(async (file) => {
    const text = await file.text();
    return `--- ${file.name} ---\n${text}`;
  }));

  const policyText = contents.join("\n\n");
  const memoryPrompt = `
${prompt || "You are a ServiceDesk AI assistant."}

Below are the company's official IT policies and procedures. Read and remember them permanently for all future tasks. Do not forget or ask again unless re-uploaded.

${policyText}
`;

  await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt: memoryPrompt,
      stream: false
    })
  });

  chrome.storage.local.set({ policiesTrained: true }, () => {
    document.getElementById("uploadStatus").innerText = "✅ Policy memory initialized.";
  });
};

document.getElementById("clearMemory").onclick = () => {
  chrome.storage.local.remove("policiesTrained", () => {
    document.getElementById("uploadStatus").innerText = "❌ Memory cleared. Re-upload required.";
  });
};