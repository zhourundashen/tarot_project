import re
import json

input_file = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw/sunflower_treasure_docx.txt"
output_file = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/tarot_knowledge_sunflower.json"

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

major_cards = [
    ("0", "愚人", "The Fool"),
    ("1", "魔術師", "The Magician"),
    ("2", "女祭司", "The High Priestess"),
    ("3", "皇後", "The Empress"),
    ("4", "皇帝", "The Emperor"),
    ("5", "教宗", "The Hierophant"),
    ("6", "戀人", "The Lovers"),
    ("7", "戰車", "The Chariot"),
    ("8", "力量", "Strength"),
    ("9", "隱士", "The Hermit"),
    ("10", "命運之輪", "The Wheel of Fortune"),
    ("11", "正義", "Justice"),
    ("12", "吊人", "The Hanged Man"),
    ("13", "死神", "Death"),
    ("14", "節制", "Temperance"),
    ("15", "惡魔", "The Devil"),
    ("16", "塔", "The Tower"),
    ("17", "星星", "The Star"),
    ("18", "月亮", "The Moon"),
    ("19", "太陽", "The Sun"),
    ("20", "審判", "Judgement"),
    ("21", "世界", "The World"),
]

minor_suits = {
    "權杖": "wands",
    "聖杯": "cups", 
    "寶劍": "swords",
    "錢幣": "pentacles"
}

minor_numbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
court_titles = ["國王", "王后", "騎士", "侍者"]

def find_card_section(content, card_identifier, next_identifier=None):
    if next_identifier:
        pattern = rf'{re.escape(card_identifier)}(.*?){re.escape(next_identifier)}'
    else:
        pattern = rf'{re.escape(card_identifier)}(.*)$'
    
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1)
    return ""

def extract_meanings(section):
    upright = ""
    reversed_meaning = ""
    
    reversed_pattern = r'逆位解析[：:]?(.*?)(?=\d+\s+The|\Z)'
    reversed_match = re.search(reversed_pattern, section, re.DOTALL)
    if reversed_match:
        reversed_meaning = reversed_match.group(1).strip()
        upright = section[:reversed_match.start()].strip()
    else:
        upright = section.strip()
    
    upright = re.sub(r'牌面描述[：:]?', '', upright)
    upright = re.sub(r'牌義推演[：:]?', '', upright)
    upright = re.sub(r'更多.*?學塔羅', '', upright)
    upright = re.sub(r'\s+', ' ', upright).strip()
    
    reversed_meaning = re.sub(r'更多.*?學塔羅', '', reversed_meaning)
    reversed_meaning = re.sub(r'\s+', ' ', reversed_meaning).strip()
    
    return upright[:800], reversed_meaning[:400]

knowledge_base = {
    "version": "1.0.0",
    "source": "sunflower_treasure",
    "sourceTitle": "塔羅葵花寶典",
    "author": "向日葵",
    "majorArcana": [],
    "minorArcana": {
        "wands": {"name": "權杖", "cards": []},
        "cups": {"name": "聖杯", "cards": []},
        "swords": {"name": "寶劍", "cards": []},
        "pentacles": {"name": "錢幣", "cards": []}
    }
}

print("Parsing Major Arcana...")
for i in range(len(major_cards)):
    num, cn_name, en_name = major_cards[i]
    
    search_pattern = f"{num} The"
    if i + 1 < len(major_cards):
        next_pattern = f"{major_cards[i+1][0]} The"
    else:
        next_pattern = "權杖一"
    
    section = find_card_section(content, search_pattern, next_pattern)
    upright, reversed_m = extract_meanings(section)
    
    card_data = {
        "id": int(num),
        "name": cn_name,
        "nameEn": en_name,
        "meanings": {
            "sunflower_treasure": {
                "upright": upright,
                "reversed": reversed_m
            }
        }
    }
    knowledge_base["majorArcana"].append(card_data)
    print(f"  {num} {cn_name}")

print("\nParsing Minor Arcana...")
for suit_cn, suit_en in minor_suits.items():
    print(f"\n  {suit_cn}:")
    
    for i, num_cn in enumerate(minor_numbers):
        card_name = f"{suit_cn}{num_cn}"
        
        section = find_card_section(content, card_name, None)
        
        if section:
            upright, reversed_m = extract_meanings(section)
            
            card_data = {
                "id": f"{suit_en[0]}_{i+1}",
                "name": card_name,
                "nameEn": f"{['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'][i]} of {suit_en.capitalize()}",
                "meanings": {
                    "sunflower_treasure": {
                        "upright": upright,
                        "reversed": reversed_m
                    }
                }
            }
            knowledge_base["minorArcana"][suit_en]["cards"].append(card_data)
            print(f"    {card_name}")
    
    for court_cn in court_titles:
        card_name = f"{suit_cn}{court_cn}"
        
        section = find_card_section(content, card_name, None)
        
        if section:
            upright, reversed_m = extract_meanings(section)
            
            court_en = {"國王": "King", "王后": "Queen", "騎士": "Knight", "侍者": "Page"}[court_cn]
            
            card_data = {
                "id": f"{suit_en[0]}_{court_en.lower()}",
                "name": card_name,
                "nameEn": f"{court_en} of {suit_en.capitalize()}",
                "meanings": {
                    "sunflower_treasure": {
                        "upright": upright,
                        "reversed": reversed_m
                    }
                }
            }
            knowledge_base["minorArcana"][suit_en]["cards"].append(card_data)
            print(f"    {card_name}")

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(knowledge_base, f, ensure_ascii=False, indent=2)

print(f"\n\nSaved to: {output_file}")
print(f"Total Major Arcana: {len(knowledge_base['majorArcana'])}")
