async function buildPrompt(conversation, notesIncluded) {
  const { customPrompt, policyText } = await new Promise(resolve =>
    chrome.storage.sync.get(["customPrompt"], settings => {
      chrome.storage.local.get(["policyText"], policy => {
        resolve({ ...settings, ...policy });
      });
    })
  );

  let context = customPrompt || "";
  if (policyText) context += "\n\n" + policyText;

  const conversationPart = notesIncluded ? conversation.fullText : conversation.textWithoutNotes;
  return context + "\n\nConversation:\n" + conversationPart;
}