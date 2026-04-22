from typing import List, Dict, Any


def summarize_text(text: str) -> Dict[str, str]:
    """
    Placeholder summarizer.
    In a real deployment, call an LLM API here and return structured fields.
    """
    trimmed = text.strip()
    preview = trimmed[:600] + ("..." if len(trimmed) > 600 else "")
    return {
        "facts": preview,
        "issues": "Identify the key legal issues from the case text.",
        "holding": "Summarize the court's main decision.",
        "reasoning": "Explain briefly how the court reached its decision.",
        "citations": "List important cited cases or statutes, if available.",
        "disclaimer": "This is an automated heuristic summary for research only, not legal advice.",
    }


def suggest_precedents(
    matter_description: str, search_results: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Simple precedent suggestion based on similarity scores from search.
    In a real deployment, you would add an LLM to generate richer rationales.
    """
    precedents: List[Dict[str, Any]] = []
    for result in search_results:
        precedents.append(
            {
                "id": result["id"],
                "title": result["title"],
                "meta": result.get("meta", {}),
                "score": result.get("score", 0.0),
                "reason": (
                    "This case is semantically similar to the matter description "
                    "based on its text and may contain relevant reasoning or precedents."
                ),
            }
        )
    return precedents

