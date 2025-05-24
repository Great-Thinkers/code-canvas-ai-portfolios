# 🤝 Contributing to Code Canvas AI Portfolios

Thanks for your interest in contributing to **Code Canvas AI Portfolios** — an AI-powered portfolio generator that turns GitHub and LinkedIn data into beautiful, customizable dev portfolios.

---

## 🛠 Project Setup

1. **Fork the repository**
2. **Clone your fork locally**
   ```bash
   git clone https://github.com/your-username/code-canvas-ai-portfolios.git
   cd code-canvas-ai-portfolios
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**
   ```bash
   npm install
   ```
5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # then fill out your environment keys
   ```
6. **Start the development server**
   ```bash
   npm run dev
   ```
7. **Push changes and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🔥 What Can You Contribute?

- 🧠 Improve AI prompts and smart resume generation
- 🎨 Add new portfolio themes/templates
- 🐛 Fix bugs or add tests
- 🌍 Add i18n/l10n support
- 📖 Enhance documentation or onboarding experience

---

## 🧭 Contribution Guidelines

- Follow standard code styles (Prettier + ESLint for TypeScript)
- Use semantic commit messages (`feat:`, `fix:`, `chore:`, etc.)
- Keep pull requests small and focused (1 PR = 1 feature/fix)
- Test your changes before opening a PR

---

## 📁 Directory Overview

```
/src
  /api         # API routes
  /auth        # Auth logic (GitHub/LinkedIn OAuth)
  /components  # UI components
  /templates   # Portfolio themes
  /utils       # Utility functions
  /hooks       # Custom hooks
/public        # Static assets
```

---

## 📬 Questions?

- Open an issue
- Join discussions on GitHub

---

## 🙏 Code of Conduct

This project is a safe and inclusive space for everyone. Please follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

Happy coding! ✨
