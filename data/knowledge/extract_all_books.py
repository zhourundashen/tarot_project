import fitz
import os

books = [
    {
        "id": "actually_you_are_tarot",
        "title": "其实你已经很塔罗了",
        "author": "Paul Fenton Smith",
        "file": "C:/Users/MAKOTO/Desktop/Tarot-related books/1.《其实你已经很塔罗了.pdf"
    },
    {
        "id": "78_wisdom",
        "title": "78度的智慧",
        "author": "Rachel Pollack",
        "file": "C:/Users/MAKOTO/Desktop/Tarot-related books/4.78度的智慧.pdf"
    },
    {
        "id": "reversed_meanings",
        "title": "塔罗逆位精解",
        "author": "",
        "file": "C:/Users/MAKOTO/Desktop/Tarot-related books/3.塔罗逆位精解珍藏版.pdf"
    },
    {
        "id": "sunflower_treasure",
        "title": "塔罗葵花宝典",
        "author": "",
        "file": "C:/Users/MAKOTO/Desktop/Tarot-related books/5.塔罗葵花宝典（精排版）.pdf"
    },
    {
        "id": "can_be_more_tarot",
        "title": "其实你可以再塔罗一点",
        "author": "",
        "file": "C:/Users/MAKOTO/Desktop/Tarot-related books/11.你可以再塔罗一点.pdf"
    }
]

output_dir = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw"

os.makedirs(output_dir, exist_ok=True)

for book in books:
    try:
        print(f"Processing: {book['title']}")
        doc = fitz.open(book['file'])
        
        output_file = os.path.join(output_dir, f"{book['id']}.txt")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"Title: {book['title']}\n")
            f.write(f"Author: {book['author']}\n")
            f.write(f"Total pages: {doc.page_count}\n")
            f.write("=" * 50 + "\n\n")
            
            for i in range(doc.page_count):
                page = doc[i]
                text = page.get_text()
                f.write(f"=== Page {i+1} ===\n")
                f.write(text)
                f.write("\n\n")
        
        doc.close()
        print(f"  Done: {doc.page_count} pages extracted")
        
    except Exception as e:
        print(f"  Error: {e}")

print("\nAll books extracted!")
