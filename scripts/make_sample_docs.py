"""Generate six deterministic, fake scholarship demo documents (PNG + PDF)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "demo_docs"

SAMPLES = {
    "income_riya": [
        "INCOME CERTIFICATE",
        "Name: Riya Hasmukhbhai Patel",
        "Annual family income: INR 96,000",
        "Certificate number: REV/AND/2026/049182",
        "Issue date: 2026-04-10",
        "Authority: Anand Mamlatdar Office",
    ],
    "income_meera": [
        "INCOME CERTIFICATE",
        "Name: Meera Ramesh Parmar",
        "Annual family income: INR 132,500",
        "Certificate number: REV/BOR/2026/067314",
        "Issue date: 2026-03-22",
        "Authority: Borsad Mamlatdar Office",
    ],
    "caste_obc": [
        "CASTE CERTIFICATE",
        "Name: Riya Hasmukhbhai Patel",
        "Caste category: OBC / SEBC",
        "Certificate number: CST/GUJ/2024/99102",
        "Issue date: 2024-08-12",
        "Authority: District Collector, Anand",
    ],
    "marksheet_class8": [
        "GSEB CLASS 8 MARKSHEET",
        "Name: Riya Hasmukhbhai Patel",
        "School: Shree Sardar Patel High School",
        "Academic year: 2025-26",
        "Marks: 79 percent",
        "Attendance: 88 percent",
        "Certificate number: GSEB/2026/MS-88124",
    ],
    "bank_mother": [
        "BANK ACCOUNT PASSBOOK",
        "Account holder: Hetalben Patel",
        "Relationship: Mother / Guardian",
        "Bank: State Bank of India",
        "Account number: XXXX XXXX 4521",
        "IFSC: SBIN0001234",
    ],
    "aadhaar_masked": [
        "MASKED IDENTITY DOCUMENT",
        "Name: Riya Hasmukhbhai Patel",
        "Aadhaar: XXXX-XXXX-8912",
        "This is fabricated demo data. Not a real identity document.",
    ],
}


def make_pdf(lines: list[str], destination: Path) -> None:
    escaped = [line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)") for line in lines]
    commands = ["BT", "/F1 13 Tf", "50 790 Td"]
    for index, line in enumerate(escaped):
        if index:
            commands.append("0 -30 Td")
        commands.append(f"({line}) Tj")
    commands.append("ET")
    stream = "\n".join(commands).encode("latin-1", errors="replace")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
    ]
    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, body in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{index} 0 obj\n".encode())
        pdf.extend(body)
        pdf.extend(b"\nendobj\n")
    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(offsets)}\n0000000000 65535 f \n".encode())
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode())
    pdf.extend(f"trailer\n<< /Size {len(offsets)} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode())
    destination.write_bytes(pdf)


def make_png(lines: list[str], destination: Path) -> None:
    image = Image.new("RGB", (1200, 800), "white")
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()
    y = 90
    draw.rectangle((35, 35, 1165, 765), outline="#315c4b", width=4)
    for index, line in enumerate(lines):
        draw.text((90, y), line, fill="#18352b" if index == 0 else "#202824", font=font)
        y += 62
    image.save(destination, format="PNG")


def make_handover_proof(destination: Path) -> None:
    image = Image.new("RGB", (960, 540), "#eef3ed")
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()
    draw.rounded_rectangle((36, 36, 924, 504), radius=24, outline="#315c4b", width=5, fill="white")
    draw.text((90, 130), "VIDYA PRAGATI SETU", fill="#18352b", font=font)
    draw.text((90, 205), "CYCLE HANDOVER DEMO PROOF", fill="#315c4b", font=font)
    draw.text((90, 280), "Synthetic placeholder image - not a real recipient photo", fill="#202824", font=font)
    draw.text((90, 350), "Seeded delivery record includes GPS coordinates and an officer receipt.", fill="#202824", font=font)
    image.save(destination, format="PNG")


def generate(output: Path = OUT) -> dict[str, list[str]]:
    output.mkdir(parents=True, exist_ok=True)
    for name, lines in SAMPLES.items():
        make_pdf(lines, output / f"{name}.pdf")
        make_png(lines, output / f"{name}.png")
    (output / "samples.json").write_text(json.dumps(SAMPLES, indent=2) + "\n")
    return SAMPLES


if __name__ == "__main__":
    generated = generate()
    print(f"Generated {len(generated)} fake sample documents ({len(generated) * 2} PNG/PDF files) in {OUT}")
