from docx import Document
import os

books = [
    ("C:/Users/MAKOTO/Desktop/tarot_project/tarot_books/4.78度的智慧.docx", "78_wisdom.txt"),
    ("C:/Users/MAKOTO/Desktop/tarot_project/11.你可以再塔罗一点(OCR).docx", "can_be_more_tarot.txt"),
]

output_dir = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw"

for docx_path, output_name in books:
    print(f"Processing: {docx_path}")
    
    doc = Document(docx_path)
    
    paragraphs = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            paragraphs.append(text)
    
    full_text = "\n\n".join(paragraphs)
    
    output_path = os.path.join(output_dir, output_name)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_text)
    
    print(f"  Saved: {output_path}")
    print(f"  Paragraphs: {len(paragraphs)}")
    print(f"  First 500 chars:\n{'-'*40}")
    print(full_text[:500])
    print()

print("Done!")
