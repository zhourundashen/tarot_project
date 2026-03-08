import fitz

pdf_path = 'C:/Users/MAKOTO/Desktop/Tarot-related books/17.《塔罗读牌21式》.pdf'
output_path = 'C:/Users/MAKOTO/Desktop/tarot_project/pdf_extract.txt'

try:
    doc = fitz.open(pdf_path)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f'Total pages: {doc.page_count}\n\n')
        
        for i in range(min(15, doc.page_count)):
            page = doc[i]
            text = page.get_text()
            f.write(f'=== Page {i+1} ===\n')
            f.write(text)
            f.write('\n\n')
    
    doc.close()
    print(f'Extracted to {output_path}')
    
except Exception as e:
    print(f'Error: {e}')
