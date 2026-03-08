import fitz
import os

output_dir = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw"
os.makedirs(output_dir, exist_ok=True)

books = [
    ("actually_you_are_tarot", "1.《其实你已经很塔罗了.pdf"),
    ("78_wisdom", "4.78度的智慧.pdf"),
    ("reversed_meanings", "3.塔罗逆位精解珍藏版.pdf"),
    ("sunflower_treasure", "5.塔罗葵花宝典（精排版）.pdf"),
    ("can_be_more_tarot", "11.你可以再塔罗一点.pdf"),
]

base_path = "C:/Users/MAKOTO/Desktop/Tarot-related books"

for book_id, filename in books:
    filepath = os.path.join(base_path, filename)
    
    try:
        print(f"Extracting: {filename}")
        doc = fitz.open(filepath)
        
        output_file = os.path.join(output_dir, f"{book_id}.txt")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"File: {filename}\n")
            f.write(f"Pages: {doc.page_count}\n")
            f.write("=" * 60 + "\n\n")
            
            for i in range(doc.page_count):
                page = doc.load_page(i)
                text = page.get_text()
                f.write(f"--- Page {i+1} ---\n")
                f.write(text)
                f.write("\n\n")
        
        doc.close()
        print(f"  -> Saved: {book_id}.txt")
        
    except Exception as e:
        print(f"  -> Error: {e}")

print("\nExtraction complete!")
