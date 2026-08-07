# 🏛️ Evifacto AI: Evidence-Based Business Idea Evaluation Engine

Evifacto AI is a premium full-stack idea validation workspace designed to evaluate new business concepts against real-time market facts. Rather than relying on static AI predictions or guesswork, Evifacto AI deploys an orchestration of live background crawlers to gather evidence from the web, scoring and validating concepts using Gemini AI.

---

## 💎 How Evifacto AI Differs from Existing Platforms

Traditional AI-powered startup validators usually suffer from **model hallucination**—they simply ask an AI model to guess if an idea is good, producing generic, unsubstantiated scores. Evifacto AI changes this by enforcing **factual grounding**:

| Feature | Legacy AI Validators | Evifacto AI |
| :--- | :--- | :--- |
| **Data Integrity** | Hallucinated market size, fake competitors, and guessed sentiment | **Real-Time Data**: Queries Google, Reddit, Hacker News, and GitHub in live streams |
| **Evidence Auditing** | Fails to show references; you must take the AI's word for it | **Direct Links**: Every metric features an `"Audit Source ↗"` button linking to the source |
| **Problem Validation** | Guesses what customers want based on training data | **Pain Mining**: Scrapes actual user complaint quotes directly from target forums |
| **Domain Checks** | Requires manual search on registrar sites | **Parallel DNS Probing**: Runs real-time DNS queries for `.com`, `.io`, and `.ai` |
| **Data Privacy** | In-memory only; restarts wipe all your entries | **Local DB Persistence**: Auto-saves validation history locally to `reports.json` |

---

## 🌀 The Research Orchestration Workflow

Whenever a founder launches validation for a startup concept, the orchestrator executes a coordinated 6-stage workflow:

```
[Founder Input] ──> 1. Parse & Understand ──> 2. Google Trends & Autocomplete 
                                                           │
┌──────────────────────────────────────────────────────────┘
│
└──> 3. Social Pain Miner (Reddit & HN) ──> 4. GitHub Developer Adoption Check
                                                           │
┌──────────────────────────────────────────────────────────┘
│
└──> 5. Product Hunt & IH Auditor ──> 6. Parallel DNS & Gemini Synthesis ──> [Scorecard UI]
```

1. **Brand Extraction & Understanding**: Normalizes the startup tagline (e.g. extracts `HarvestPulse` from `HarvestPulse: B2B Surplus Food Marketplace`) and initializes secondary keyword tokens.
2. **Google Trends & Autocomplete**: Evaluates search volume momentum, keyword velocity trends, and crawls Google's autocomplete index to pull actual user search queries and intent.
3. **Reddit & Hacker News Pain Miner**: Queries target subreddits (`r/SaaS`, `r/startups`, etc.) and the Hacker News Algolia index for real-world user frustrations, extracting raw quote blocks.
4. **GitHub Tech Stack**: Queries active repository stars, forks, and language usage metrics to gauge developer tooling adoption.
5. **Product Hunt & Indie Hackers Auditor**: Scrapes previous launch directories for similar products and scans Indie Hackers case studies for business model failures and revenue post-mortems.
6. **Domain DNS Checker**: Runs asynchronous DNS queries against `.com`, `.io`, and `.ai` extensions to verify true registry availability.
7. **Gemini 3.6 Grounding Synthesis**: Consolidates all datasets and passes them into **Gemini 3.6 Flash** (with Google Search Grounding enabled) to compute scores, map competitors, define TAM/SAM/SOM, and suggest pivots.

---

## 🏗️ System Architecture

Evifacto AI is built as a modular, lightweight full-stack application:

*   **Frontend**: React (TypeScript) + Vite + Recharts + Lucide Icons. Designed with a bright, premium "Old Money" aesthetic (Ivory backgrounds `#FAF8F5`, British Racing Green accents, Classic Navy text, and gold badges).
*   **Backend**: Node.js + Express + ESBuild. 
*   **Persistence**: Flat-file JSON database (`reports.json`) with auto-reload.
*   **Communication**: Server-Sent Events (SSE) stream for real-time validation logs, utilizing a two-way POST-GET handshake to handle long, detailed descriptions without URL length limit errors.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   Gemini API Key (Get a free key from [Google AI Studio](https://aistudio.google.com/))

### Installation
1. Clone your repository:
   ```bash
   git clone https://github.com/praneethreddyyy30/startupsense.git
   cd startupsense
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_gemini_key_here
   PORT=3000
   ```

### Running Locally
To launch both the Vite dev assets and the Express backend server concurrently:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Building for Production
To package the React assets and compile the server bundle to CJS:
```bash
npm run build
npm run start
```

---

## 🛡️ License
Private repository configurations. Feel free to customize and extend for your own startup validation dashboards.
