import re
import json

input_file = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw/actually_you_are_tarot.txt"
output_file = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/tarot_knowledge_actually_you_are.json"

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

major_patterns = [
    (r'0\s*愚人（The Fool\）', "0", "愚人", "The Fool"),
    (r'1\s*魔术师（The Magician\）', "1", "魔术师", "The Magician"),
    (r'2\s*女教皇（The High Priestess\）', "2", "女教皇", "The High Priestess"),
    (r'3\s*女皇（The Empress\）', "3", "女皇", "The Empress"),
    (r'4\s*皇帝（The Emperor\）', "4", "皇帝", "The Emperor"),
    (r'5\s*教皇（The Hierophant\）', "5", "教皇", "The Hierophant"),
    (r'6\s*恋人（The lovers\）', "6", "恋人", "The Lovers"),
    (r'7\s*战车（The Chariot\）', "7", "战车", "The Chariot"),
    (r'8\s*力量（Strength\）', "8", "力量", "Strength"),
    (r'9\s*隐士（The Hermit\）', "9", "隐士", "The Hermit"),
    (r'10\s*命运之轮（The Wheel of Fortune\）', "10", "命运之轮", "The Wheel of Fortune"),
    (r'11\s*正义（Justice\）', "11", "正义", "Justice"),
    (r'12\s*悬吊者（The Hanged Man\）', "12", "悬吊者", "The Hanged Man"),
    (r'13\s*死亡（Death\）', "13", "死亡", "Death"),
    (r'14\s*节制（Temperance\）', "14", "节制", "Temperance"),
    (r'15\s*魔鬼（The Devil\）', "15", "魔鬼", "The Devil"),
    (r'16\s*高塔（The Tower\）', "16", "高塔", "The Tower"),
    (r'17\s*星星（The Star\）', "17", "星星", "The Star"),
    (r'18\s*月亮（The Moon\）', "18", "月亮", "The Moon"),
    (r'19\s*太阳（The Sun\）', "19", "太阳", "The Sun"),
    (r'20\s*审判（Judgement\）', "20", "审判", "Judgement"),
    (r'21\s*世界（The World\）', "21", "世界", "The World"),
]

minor_suits = {"权杖": "wands", "圣杯": "cups", "宝剑": "swords", "五角星": "pentacles"}

def extract_meanings_v2(section, card_name):
    general = ""
    love = ""
    reversed_m = ""
    
    general_patterns = [
        rf'大体上的意义\s*(.*?)(?=两性关系上的意义|倒立)',
        rf'大体的意义\s*(.*?)(?=两性关系上的意义|倒立)',
    ]
    for pattern in general_patterns:
        match = re.search(pattern, section, re.DOTALL)
        if match:
            general = match.group(1).strip()
            break
    
    love_patterns = [
        rf'两性关系上的意义\s*(.*?)(?=倒立|{re.escape(card_name)}|$)',
    ]
    for pattern in love_patterns:
        match = re.search(pattern, section, re.DOTALL)
        if match:
            love = match.group(1).strip()
            break
    
    reversed_patterns = [
        rf'倒立\s*(?:的\s*)?{re.escape(card_name)}\s*(.*?)(?=\d+\s+\d|\d\s+[A-Z]|\n\n\n|$)',
    ]
    for pattern in reversed_patterns:
        match = re.search(pattern, section, re.DOTALL)
        if match:
            reversed_m = match.group(1).strip()
            break
    
    for pattern in [r'---\s*Page\s*\d+\s*---', r'http://www\.\s*chinatarot\.com', r'中华塔罗网.*?网站。']:
        general = re.sub(pattern, '', general, flags=re.IGNORECASE)
        love = re.sub(pattern, '', love, flags=re.IGNORECASE)
        reversed_m = re.sub(pattern, '', reversed_m, flags=re.IGNORECASE)
    
    general = re.sub(r'\.{3,}', '', general)
    love = re.sub(r'\.{3,}', '', love)
    reversed_m = re.sub(r'\.{3,}', '', reversed_m)
    
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
for i, (pattern, num, cn_name, en_name) in enumerate(major_patterns):
    start_match = re.search(pattern, content)
    if not start_match:
        continue
    
    start_idx = start_match.start()
    end_idx = len(content)
    
    if i + 1 < len(major_patterns):
        next_pattern = major_patterns[i + 1][0]
        next_match = re.search(next_pattern, content[start_idx + 10:])
        if next_match:
            end_idx = start_idx + 10 + next_match.start()
    
    section = content[start_idx:end_idx]
    general, love, reversed_m = extract_meanings_v2(section, cn_name)
    
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
    has_content = "OK" if general or love or reversed_m else "EMPTY"
    print(f"  {num} {cn_name} [{has_content}]")

print("\nParsing Minor Arcana...")
for suit_cn, suit_en in minor_suits.items():
    print(f"\n  {suit_cn}:")
    
    card_names = [f"{suit_cn}王牌", f"{suit_cn}二", f"{suit_cn}三", f"{suit_cn}四", f"{suit_cn}五",
                  f"{suit_cn}六", f"{suit_cn}七", f"{suit_cn}八", f"{suit_cn}九", f"{suit_cn}十",
                  f"{suit_cn}侍卫", f"{suit_cn}骑士", f"{suit_cn}皇后", f"{suit_cn}国王"]
    
    for i, card_name in enumerate(card_names):
        pattern = rf'{card_name}\s*\n'
        start_match = re.search(pattern, content)
        if not start_match:
            continue
        
        start_idx = start_match.start()
        end_idx = len(content)
        
        for next_card in card_names[i+1:]:
            next_pattern = rf'{next_card}\s*\n'
            next_match = re.search(next_pattern, content[start_idx + 5:])
            if next_match:
                end_idx = start_idx + 5 + next_match.start()
                break
        
        if i < 10:
            for next_suit in minor_suits.keys():
                if next_suit != suit_cn:
                    next_pattern = rf'{next_suit}王牌\s*\n'
                    next_match = re.search(next_pattern, content[start_idx + 5:])
                    if next_match and start_idx + 5 + next_match.start() < end_idx:
                        end_idx = start_idx + 5 + next_match.start()
        
        section = content[start_idx:end_idx]
        general, love, reversed_m = extract_meanings_v2(section, card_name)
        
        if i < 10:
            num_en = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][i]
            card_id = f"{suit_en[0]}_{i if i > 0 else 'ace'}"
        else:
            court_map = {"侍卫": "page", "骑士": "knight", "皇后": "queen", "国王": "king"}
            num_en = court_map[card_name.replace(suit_cn, "")].capitalize()
            card_id = f"{suit_en[0]}_{court_map[card_name.replace(suit_cn, '')]}"
        
        card_data = {
            "id": card_id,
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
        has_content = "OK" if general or love or reversed_m else "EMPTY"
        print(f"    {card_name} [{has_content}]")

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(knowledge_base, f, ensure_ascii=False, indent=2)

print(f"\n\nSaved to: {output_file}")
print(f"Total Major Arcana: {len(knowledge_base['majorArcana'])}")
total_minor = sum(len(knowledge_base['minorArcana'][s]['cards']) for s in ['wands', 'cups', 'swords', 'pentacles'])
print(f"Total Minor Arcana: {total_minor}")
