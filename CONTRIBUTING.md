# Contributing to CloudShift AI

Thank you for your interest in contributing to CloudShift AI!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/cloudshift-ai.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit: `git commit -m "feat: describe your change"`
6. Push: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

```bash
cp .env.example .env
docker compose up -d
ollama pull qwen2.5:7b-instruct
```

## Contribution Ideas

- Add new AI prompt templates
- Improve readiness scoring logic
- Add new assessment categories
- Improve Arabic language support
- Add data visualization for scores
- Add PDF export for reports
- Add more compliance frameworks (GDPR, HIPAA, PCI DSS)
- Write tests

## Code Style

- Python: Follow PEP 8
- TypeScript: Use TypeScript types
- Components: Use functional components with hooks
- Commits: Use conventional commits (feat:, fix:, docs:)

## Questions?

Open an issue or start a discussion in the GitHub repository.
