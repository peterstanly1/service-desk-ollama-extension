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

  const prompt = `
You are an IT service desk assistant. Based on the following SR conversation history, generate a polite, professional response that follows company policies. Only respond to the last user message if it needs action.

Policies:
${localStorage.getItem('ollama_policies') || 'No policies loaded'}

Conversation History:
${summary}
`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3',
      prompt,
      stream: false
    })
  });
  const data = await response.json();
  const reply = data.response.trim();

  // Find reply box and insert text
  const textareas = document.querySelectorAll('textarea');
  let inserted = false;
  for (const ta of textareas) {
    if (ta.offsetParent !== null) {
      ta.value = reply;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      inserted = true;
      break;
    }
  }

  if (!inserted) alert("Reply box not found.");
};
document.body.appendChild(replyBtn);
