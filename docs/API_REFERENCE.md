# API Reference – AI-Powered Legal Assistant

Base URL (development): `http://127.0.0.1:8000`

All endpoints return JSON responses. This document describes request/response formats for the main APIs.

---

## 1. Health Check

### `GET /health`

**Description**: Simple health endpoint to verify that the backend is running.

**Request**: No body.

**Response 200 OK**:

```json
{
  "status": "ok"
}
```

---

## 2. Upload Case

### `POST /upload_case`

**Description**: Upload a new legal case, store its text and metadata, and generate a heuristic summary. Also adds the case to the semantic search index.

**Request Body (JSON)**:

```json
{
  "title": "Alpha Corp v. Beta Ltd (2020)",
  "text": "Full text of the judgment or detailed summary...",
  "jurisdiction": "Example Jurisdiction",
  "court": "High Court",
  "year": 2020
}
```

- **title** (string, required): Human-readable case title.
- **text** (string, required): Full case text or detailed summary. Must not be empty.
- **jurisdiction** (string, optional): Jurisdiction name (e.g., "England and Wales").
- **court** (string, optional): Name of the court (e.g., "Supreme Court").
- **year** (integer, optional): Year of the decision.

**Example Successful Response 200 OK**:

```json
{
  "case_id": 1,
  "summary": {
    "facts": "First ~600 characters of the case text...",
    "issues": "Identify the key legal issues from the case text.",
    "holding": "Summarize the court's main decision.",
    "reasoning": "Explain briefly how the court reached its decision.",
    "citations": "List important cited cases or statutes, if available.",
    "disclaimer": "This is an automated heuristic summary for research only, not legal advice."
  }
}
```

**Possible Error Responses**:

- `400` / `422` – invalid input (e.g., missing required fields).
- `500` – internal error during embedding or indexing.

---

## 3. Semantic Search

### `POST /search`

**Description**: Perform a semantic search over all uploaded cases using a natural-language query.

**Request Body (JSON)**:

```json
{
  "query": "force majeure clause and supply chain disruptions during a pandemic",
  "k": 5
}
```

- **query** (string, required): Free-text search query.
- **k** (integer, optional): Number of top results to return (default: 5).

**Example Successful Response 200 OK**:

```json
{
  "results": [
    {
      "id": 1,
      "title": "Alpha Corp v. Beta Ltd (2020)",
      "snippet": "Short snippet from the beginning of the case text...",
      "meta": {
        "jurisdiction": "Example Jurisdiction",
        "court": "High Court",
        "year": 2020
      },
      "score": 0.86
    }
  ]
}
```

- **id**: Internal case ID assigned on upload.
- **title**: Title of the case.
- **snippet**: First part of the case text for preview (truncated).
- **meta**: Metadata dictionary.
- **score**: Similarity score between query and case text (higher is more similar).

**Edge Cases**:

- If no cases have been uploaded, the endpoint returns:

  ```json
  {
    "results": []
  }
  ```

---

## 4. Precedent Suggestions

### `POST /precedents`

**Description**: Suggest potentially relevant precedents based on a free-text description of a new legal matter.

**Request Body (JSON)**:

```json
{
  "matter_description": "Client was terminated shortly after reporting regulatory issues...",
  "k": 5
}
```

- **matter_description** (string, required): Narrative description of the new case/matter.
- **k** (integer, optional): Number of precedents to return (default: 5).

**Example Successful Response 200 OK**:

```json
{
  "precedents": [
    {
      "id": 3,
      "title": "Kaur v. Global MedTech Inc. (2021)",
      "meta": {
        "jurisdiction": "Example Jurisdiction",
        "court": "Labour Court",
        "year": 2021
      },
      "score": 0.91,
      "reason": "This case is semantically similar to the matter description based on its text and may contain relevant reasoning or precedents."
    }
  ]
}
```

- **id**: Internal case ID.
- **title**: Case title.
- **meta**: Metadata dictionary.
- **score**: Similarity score between matter description and case text.
- **reason**: Simple explanation of why the case may be relevant.

**Notes**:

- Currently, the `reason` field is a heuristic message. In a more advanced version, this can be generated using a large language model over the retrieved cases.

---

## 5. Error Handling

In error cases, the APIs return a JSON body with a `detail` field describing the problem, for example:

```json
{
  "detail": "Case text is empty."
}
```

Common HTTP status codes:

- `400` / `422`: Validation errors (invalid or missing input).
- `500`: Unexpected server error (e.g., embedding model failure).

---

## 6. Usage Notes

- All endpoints accept and return **JSON**.
- CORS is enabled with `allow_origins=["*"]` in development to simplify frontend integration.
- For production:
  - Restrict allowed origins.
  - Add authentication and rate-limiting.

