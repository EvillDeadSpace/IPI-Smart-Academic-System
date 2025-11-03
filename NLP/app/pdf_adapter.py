"""Adapter to expose generate_health_pdf from the document-service script.

This avoids changing package layout or sys.path: it dynamically loads the
`NLP/document-service/main.py` module and re-exports `generate_health_pdf`.

If you later refactor to a proper package, you can replace this with a
regular import.
"""
from __future__ import annotations

import importlib.util
import os
from typing import Callable


def _load_generate_health_pdf() -> Callable:
    base_dir = os.path.dirname(os.path.dirname(__file__))  # NLP/app -> NLP
    module_path = os.path.join(base_dir, "document-service", "main.py")

    if not os.path.exists(module_path):
        raise FileNotFoundError(f"Could not find document-service module at {module_path}")

    spec = importlib.util.spec_from_file_location("document_service_main", module_path)
    module = importlib.util.module_from_spec(spec)
    loader = spec.loader
    assert loader is not None
    loader.exec_module(module)

    if not hasattr(module, "generate_health_pdf"):
        raise AttributeError("document-service.main does not define generate_health_pdf")

    return getattr(module, "generate_health_pdf")


# Load once at import time
generate_health_pdf = _load_generate_health_pdf()

__all__ = ["generate_health_pdf"]
