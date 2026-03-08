import re
import json

# 78度的智慧
input_file_78 = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw/78_wisdom.txt"
output_file_78 = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/tarot_knowledge_78_wisdom.json"

with open(input_file_78, 'r', encoding='utf-8') as f:
    content_78 = f.read()

major_cards = [
    ("愚人", "The Fool", 0),
    ("魔法師", "The Magician", 1),
    ("女祭司", "The High Priestess", 2),
    ("皇后", "The Empress", 3),
    ("皇帝", "The Emperor", 4),
    ("教皇", "The Hierophant", 5),
    ("戀人", "The Lovers", 6),
    ("戰車", "The Chariot", 7),
    ("力量", "Strength", 8),
    ("隱士", "The Hermit", 9),
    ("命運之輪", "The Wheel of Fortune", 10),
    ("正義", "Justice", 11),
    ("吊人", "The Hanged Man", 12),
    ("死神", "Death", 13),
    ("節制", "Temperance", 14),
    ("惡魔", "The Devil", 15),
    ("塔", "The Tower", 16),
    ("星星", "The Star", 17),
    ("月亮", "The Moon", 18),
    ("太陽", "The Sun", 19),
    ("審判", "Judgement", 20),
    ("世界", "The World", 21),
]

print("Processing 78度的智慧...")

knowledge_78 = {
    "version": "1.0.0",
    "source": "78_wisdom",
    "sourceTitle": "78度的智慧",
    "author": "瑞秋·波拉克 (Rachel Pollack)",
    "majorArcana": [],
    "minorArcana": {
        "wands": {"name": "權杖", "cards": []},
        "cups": {"name": "聖杯", "cards": []},
        "swords": {"name": "寶劍", "cards": []},
        "pentacles": {"name": "五角星", "cards": []}
    }
}

# Find card sections
for i, (cn_name, en_name, num) in enumerate(major_cards):
    pattern = rf'{cn_name}.*?\n'
    matches = list(re.finditer(pattern, content_78))
    
    if matches:
        # Use last match (likely the main description)
        match = matches[-1]
        start_idx = match.start()
        
        # Find end (next card or chapter)
        end_idx = len(content_78)
        for j in range(i + 1, len(major_cards)):
            next_pattern = rf'{major_cards[j][0]}.*?\n'
            next_match = re.search(next_pattern, content_78[start_idx + 100:])
            if next_match:
                end_idx = start_idx + 100 + next_match.start()
                break
        
        # Also check for chapter markers
        chapter_match = re.search(r'第.*?章', content_78[start_idx + 100:])
        if chapter_match:
            chapter_idx = start_idx + 100 + chapter_match.start()
            if chapter_idx < end_idx:
                end_idx = chapter_idx
        
        section = content_78[start_idx:end_idx]
        
        # Clean up
        section = re.sub(r'更多.*?學塔羅', '', section)
        section = re.sub(r'\s+', ' ', section).strip()[:800]
    else:
        section = ""
    
    card_data = {
        "id": num,
        "name": cn_name,
        "nameEn": en_name,
        "meanings": {
            "78_wisdom": {
                "description": section
            }
        }
    }
    knowledge_78["majorArcana"].append(card_data)
    status = "OK" if section else "EMPTY"
    print(f"  {num} {cn_name} [{status}]")

with open(output_file_78, 'w', encoding='utf-8') as f:
    json.dump(knowledge_78, f, ensure_ascii=False, indent=2)
print(f"\nSaved: {output_file_78}")

# 其实你可以再塔罗一点
print("\n" + "="*50)
print("Processing 其实你可以再塔罗一点...")

input_file_more = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw/can_be_more_tarot.txt"
output_file_more = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/tarot_knowledge_can_be_more.json"

with open(input_file_more, 'r', encoding='utf-8') as f:
    content_more = f.read()

knowledge_more = {
    "version": "1.0.0",
    "source": "can_be_more_tarot",
    "sourceTitle": "其實你可以再塔羅一點",
    "author": "",
    "majorArcana": [],
    "minorArcana": {
        "wands": {"name": "權杖", "cards": []},
        "cups": {"name": "聖杯", "cards": []},
        "swords": {"name": "寶劍", "cards": []},
        "pentacles": {"name": "錢幣", "cards": []}
    }
}

for i, (cn_name, en_name, num) in enumerate(major_cards):
    pattern = rf'{cn_name}.*?\n'
    matches = list(re.finditer(pattern, content_more))
    
    if matches:
        match = matches[-1]
        start_idx = match.start()
        
        end_idx = len(content_more)
        for j in range(i + 1, len(major_cards)):
            next_pattern = rf'{major_cards[j][0]}.*?\n'
            next_match = re.search(next_pattern, content_more[start_idx + 100:])
            if next_match:
                end_idx = start_idx + 100 + next_match.start()
                break
        
        section = content_more[start_idx:end_idx]
        section = re.sub(r'更多.*?學塔羅', '', section)
        section = re.sub(r'\s+', ' ', section).strip()[:800]
    else:
        section = ""
    
    card_data = {
        "id": num,
        "name": cn_name,
        "nameEn": en_name,
        "meanings": {
            "can_be_more_tarot": {
                "description": section
            }
        }
    }
    knowledge_more["majorArcana"].append(card_data)
    status = "OK" if section else "EMPTY"
    print(f"  {num} {cn_name} [{status}]")

with open(output_file_more, 'w', encoding='utf-8') as f:
    json.dump(knowledge_more, f, ensure_ascii=False, indent=2)
print(f"\nSaved: {output_file_more}")

print("\n" + "="*50)
print("Done!")
print(f"78度的智慧 Major Arcana: {len(knowledge_78['majorArcana'])}")
print(f"其实你可以再塔罗一点 Major Arcana: {len(knowledge_more['majorArcana'])}")
