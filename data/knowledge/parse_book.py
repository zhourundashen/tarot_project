import re
import json

def parse_actually_you_are_tarot():
    file_path = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/raw/actually_you_are_tarot.txt"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    major_arcana = [
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
    
    minor_suits = {
        "权杖": "wands",
        "圣杯": "cups",
        "宝剑": "swords",
        "五角星": "pentacles"
    }
    
    minor_numbers = [
        ("王牌", "Ace"),
        ("二", "Two"),
        ("三", "Three"),
        ("四", "Four"),
        ("五", "Five"),
        ("六", "Six"),
        ("七", "Seven"),
        ("八", "Eight"),
        ("九", "Nine"),
        ("十", "Ten"),
    ]
    
    court_cards = [
        ("侍卫", "Page"),
        ("骑士", "Knight"),
        ("皇后", "Queen"),
        ("国王", "King"),
    ]
    
    knowledge_base = {
        "version": "1.0.0",
        "source": "actually_you_are_tarot",
        "sourceTitle": "其实你已经很塔罗了",
        "majorArcana": [],
        "minorArcana": {
            "wands": {"name": "权杖", "cards": []},
            "cups": {"name": "圣杯", "cards": []},
            "swords": {"name": "宝剑", "cards": []},
            "pentacles": {"name": "五角星", "cards": []}
        }
    }
    
    def extract_meanings(text, card_name):
        result = {
            "upright": {"general": "", "love": ""},
            "reversed": {"general": "", "love": ""}
        }
        
        upright_pattern = rf"{card_name}.*?大体上的意义(.*?)(?=两性关系上的意义|倒立|$)"
        love_pattern = rf"两性关系上的意义(.*?)(?=倒立|{card_name}|$)"
        reversed_pattern = rf"倒立.*?{card_name}.*?(.*?)(?={card_name}|$)"
        
        upright_match = re.search(upright_pattern, text, re.DOTALL)
        if upright_match:
            result["upright"]["general"] = upright_match.group(1).strip()[:500]
        
        love_match = re.search(love_pattern, text, re.DOTALL)
        if love_match:
            result["upright"]["love"] = love_match.group(1).strip()[:500]
        
        reversed_match = re.search(reversed_pattern, text, re.DOTALL)
        if reversed_match:
            reversed_text = reversed_match.group(1).strip()
            if "大体上的意义" in reversed_text or "两性关系" in reversed_text:
                general_match = re.search(rf"大体上的意义(.*?)(?=两性关系|$)", reversed_text, re.DOTALL)
                love_match = re.search(rf"两性关系上的意义(.*?)(?=$)", reversed_text, re.DOTALL)
                if general_match:
                    result["reversed"]["general"] = general_match.group(1).strip()[:500]
                if love_match:
                    result["reversed"]["love"] = love_match.group(1).strip()[:500]
            else:
                result["reversed"]["general"] = reversed_text[:500]
        
        return result
    
    print("Parsing Major Arcana...")
    for num, cn_name, en_name in major_arcana:
        pattern = rf"{num}\s*{cn_name}.*?(?={num}|$)"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            card_text = match.group(0)
            meanings = extract_meanings(card_text, cn_name)
            
            card_data = {
                "id": int(num),
                "name": cn_name,
                "nameEn": en_name,
                "meanings": {
                    "actually_you_are_tarot": meanings
                }
            }
            knowledge_base["majorArcana"].append(card_data)
            print(f"  - {cn_name}")
    
    print("\nParsing Minor Arcana...")
    for suit_cn, suit_en in minor_suits.items():
        print(f"\n  {suit_cn}:")
        for num_cn, num_en in minor_numbers:
            card_name = f"{suit_cn}{num_cn}"
            pattern = rf"{card_name}.*?(?={suit_cn}(?:王牌|二|三|四|五|六|七|八|九|十|侍卫|骑士|皇后|国王)|$)"
            match = re.search(pattern, content, re.DOTALL)
            if match:
                card_text = match.group(0)
                meanings = extract_meanings(card_text, card_name)
                
                card_data = {
                    "id": f"{suit_en[0]}_{num_en.lower()}",
                    "name": card_name,
                    "nameEn": f"{num_en} of {suit_en.capitalize()}",
                    "meanings": {
                        "actually_you_are_tarot": meanings
                    }
                }
                knowledge_base["minorArcana"][suit_en]["cards"].append(card_data)
                print(f"    - {card_name}")
        
        for court_cn, court_en in court_cards:
            card_name = f"{suit_cn}{court_cn}"
            pattern = rf"{card_name}.*?(?={suit_cn}(?:侍卫|骑士|皇后|国王)|$)"
            match = re.search(pattern, content, re.DOTALL)
            if match:
                card_text = match.group(0)
                meanings = extract_meanings(card_text, card_name)
                
                card_data = {
                    "id": f"{suit_en[0]}_{court_en.lower()}",
                    "name": card_name,
                    "nameEn": f"{court_en} of {suit_en.capitalize()}",
                    "meanings": {
                        "actually_you_are_tarot": meanings
                    }
                }
                knowledge_base["minorArcana"][suit_en]["cards"].append(card_data)
                print(f"    - {card_name}")
    
    output_path = "C:/Users/MAKOTO/Desktop/tarot_project/knowledge/books/tarot_knowledge_v1.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(knowledge_base, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved to: {output_path}")
    return knowledge_base

if __name__ == "__main__":
    parse_actually_you_are_tarot()
