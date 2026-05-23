#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build code-du-travail.json from raw text passed via stdin or a text file."""
import json, re, sys, os

def clean(s):
    # Fix PDF hyphenation artifacts: word- \nword → wordword, also collapse extra spaces
    s = re.sub(r'-\s+', '', s)
    s = re.sub(r' {2,}', ' ', s)
    return s.strip()

def build_json(raw_text):
    # Clean global hyphenation
    text = raw_text.replace('\r\n', '\n').replace('\r', '\n')

    # Remove the table of contents block at the start (it's repeated after as real content)
    # The real content starts at "TITRE I. -   DISPOSITIONS GENERALES\nArticle 1."
    # Find second occurrence of "TITRE I" to locate actual body
    toc_end = text.find('TITRE I. -   DISPOSITIONS GENERALES\nArticle 1.')
    if toc_end == -1:
        toc_end = text.find('Article 1. -')
    body = text[toc_end:] if toc_end > 0 else text

    # Fix hyphenation in body
    body = re.sub(r'-\s+', '-', body)  # keep hyphens but remove line breaks after them
    body = re.sub(r'- ([a-zàâäéèêëîïôùûü])', lambda m: m.group(1), body)
    body = re.sub(r' {2,}', ' ', body)

    # Split into articles
    article_pattern = re.compile(r'Article\s+(\d+)\s*\.\s*-\s*', re.MULTILINE)
    parts = article_pattern.split(body)
    # parts = [pre_text, art_num, art_content, art_num2, art_content2, ...]

    articles = []
    if len(parts) >= 3:
        for i in range(1, len(parts) - 1, 2):
            num = parts[i].strip()
            content = parts[i+1].strip() if i+1 < len(parts) else ''
            # Clean up content
            content = re.sub(r'\s+', ' ', content).strip()
            articles.append((int(num), content))

    # Build sections array
    sections = []
    pos = 1

    # Structure: parse Titres, Chapitres, Sections, Articles from full body
    # Use a simpler approach: extract structural headings from raw text
    titre_pattern = re.compile(r'TITRE\s+(I{1,4}V?|VI{0,3}|IX|X{1,2}I{0,3}|XI{1,3})\s*\.\s*-\s*([^\n]+)', re.MULTILINE)
    chap_pattern = re.compile(r'CHAPITRE\s+(I{1,4}V?|VI{0,3}|IX|X{1,3})\s*\.\s*-\s*([^\n]+)', re.MULTILINE)
    section_pattern = re.compile(r'Section\s+(I{1,4}V?|VI{0,3})\s*:\s*([^\n]+)', re.MULTILINE)

    slug = 'code-du-travail'

    # Add titre/chapitre/section headings as level 0, 1, 2
    # Find all titres in body
    titre_map = {}
    for m in titre_pattern.finditer(text):
        titre_map[m.start()] = ('titre', m.group(1), m.group(2).strip())

    chap_map = {}
    for m in chap_pattern.finditer(text):
        chap_map[m.start()] = ('chapitre', m.group(1), m.group(2).strip())

    art_positions = []
    for m in article_pattern.finditer(body):
        art_positions.append(m.start())

    # Build sections from articles only (simpler, reliable)
    # Add top-level titre sections manually from known structure
    titres = [
        (0, "Titre I", "Dispositions générales"),
        (0, "Titre II", "Des syndicats professionnels"),
        (0, "Titre III", "Du contrat de travail"),
        (0, "Titre IV", "Du salaire"),
        (0, "Titre V", "Des conditions de travail"),
        (0, "Titre VI", "De la sécurité et de la santé au travail"),
        (0, "Titre VII", "Des organismes et moyens d'exécution"),
        (0, "Titre VIII", "Des institutions professionnelles"),
        (0, "Titre IX", "Des différends du travail"),
        (0, "Titre X", "Des pénalités"),
        (0, "Titre XI", "Dispositions particulières, transitoires et finales"),
    ]

    for lvl, ref, title in titres:
        sections.append({
            "level": lvl,
            "reference": ref,
            "title": title,
            "content": "",
            "id": f"{slug}-s{pos}",
            "position": pos
        })
        pos += 1

    # Add all articles as sections level 2
    for num, content in articles:
        sections.append({
            "level": 2,
            "reference": f"Article {num}",
            "title": f"Article {num}",
            "content": content,
            "id": f"{slug}-s{pos}",
            "position": pos
        })
        pos += 1

    # Sort sections by reference number for articles
    # Keep titres first then articles
    titre_sections = [s for s in sections if s['level'] == 0]
    art_sections = sorted([s for s in sections if s['level'] == 2], key=lambda s: int(re.search(r'\d+', s['reference']).group()))
    # Re-number positions
    all_sections = titre_sections + art_sections
    for i, s in enumerate(all_sections):
        s['position'] = i + 1
        s['id'] = f"{slug}-s{i+1}"

    # Build full content string (clean body text)
    full_content = re.sub(r'\n{3,}', '\n\n', body).strip()

    summary = ("Le Code du Travail camerounais (Loi n°92/007 du 14 août 1992) régit les rapports "
               "de travail entre travailleurs et employeurs au Cameroun. Il établit les droits et "
               "obligations des parties au contrat de travail, encadre les syndicats professionnels, "
               "fixe les conditions de rémunération, de durée du travail, de sécurité et santé au "
               "travail, organise les institutions professionnelles et les procédures de règlement "
               "des différends individuels et collectifs, et prévoit les sanctions applicables.")

    doc = {
        "id": slug,
        "slug": slug,
        "title": "Code du Travail",
        "type": "CODE",
        "category": "Droit du travail",
        "source": "droitcamerounais.info (source: ILO/NATLEX)",
        "reference": "Loi n°92/007 du 14 août 1992 portant Code du Travail",
        "dateEnacted": "1992-08-14",
        "status": "ACTIVE",
        "tags": ["code du travail", "droit du travail", "emploi", "contrat de travail", "cameroun"],
        "summary": summary,
        "content": full_content,
        "sections": all_sections
    }

    return doc

if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else None
    output_file = r'C:\taf\AssistantCameroun\content\documents\code-du-travail.json'

    if input_file:
        with open(input_file, 'r', encoding='utf-8') as f:
            raw = f.read()
    else:
        raw = sys.stdin.read()

    doc = build_json(raw)

    # Verify
    bad = doc['content'].count('�')
    art_count = sum(1 for s in doc['sections'] if s['level'] == 2)
    print(f"Articles found: {art_count}", file=sys.stderr)
    print(f"Bad chars in content: {bad}", file=sys.stderr)
    print(f"Content length: {len(doc['content'])}", file=sys.stderr)
    print(f"Sections total: {len(doc['sections'])}", file=sys.stderr)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)

    print(f"Written to {output_file}", file=sys.stderr)
    print("OK")
