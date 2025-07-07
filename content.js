function parseSRThread() {
  const container = document.querySelector('.conversation-parent-container');
  if (!container) return [];

  const entries = [];
  const rows = container.querySelectorAll('tr[id^="conList"], tr.last-thread');

  rows.forEach(row => {
    const isNote = row.querySelector('.wo-notes-msg');
    const isDescription = row.id === 'conListDesc';
    const userSpan = row.querySelector('.users-info');
    const timeSpan = row.querySelector('.wo-con-timestamp');
    const contentDiv = row.querySelector('.conversation-container') || row.querySelector('[id^="notiDesc_"]');

    if (!userSpan || !timeSpan || !contentDiv) return;

    entries.push({
      type: isNote ? 'note' : isDescription ? 'email' : 'reply',
      from: userSpan.innerText.trim(),
      time: timeSpan.innerText.trim(),
      content: contentDiv.innerText.trim()
    });
  });

  return entries;
}

const replyBox = document.createElement('textarea');
replyBox.id = 'ollamaReplyBox';
replyBox.placeholder = 'AI generated reply will appear here...';
replyBox.style = 'position:fixed;bottom:110px;right:20px;z-index:9999;width:320px;height:120px;padding:8px;border-radius:6px;border:1px solid #ccc;resize:vertical;background:white;color:#000;font-size:14px;';
document.body.appendChild(replyBox);

const btn = document.createElement('button');
btn.innerText = '🧵 Parse Thread';
btn.style = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:8px 14px;background:#004aad;color:white;border:none;border-radius:6px;';
btn.onclick = () => {
  const parsed = parseSRThread();
  console.log("Parsed SR Thread:", parsed);
  alert(`Parsed ${parsed.length} entries. See console.`);
};
document.body.appendChild(btn);

const replyBtn = document.createElement('button');
replyBtn.innerText = '💬 Generate Reply';
replyBtn.style = 'position:fixed;bottom:60px;right:20px;z-index:9999;padding:8px 14px;background:#00aa4f;color:white;border:none;border-radius:6px;';
replyBtn.onclick = async () => {
  const thread = parseSRThread();
  const summary = thread.map(entry =>
    `${entry.from} [${entry.time}] (${entry.type.toUpperCase()}):\n${entry.content}\n\n`
  ).join('');

  chrome.runtime.sendMessage({ action: 'getOllamaSettings' }, (response) => {
    const model = response.model;
    const port = response.port;
    const prompt = `${response.prompt}\n\nConversation History:\n${summary}`;

    chrome.runtime.sendMessage(
      {
        action: 'generateOllamaResponse',
        model,
        prompt,
        port
      },
      (replyResponse) => {
        if (replyResponse.success) {
          const reply = replyResponse.response.trim();
          replyBox.value = reply;  // show reply here
        } else {
          console.error("Ollama fetch error:", replyResponse.error);
          alert("Failed to get response from Ollama. Check console.");
        }
      }
    );
  });
};
document.body.appendChild(replyBtn);
