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
