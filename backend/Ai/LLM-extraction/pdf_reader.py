"""
pdf_reader.py
-------------
Extracts raw text from PDF files (CV uploads).
Uses pdfplumber for reliable text extraction.
"""

import pdfplumber
import os


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts all text from a PDF file.

    Parameters
    ----------
    file_path : str — absolute or relative path to the PDF file

    Returns
    -------
    str — the full extracted text from all pages
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found: {file_path}")

    full_text = []

    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                full_text.append(text)
            else:
                print(f"[pdf_reader] Warning: page {i+1} has no extractable text (might be scanned image)")

    if not full_text:
        raise ValueError("Could not extract any text from the PDF. It might be a scanned image.")

    return "\n".join(full_text)


def extract_text_from_resume_model(resume) -> str:
    """
    Extracts text directly from a candidate_resume Django model instance.

    Parameters
    ----------
    resume : candidate_resume — Django model instance with resume_file field

    Returns
    -------
    str — extracted text from the PDF
    """
    file_path = resume.resume_file.path  # Django donne moi le  path
    return extract_text_from_pdf(file_path)