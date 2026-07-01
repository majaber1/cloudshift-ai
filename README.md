# CloudShift AI ☁️

> AI-powered cloud migration and compliance readiness assistant. Analyze infrastructure, generate migration plans, and identify compliance gaps — powered by Ollama (local AI, no paid APIs).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-compose-blue.svg)
![AI](https://img.shields.io/badge/AI-Ollama%20%7C%20Qwen-green.svg)

## 🎯 What It Does

CloudShift AI helps government entities, enterprises, and consulting companies assess cloud readiness:

- 📤 **Upload Discovery Reports** — PDF, DOCX, TXT assessments
- 📊 **Cloud Readiness Score** — AI-generated score across 10 categories
- ⚠️ **Migration Risk Analysis** — Identify and prioritize risks
- 🏗️ **Landing Zone Recommendations** — Architecture guidance
- 🔒 **Security & Compliance Gaps** — NCA ECC, ISO 27001, PDPL
- 📋 **Executive Report** — Professional report for leadership
- 📤 **Export to Markdown** — Ready-to-use report

## 📊 Assessment Categories

Compute | Storage | Network | Security | Identity | Backup | DR | Monitoring | Cost | Compliance

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| AI Engine | Ollama (local) |
| Vector DB | ChromaDB |
| Container | Docker Compose |

## 🤖 AI Models (Free & Local)

Default: `qwen2.5:7b-instruct`
Change in `.env`: `OLLAMA_MODEL=qwen2.5:7b-instruct`
Also supports: `llama3.1:8b`, `mistral:7b`

## 🚀 Quick Start

```bash
git clone https://github.com/majaber1/cloudshift-ai.git
cd cloudshift-ai
cp .env.example .env
ollama pull qwen2.5:7b-instruct
docker compose up -d
```

Open http://localhost:3000 | Login: admin@demo.com / demo123

## 🧪 Test in 10 Minutes

1. Open http://localhost:3000 and login
2. Go to "Upload Assessment"
3. Upload `samples/sample-discovery.txt`
4. Click "Analyze with AI"
5. View readiness score and risks
6. Generate executive report
7. Export to Markdown

## 📁 Project Structure

```
cloudshift-ai/
├── frontend/
│   └── app/
│       ├── page.tsx           # Landing page (blue/dark enterprise)
│       ├── login/             # Login page
│       ├── dashboard/         # Main dashboard
│       ├── upload/            # Upload assessment files
│       ├── readiness/         # Readiness score page
│       ├── risks/             # Risk analysis page
│       ├── recommendations/   # Recommendations page
│       ├── report/            # Report generator page
│       └── settings/          # Settings
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── assessments.py
│   │   ├── analysis.py
│   │   └── reports.py
│   ├── services/
│   │   ├── ollama_service.py
│   │   └── document_service.py
│   └── prompts/
│       ├── cloud_readiness_analyzer.txt
│       ├── migration_risk_analyzer.txt
│       ├── landing_zone_reviewer.txt
│       ├── security_baseline_checker.txt
│       ├── compliance_gap_analyzer.txt
│       └── executive_report_generator.txt
├── docker-compose.yml
├── .env.example
├── samples/
├── screenshots/
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

## 💰 Commercial Pricing

| Package | Price | Description |
|---------|-------|-------------|
| One-time Assessment | SAR 5,000 | Single cloud readiness assessment |
| Migration Readiness Package | SAR 15,000 | Full assessment + roadmap |
| Enterprise Assessment | SAR 50,000+ | Multi-cloud, compliance, full report |

## ⚠️ Known Limitations

- Large documents (>100 pages) may take 5-10 minutes
- AI quality depends on Ollama model
- First startup requires model download (~4GB)

## 🗺️ Roadmap

- [ ] Multi-document assessment consolidation
- [ ] Arabic language report support
- [ ] Custom scoring frameworks
- [ ] Integration with cloud provider APIs for live discovery
- [ ] Automated remediation recommendations
- [ ] PDF export for reports

## 📄 License

MIT License — see LICENSE for details.
