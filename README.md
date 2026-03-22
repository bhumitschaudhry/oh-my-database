# 🔮 QueryForge

### Transform Natural Language into SQL Queries

[![Status](https://img.shields.io/badge/status-v1.0%20Complete-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)
[![Platform](https://img.shields.io/badge/platform-GitHub%20Pages-cyan)](#)

> **QueryForge** is a browser-based text-to-SQL agent that helps non-technical users explore and understand their database data—without writing SQL or installing software.

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
   https://yourusername.github.io/queryforge
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

| What You Ask | QueryForge Generates |
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
| Frontend | Vanilla JavaScript (ES2020+) |
| AI Integration | REST APIs (OpenAI, Gemini, Anthropic, NVIDIA NIM, OpenRouter) |
| SQL Validation | AST Parsing |
| Styling | Custom CSS with modern design |
| Hosting | GitHub Pages (static) |

---

## 📁 Project Structure

```
├── index.html          # Main application
├── src/
│   ├── app.js          # Core application logic
│   ├── ai/
│   │   ├── providers.js    # AI provider integration
│   │   └── sql-generator.js # Natural language to SQL
│   ├── ui/
│   │   ├── components.js   # UI components
│   │   └── styles.css      # Application styles
│   └── utils/
│       ├── schema-parser.js # Database schema parsing
│       └── sql-validator.js # SQL query validation
├── .planning/          # Project planning docs
└── README.md           # This file
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

*QueryForge — Democratizing data access*

</div>
