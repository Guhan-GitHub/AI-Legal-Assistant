from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


class CaseSearchEngine:
    def __init__(self, dim: int = 384):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.IndexFlatIP(dim)
        self.cases: List[Dict[str, Any]] = []
        self._next_id = 1

    def add_case(self, title: str, text: str, meta: Dict[str, Any] | None = None) -> int:
        if not text.strip():
            raise ValueError("Case text is empty.")
        emb = self.model.encode([text], normalize_embeddings=True)
        self.index.add(emb.astype("float32"))
        case_id = self._next_id
        self._next_id += 1
        self.cases.append(
            {
                "id": case_id,
                "title": title,
                "text": text,
                "meta": meta or {},
            }
        )
        return case_id

    def search(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        if not self.cases:
            return []
        q_emb = self.model.encode([query], normalize_embeddings=True).astype("float32")
        scores, idxs = self.index.search(q_emb, min(k, len(self.cases)))
        results: List[Dict[str, Any]] = []
        for idx, score in zip(idxs[0], scores[0]):
            case = self.cases[int(idx)]
            results.append(
                {
                    "id": case["id"],
                    "title": case["title"],
                    "snippet": case["text"][:500],
                    "meta": case["meta"],
                    "score": float(score),
                }
            )
        return results

    def get_case_by_id(self, case_id: int) -> Dict[str, Any] | None:
        for case in self.cases:
            if case["id"] == case_id:
                return case
        return None


search_engine = CaseSearchEngine()

