# 🔮 ohmydatabase

### Transform Natural Language into SQL Queries

[![Status](https://img.shields.io/badge/status-v1.0%20Complete-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-cyan)](#)

> **ohmydatabase** is a browser-based text-to-SQL agent that helps non-technical users explore and understand their database data—without writing SQL or installing software.

---

## ✨ Features

- 🌐 **100% Browser-Based** — No installation, no backend, runs anywhere
- 🔑 **Multiple AI Providers** — Support for NVIDIA NIM, OpenAI, Google Gemini, Anthropic, and OpenRouter
- 🛡️ **Your Keys, Your Data** — API keys stored locally in your browser, never sent to our servers
- 📊 **Universal Schema Support** — Paste any SQL database schema to get started
- 🔍 **Transparent SQL** — Review generated queries before execution
- ⚡ **Rate Limited** — Built-in protection against API quota exhaustion
- 📋 **One-Click Copy** — Export results to clipboard instantly

---

## 🚀 Getting Started

### Quick Setup

1. **Open the App**
   ```
   https://yourusername.github.io/ohmydatabase
   ```

2. **Paste Your Schema**
   - Copy the `CREATE TABLE` or schema output from your database
   - Paste it into the schema input field

3. **Add Your API Key**
   - Go to **Settings** (⚙️ icon)
   - Select your preferred AI provider
   - Enter your API key
   - Keys are stored securely in your browser's localStorage

4. **Ask Questions**
   - Type your question in plain English
   - Click **Generate & Execute**
   - Review the SQL, then see your results!

---

## 📖 Usage

### Example Queries

| What You Ask | ohmydatabase Generates |
|--------------|---------------------|
| "How many users signed up this month?" | `SELECT COUNT(*) FROM users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);` |
| "Show me the top 10 products by revenue" | `SELECT name, SUM(revenue) as total FROM products GROUP BY name ORDER BY total DESC LIMIT 10;` |
| "List all orders from the last week" | `SELECT * FROM orders WHERE order_date >= CURRENT_DATE - INTERVAL '7 days';` |

### Supported AI Providers

| Provider | Model | Status |
|----------|-------|--------|
| 🔷 NVIDIA NIM | llama-3.1-nemotron-70b-instruct | Primary |
| 🤖 OpenAI | GPT-4o-mini | Supported |
| 🔴 Google | Gemini 2.0 Flash | Supported |
| 🟠 Anthropic | Claude 3.5 Haiku | Supported |
| 🟣 OpenRouter | Multiple models | Supported |

---

## 🔒 Security & Privacy

- **Local Storage Only** — Your API keys stay in your browser
- **No Server Communication** — All AI requests go directly to providers
- **No Data Persistence** — Queries are session-only
- **SELECT-Only Enforcement** — Generated queries are validated to be read-only

> ⚠️ **Important:** Your API keys have access to your database. Keep them secure and rotate regularly.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (React 19) |
| Styling | Tailwind CSS + Radix UI |
| State Management | Zustand with persistence |
| AI Integration | REST APIs (OpenAI, Gemini, Anthropic, NVIDIA NIM, OpenRouter) |
| SQL Execution | sql.js (SQLite in the browser) |
| Hosting | GitHub Pages (static) |

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── page.tsx          # Landing page
│   │   ├── settings/         # Settings page
│   │   └── query/            # Query execution page
│   ├── components/
│   │   ├── landing/          # Landing page components
│   │   └── ui/               # Reusable UI components
│   ├── stores/
│   │   └── app-store.ts      # Zustand state management
│   └── lib/
│       ├── ai/               # AI provider integration
│       ├── db/               # SQL.js database logic
│       └── utils/            # Schema parser, SQL validator
├── .planning/                # Project planning docs
└── README.md                 # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for non-technical database users**

*ohmydatabase — Democratizing data access*

</div>
