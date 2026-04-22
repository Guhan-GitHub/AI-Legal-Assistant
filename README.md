# AI-Powered Legal Assistant (Full-Stack)

An end-to-end web application that helps lawyers and law students **upload case law**, **perform semantic search**, and **request precedent suggestions** using modern NLP techniques.

> **Disclaimer**: This project is for educational and research purposes only. It **does not** provide legal advice and must not be used as a substitute for professional legal judgment.

## Features

- **Case Ingestion**
  - Upload case texts (e.g., judgments, summaries).
  - Store metadata such as jurisdiction, court, and year.
  - Automatically generate a structured, heuristic summary (facts, issues, holding, reasoning, citations).

- **Semantic Search**
  - Search across uploaded cases using **natural language queries**.
  - Uses sentence embeddings and a vector index (FAISS) to find similar cases.
  - Returns titles, snippets, metadata, and similarity scores.

- **Precedent Suggestions**
  - Describe a new legal matter in natural language.
  - The system finds semantically similar cases and suggests them as potential precedents with brief explanations.

- **Modern Full-Stack UI**
  - React (Vite) frontend with a clean, responsive, dark-themed interface.
  - FastAPI backend with clear REST APIs.

## Tech Stack

- **Frontend**
  - React 18 + Vite
  - Vanilla CSS (custom dark theme)

- **Backend**
  - FastAPI (Python)
  - Sentence-Transformers (`all-MiniLM-L6-v2`) for sentence embeddings
  - FAISS (CPU) for vector similarity search

- **Other**
  - `example_cases.txt` with ready-made synthetic test cases and queries in `data/`.

## Project Structure

```text
backend/
  app.py             # FastAPI application and endpoints
  search_engine.py   # In-memory FAISS-based search engine
  summarizer.py      # Placeholder summarizer and precedent reasoning

frontend/
  index.html
  vite.config.mjs
  package.json
  src/
    main.jsx
    App.jsx         # React UI: upload, search, precedent panels
    styles.css      # UI styling

data/
  example_cases.txt  # Example cases, queries, and matter descriptions

requirements.txt     # Python dependencies for the backend
README.md            # High-level project overview and quick start
```

## Setup Instructions

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the project root:

   ```bash
   cd "e:\New folder"
   ```

2. Create and activate a virtual environment (recommended):

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI backend with Uvicorn:

   ```bash
   uvicorn backend.app:app --reload
   ```

   The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup (React + Vite)

1. Open another terminal and navigate to the frontend:

   ```bash
   cd "e:\New folder\frontend"
   ```

2. Install Node dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the printed URL in your browser (usually `http://localhost:5173`).

The frontend is configured to call the backend at `http://127.0.0.1:8000`.

## How to Use

1. **Upload Cases**
   - Go to the **Upload Case** panel.
   - Copy one of the synthetic examples from `data/example_cases.txt` and paste it as the case text with a title and optional metadata.
   - Submit to store the case and view an automatic heuristic summary.

2. **Semantic Search**
   - In the **Semantic Search** panel, enter a natural-language query such as:
     - `"force majeure clause and supply chain disruptions during a pandemic"`
   - The system returns the most semantically similar cases with snippets and scores.

3. **Precedent Suggestions**
   - In the **Precedent Suggestions** panel, paste one of the example matter descriptions from `data/example_cases.txt`.
   - The system suggests similar cases as potential precedents along with a short explanation.

## Limitations and Future Work

- The current summarizer and precedent explanations are **placeholders** and do not yet call a real LLM.
- Cases are stored in memory only; restarting the server clears the index.
- No authentication or user management is included.

Possible extensions (good for a final‑year enhancement chapter):

- Integrate a production-grade LLM (OpenAI, Azure, or open-source) for high‑quality summaries and reasoning.
- Persist cases and embeddings in a database (e.g., PostgreSQL + pgvector, or a managed vector DB).
- Add PDF upload with automatic text extraction.
- Implement user accounts and role-based access control.
- Add logging, monitoring, and basic analytics (e.g., most searched topics).

## Documentation

More detailed system design, API details, and user documentation are available in the `docs/` folder.

