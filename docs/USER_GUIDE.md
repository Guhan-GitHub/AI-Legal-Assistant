# User Guide – AI-Powered Legal Assistant

This guide explains how to **run** and **use** the AI-Powered Legal Assistant web application, written for final year project evaluation (students, supervisors, and examiners).

> **Important**: This system is a research tool and must not be treated as legal advice.

---

## 1. Prerequisites

- **Python** 3.9+ installed
- **Node.js** (LTS version recommended, e.g., 18+)
- Internet connection for downloading Python and Node packages on first run

---

## 2. Starting the Application

### 2.1 Start the Backend (FastAPI)

1. Open a terminal and navigate to the project root:

   ```bash
   cd "e:\New folder"
   ```

2. (Recommended) Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:

   ```bash
   uvicorn backend.app:app --reload
   ```

5. Confirm it is running by visiting:

   - `http://127.0.0.1:8000/health`

   You should see:

   ```json
   { "status": "ok" }
   ```

### 2.2 Start the Frontend (React + Vite)

1. Open a second terminal and navigate to the frontend:

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

4. Open the printed URL in your browser (typically `http://localhost:5173`).

---

## 3. Using the Web Interface

The main screen is divided into three panels:

1. **Upload Case** (left column)
2. **Semantic Search** (right column, top)
3. **Precedent Suggestions** (right column, bottom)

### 3.1 Uploading a Case

1. Go to the **Upload Case** section.
2. Fill in:
   - **Case title** (e.g., “Alpha Corp v. Beta Ltd (2020)”)
   - Optional:
     - Jurisdiction
     - Court
     - Year
   - **Case text**:
     - Paste the full text of a judgment or a detailed summary.
     - You can use one of the synthetic examples from `data/example_cases.txt`.
3. Click **“Upload & Summarize”**.
4. If successful:
   - The case is stored in the backend and indexed for semantic search.
   - A **structured summary** appears under “Last Uploaded Summary” with:
     - Facts
     - Issues
     - Holding
     - Reasoning
     - Citations
     - Disclaimer

> Note: The current summary is heuristic and generic. In future work, this can be replaced by a real LLM-based summarizer.

### 3.2 Running Semantic Search

1. Go to the **Semantic Search** panel.
2. Enter a **natural-language query**, for example:
   - “force majeure clause and supply chain disruptions during a pandemic”
   - “duty of care of public transport operators to passengers”
3. Click **“Search”**.
4. The system displays a list of matching cases, each showing:
   - Title
   - Court, jurisdiction, year (if available)
   - Text snippet
   - Similarity score

The higher the similarity score, the more semantically similar the case is to your query.

### 3.3 Getting Precedent Suggestions

1. Go to the **Precedent Suggestions** panel.
2. Enter a detailed **matter description**, e.g.:

   - “An employee raised internal concerns about regulatory violations in a healthcare company and was dismissed during a so-called restructuring soon after.”

   (You can reuse the sample descriptions from `data/example_cases.txt`.)

3. Click **“Suggest Precedents”**.
4. The system returns a list of suggested precedents:
   - Title and metadata
   - Similarity score
   - Brief reason why the case may be relevant

> This is intended to support legal research by suggesting similar cases, not to automatically decide outcomes.

---

## 4. Testing with Example Data

The file `data/example_cases.txt` contains:

- Three synthetic example cases:
  - Contract (force majeure, damages)
  - Tort (negligence, duty of care, contributory negligence)
  - Employment (whistleblower retaliation)
- Example search queries.
- Example matter descriptions.

### Recommended Test Flow

1. Upload all three example cases.
2. Run the suggested search queries.
3. Paste each example matter description into the Precedent panel.
4. Verify that the most relevant synthetic case is returned with a high similarity score.

This workflow demonstrates the core capabilities of the system during a project demo.

---

## 5. Limitations & Safety

- The current system:
  - Uses in-memory storage; cases are lost when the backend restarts.
  - Uses a simple, placeholder summarizer and reasoning component.
  - Has no authentication or authorization.
- It is **not** suitable for:
  - Real client work.
  - Sensitive or confidential data in a production environment.

All user-facing messages emphasize that the tool is **for research and educational purposes only**.

---

## 6. For Examiners / Supervisors

When evaluating this final year project, you can focus on:

- **Architecture**:
  - Clear separation between frontend, backend, and NLP logic.
  - Use of embeddings and vector search for legal text.
- **Implementation Quality**:
  - Clean code structure in Python and React.
  - Error handling and meaningful UI feedback.
- **Extensibility**:
  - Obvious hooks for future work (LLM integration, databases, authentication).

The accompanying `SYSTEM_DESIGN.md` and `API_REFERENCE.md` in the `docs/` folder provide deeper technical details.

