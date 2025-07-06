document.addEventListener("DOMContentLoaded", () => {
  const includeNotes = document.getElementById("includeNotes");
  const customPrompt = document.getElementById("customPrompt");
  const policyUpload = document.getElementById("policyUpload");

  chrome.storage.sync.get(["includeNotes", "customPrompt"], (data) => {
    includeNotes.checked = data.includeNotes || false;
    customPrompt.value = data.customPrompt || "";
  });

  document.getElementById("saveSettings").addEventListener("click", () => {
    chrome.storage.sync.set({
      includeNotes: includeNotes.checked,
      customPrompt: customPrompt.value,
    });
    alert("Settings saved!");
  });

  policyUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      chrome.storage.local.set({ policyText: reader.result });
    };
    if (file) reader.readAsText(file);
  });
});