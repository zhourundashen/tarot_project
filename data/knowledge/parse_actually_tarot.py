import re
import json

input_file = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw/actually_you_are_tarot.txt"
output_file = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/tarot_knowledge_actually_you_are.json"

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

major_cards = [
    ("0", "愚人", "The Fool"),
    ("1", "魔术师", "The Magician"),
    ("2", "女教皇", "The High Priestess"),
    ("3", "女皇", "The Empress"),
    ("4", "皇帝", "The Emperor"),
    ("5", "教皇", "The Hierophant"),
    ("6", "恋人", "The Lovers"),
    ("7", "战车", "The Chariot"),
    ("8", "力量", "Strength"),
    ("9", "隐士", "The Hermit"),
    ("10", "命运之轮", "The Wheel of Fortune"),
    ("11", "正义", "Justice"),
    ("12", "悬吊者", "The Hanged Man"),
    ("13", "死亡", "Death"),
    ("14", "节制", "Temperance"),
    ("15", "魔鬼", "The Devil"),
    ("16", "高塔", "The Tower"),
    ("17", "星星", "The Star"),
    ("18", "月亮", "The Moon"),
    ("19", "太阳", "The Sun"),
    ("20", "审判", "Judgement"),
    ("21", "世界", "The World"),
]

minor_suits = {"权杖": "wands", "圣杯": "cups", "宝剑": "swords", "五角星": "pentacles"}
minor_numbers = ["王牌", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
court_titles = ["侍卫", "骑士", "皇后", "国王"]

def find_card_section(content, card_identifier, next_identifier=None):
    if next_identifier:
        pattern = rf'{re.escape(card_identifier)}(.*?){re.escape(next_identifier)}'
    else:
        pattern = rf'{re.escape(card_identifier)}(.*)$'
    match = re.search(pattern, content, re.DOTALL)
    return match.group(1) if match else ""

def extract_meanings(section):
    general = ""
    love = ""
    reversed_m = ""
    
    general_match = re.search(r'大体上的意义(.*?)(?=两性关系|倒立|$)', section, re.DOTALL)
    if general_match:
        general = general_match.group(1).strip()
    
    love_match = re.search(r'两性关系上的意义(.*?)(?=倒立|$)', section, re.DOTALL)
    if love_match:
        love = love_match.group(1).strip()
    
    reversed_match = re.search(r'倒立.*?(?:的)?(.+?)(?=\d+\s+\d|\d\s+[A-Z]|权杖|圣杯|宝剑|五角星|$)', section, re.DOTALL)
    if reversed_match:
        reversed_m = reversed_match.group(1).strip()
    
    general = re.sub(r'http://www\.\s*chinatarot\.com.*?(?=\n\n|\Z)', '', general, flags=re.DOTALL)
    general = re.sub(r'--- Page \d+ ---', '', general)
    general = re.sub(r'\s+', ' ', general).strip()[:600]
    love = re.sub(r'\s+', ' ', love).strip()[:400]
    reversed_m = re.sub(r'\s+', ' ', reversed_m).strip()[:400]
    
    return general, love, reversed_m

knowledge_base = {
    "version": "1.0.0",
    "source": "actually_you_are_tarot",
    "sourceTitle": "其实你已经很塔罗了",
    "author": "Paul Fenton Smith",
    "majorArcana": [],
    "minorArcana": {
        "wands": {"name": "权杖", "cards": []},
        "cups": {"name": "圣杯", "cards": []},
        "swords": {"name": "宝剑", "cards": []},
        "pentacles": {"name": "五角星", "cards": []}
    }
}

print("Parsing Major Arcana...")
for i in range(len(major_cards)):
    num, cn_name, en_name = major_cards[i]
    search_pattern = f"{num} {cn_name}"
    next_pattern = f"{major_cards[i+1][0]} {major_cards[i+1][1]}" if i + 1 < len(major_cards) else "权杖王牌"
    section = find_card_section(content, search_pattern, next_pattern)
    general, love, reversed_m = extract_meanings(section)
    card_data = {
        "id": int(num),
        "name": cn_name,
        "nameEn": en_name,
        "meanings": {
            "actually_you_are_tarot": {
                "upright": {"general": general, "love": love},
                "reversed": {"general": reversed_m, "love": ""}
            }
        }
    }
    knowledge_base["majorArcana"].append(card_data)
    print(f"  {num} {cn_name}")

print("\nParsing Minor Arcana...")
for suit_cn, suit_en in minor_suits.items():
    print(f"\n  {suit_cn}:")
    for idx, num_cn in enumerate(minor_numbers):
        card_name = f"{suit_cn}{num_cn}"
        section = find_card_section(content, card_name, None)
        if section:
            general, love, reversed_m = extract_meanings(section)
            num_en = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"][idx]
            card_data = {
                "id": f"{suit_en[0]}_{idx+1}",
                "name": card_name,
                "nameEn": f"{num_en} of {suit_en.capitalize()}",
                "meanings": {
                    "actually_you_are_tarot": {
                        "upright": {"general": general, "love": love},
                        "reversed": {"general": reversed_m, "love": ""}
                    }
                }
            }
            knowledge_base["minorArcana"][suit_en]["cards"].append(card_data)
            print(f"    {card_name}")
    
    for court_cn in court_titles:
        card_name = f"{suit_cn}{court_cn}"
        section = find_card_section(content, card_name, None)
        if section:
            general, love, reversed_m = extract_meanings(section)
            court_en = {"国王": "King", "皇后": "Queen", "骑士": "Knight", "侍卫": "Page"}[court_cn]
            card_data = {
                "id": f"{suit_en[0]}_{court_en.lower()}",
                "name": card_name,
                "nameEn": f"{court_en} of {suit_en.capitalize()}",
                "meanings": {
                    "actually_you_are_tarot": {
                        "upright": {"general": general, "love": love},
                        "reversed": {"general": reversed_m, "love": ""}
                    }
                }
            }
            knowledge_base["minorArcana"][suit_en]["cards"].append(card_data)
            print(f"    {card_name}")

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(knowledge_base, f, ensure_ascii=False, indent=2)

print(f"\n\nSaved to: {output_file}")
print(f"Total Major Arcana: {len(knowledge_base['majorArcana'])}")
total_minor = sum(len(knowledge_base['minorArcana'][s]['cards']) for s in ['wands', 'cups', 'swords', 'pentacles'])
print(f"Total Minor Arcana: {total_minor}")
