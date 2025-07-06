# ServiceDesk Ollama Extension

A Chrome/Edge browser extension that helps IT technicians manage Service Requests (SRs) in ServiceDesk Cloud using an offline AI model via [Ollama](https://ollama.com).

## ✨ Features

- 🧠 GPT-style smart reply generation using **local LLMs** (Mistral, LLaMA3, etc.)
- 🧾 Auto-load SR title and description from the page DOM
- 💬 Chronological SR conversation view (planned)
- 📬 Click-to-generate reply
- ❌ Easy close button inside the UI

## 🖥 Requirements

- [Ollama](https://ollama.com) running locally
- Model like `mistral`, `llama3`, etc. pulled and running (`ollama run mistral`)

## 🔧 Installation (Chrome/Edge)

1. Go to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select this folder

## 🚀 Coming Soon

- SR conversation parser (user vs. internal messages)
- Smart auto-reply injection into ServiceDesk UI
- SR memory tracking

## 📃 License

MIT (or internal use only)