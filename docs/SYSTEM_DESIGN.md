# System Design – AI-Powered Legal Assistant

## 1. High-Level Overview

The system is a **full-stack web application** that allows users to:

1. Upload legal case texts with basic metadata.
2. Store vector representations (embeddings) of each case.
3. Perform **semantic search** over the case corpus.
4. Request **precedent suggestions** for a described legal matter.

It is designed as a research assistant, not a legal decision-maker.

## 2. Architecture Diagram (Conceptual)

- **Frontend (React + Vite)**
  - Provides UI for:
    - Uploading cases
    - Running semantic search
    - Requesting precedents

- **Backend (FastAPI)**
  - REST APIs:
    - `/upload_case`
    - `/search`
    - `/precedents`
    - `/health`
  - Components:
    - `CaseSearchEngine` (embeddings + FAISS index)
    - Summarizer and precedent suggestion logic

- **Data Layer**
  - In-memory Python structures to store:
    - Case texts and metadata
    - Embedding vectors (via FAISS index)
  - Example data file:
    - `data/example_cases.txt`

## 3. Backend Components

### 3.1 FastAPI Application (`backend/app.py`)

- Configures the FastAPI app and CORS.
- Exposes core endpoints.

**Core endpoints:**

- `GET /health`
  - Simple health check.

- `POST /upload_case`
  - Input: JSON body with `title`, `text`, and optional `jurisdiction`, `court`, `year`.
  - Actions:
    - Calls `CaseSearchEngine.add_case` to:
      - Encode the text as an embedding.
      - Store the case and update the FAISS index.
    - Calls `summarize_text` for a heuristic structured summary.
  - Output: `case_id` and a `summary` object.

- `POST /search`
  - Input: JSON body with `query` and optional `k` (top‑K results).
  - Actions:
    - Encodes the query as an embedding.
    - Uses FAISS to find the most similar cases.
  - Output: List of results containing:
    - `id`, `title`, a text `snippet`, `meta`, and `score`.

- `POST /precedents`
  - Input: JSON body with `matter_description` and optional `k`.
  - Actions:
    - Performs a semantic search using the `matter_description`.
    - Calls `suggest_precedents` to generate basic rationales.
  - Output: List of suggested precedents with:
    - `id`, `title`, `meta`, `score`, and `reason`.

### 3.2 Search Engine (`backend/search_engine.py`)

- Uses **Sentence-Transformers** (`all-MiniLM-L6-v2`) to compute vector embeddings for case texts.
- Uses **FAISS** (CPU) for similarity search.

**Key responsibilities:**

- `add_case(title, text, meta)`
  - Validates non-empty text.
  - Encodes the text into a normalized embedding.
  - Adds the embedding to the in-memory FAISS index.
  - Stores the case in a Python list along with a generated `id`.

- `search(query, k)`
  - Encodes the query into an embedding.
  - Uses FAISS inner product search to retrieve the top‑K most similar cases.
  - Returns lightweight result objects (no full text; only snippet).

### 3.3 Summarizer and Precedent Logic (`backend/summarizer.py`)

- `summarize_text(text)`
  - Currently a **placeholder** that:
    - Trims and shortens the text for a "facts" preview.
    - Returns generic placeholders for issues, holding, reasoning, and citations.
  - Designed to be replaced by a real LLM-based summarizer.

- `suggest_precedents(matter_description, search_results)`
  - Wraps search results into a higher-level structure for precedents.
  - Adds a brief generic explanation of why each result might be relevant.
  - Can be extended to:
    - Ask an LLM to reason over search results.
    - Rank or filter cases more intelligently.

## 4. Frontend Components

### 4.1 Main Entry (`frontend/src/main.jsx`)

- Initializes the React application.
- Renders the `App` component into `#root`.

### 4.2 Application UI (`frontend/src/App.jsx`)

The app is divided into three main panels:

1. **Upload Case Panel**
   - Form inputs for:
     - Title
     - Jurisdiction, court, year (optional)
     - Full case text
   - On submit:
     - Sends POST `/upload_case` request.
     - Shows the returned structured summary.

2. **Semantic Search Panel**
   - Search box for natural-language queries.
   - On submit:
     - Sends POST `/search`.
     - Displays a list of results with:
       - Title
       - Court, jurisdiction, year (if available)
       - Text snippet
       - Similarity score

3. **Precedent Suggestions Panel**
   - Textarea for matter descriptions.
   - On submit:
     - Sends POST `/precedents`.
     - Displays suggested precedents with:
       - Title, metadata
       - Reason (simple textual explanation)
       - Similarity score

### 4.3 Styling (`frontend/src/styles.css`)

- Implements a modern, dark-themed, responsive layout using CSS.
- Two-column layout on larger screens, collapses to a single column on smaller screens.

## 5. Data Flow

1. **Case Upload**
   - User fills out the form -> frontend sends JSON to `/upload_case`.
   - Backend:
     - Validates and embeds text.
     - Stores case and updates FAISS index.
     - Returns a summary.

2. **Semantic Search**
   - User submits query -> frontend sends JSON to `/search`.
   - Backend:
     - Embeds the query.
     - Uses FAISS to retrieve top‑K results.
     - Returns result list to frontend.

3. **Precedent Suggestions**
   - User describes a matter -> frontend sends JSON to `/precedents`.
   - Backend:
     - Reuses the search mechanism with the matter description.
     - Wraps results with rationale texts.

## 6. Non-Functional Considerations

- **Security**
  - No authentication in the MVP; suitable for local or controlled lab environments.
  - For production: add authentication, authorization, and HTTPS.

- **Scalability**
  - Current implementation stores data in memory:
    - Suitable for a small to medium number of cases in a demo or research setting.
    - For larger deployments, replace:
      - In-memory list with a database (e.g., PostgreSQL).
      - Local FAISS index with a persistent vector database.

- **Maintainability**
  - Clear separation between:
    - API layer (`app.py`)
    - Search and summarization logic (`search_engine.py`, `summarizer.py`)
    - Frontend UI (`App.jsx`, `styles.css`)

## 7. Possible Extensions

- Replace placeholder summarizer with an LLM API integration.
- Add PDF upload and text extraction.
- Add persistent storage and indexing.
- Introduce user accounts and access control.
- Add logging, metrics, and error tracking for observability.

