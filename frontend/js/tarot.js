const TarotDeck = {
    baseUrl: 'assets/cards/',
    
    majorArcana: [
        {
            id: 0,
            name: "愚者",
            nameEn: "The Fool",
            numeral: "0",
            element: "风",
            keywords: ["新开始", "冒险", "纯真", "自由", "潜力", "信任"],
            upright: "代表新的开始、冒险精神和无限可能。你正站在人生的十字路口，怀揣着纯真与勇气，准备踏上未知的旅程。相信直觉，勇敢迈出第一步。愚者提醒我们，有时候最好的计划就是没有计划——让生活带你去该去的地方。这是一个充满希望的时刻，宇宙正在为你开启新的大门。",
            reversed: "暗示鲁莽、冲动或逃避现实。可能在做出重大决定前没有充分考虑后果，或者因为恐惧而拒绝新的机会。需要更加谨慎和脚踏实地。愚者逆位提醒你检查自己是否在逃避某些重要的事情，或者是否需要更多准备才能迈出那一步。不要让恐惧阻止你，但也不要盲目行事。",
            detailed: "愚者是塔罗牌中最为神秘的牌之一。它代表着灵魂旅程的开始，一种对未知完全信任的状态。在许多传统中，愚者被视为一个神圣的傻瓜——一个因为纯粹的心而受到宇宙保护的人。",
            advice: "保持开放的心态，不要让过去的经验限制你。相信生活会在正确的时间带给你正确的经验。",
            color: "#E8D5B7",
            image: "ar00.jpg"
        },
        {
            id: 1,
            name: "魔术师",
            nameEn: "The Magician",
            numeral: "I",
            element: "风",
            keywords: ["创造力", "意志力", "技能", "资源", "显化", "专注"],
            upright: "象征创造力与意志力的完美结合。你拥有实现目标所需的一切资源和能力，现在是展现才华、将想法转化为现实的最佳时机。魔术师提醒你，你是自己生活的主宰，宇宙正在回应你的意图。所有元素——权杖（火）、圣杯（水）、宝剑（风）、星币（地）都在你的掌控之中。",
            reversed: "表示才能被浪费或欺骗行为。可能存在自我怀疑，或有人在操纵局势。需要重新审视自己的目标和方法。魔术师逆位警告你，你的能量可能被分散，或者你正在使用你的技能进行操纵而非创造。检查你的动机是否纯粹。",
            detailed: "魔术师代表意识和有意识的创造。他是连接天地的桥梁，将神圣的灵感转化为物质现实。当你抽到这张牌时，宇宙正在确认你的力量和潜能。",
            advice: "专注于一个目标，不要分散你的能量。使用你所有的技能和资源来创造你想要的生活。",
            color: "#FFD700",
            image: "ar01.jpg"
        },
        {
            id: 2,
            name: "女祭司",
            nameEn: "The High Priestess",
            numeral: "II",
            element: "水",
            keywords: ["直觉", "神秘", "潜意识", "智慧", "隐藏知识", "内在声音"],
            upright: "代表内在智慧和神秘的直觉力量。现在需要倾听内心深处的声音，答案就在你的潜意识中。保持耐心，等待真相显现。女祭司守护着神殿的帷幕，她提醒你有些秘密需要在正确的时间才能被揭示。信任你内心的智慧，它比你想象的更强大。",
            reversed: "暗示忽视直觉或秘密被揭露。可能与内在自我失去联系，或有人对你隐瞒真相。需要重新建立与内在智慧的连接。女祭司逆位可能意味着你过于依赖逻辑而忽略了直觉的声音。",
            detailed: "女祭司代表潜意识的智慧和神圣的阴性力量。她是月亮的女儿，掌管着梦境、直觉和隐藏的真相。她的出现总是意味着某些事情正在幕后发生。",
            advice: "在安静中寻找答案。冥想、梦境和直觉会告诉你逻辑无法解释的事情。不要太急于行动。",
            color: "#4169E1",
            image: "ar02.jpg"
        },
        {
            id: 3,
            name: "女皇",
            nameEn: "The Empress",
            numeral: "III",
            element: "地",
            keywords: ["丰饶", "母性", "创造", "自然", "滋养", "美", "丰盛"],
            upright: "象征丰饶、母性和创造力。这是一个孕育新生命、新项目或新想法的美好时期。享受生活的美好，让爱与关怀自然流露。女皇代表着大地母亲的能量，她滋养一切生命，她的出现预示着丰盛和成长。无论是在物质还是精神层面，现在都是一个收获和享受成果的时刻。",
            reversed: "表示创造力受阻或过度依赖。可能在自我关怀方面有所欠缺，或对他人过度保护。需要找回内在的平衡。女皇逆位提醒你关注自己的需求，不要为了照顾他人而耗尽自己。",
            detailed: "女皇是创造的化身，她代表了自然的循环——播种、生长、收获。她与金星（爱与美之星）相连，象征着生活中的美好和愉悦。",
            advice: "花时间在大自然中，照顾你的身体和心灵。允许自己享受生活的美好，不要忽视自己的需求。",
            color: "#98FB98",
            image: "ar03.jpg"
        },
        {
            id: 4,
            name: "皇帝",
            nameEn: "The Emperor",
            numeral: "IV",
            element: "火",
            keywords: ["权威", "结构", "控制", "父亲", "领导", "秩序", "保护"],
            upright: "代表权威、结构和稳定。现在是建立秩序、承担责任的好时机。以坚定的意志和清晰的规划来引领自己和他人。皇帝代表着父性的能量——保护、引导和提供。他提醒你，真正的力量来自于自律和责任感。",
            reversed: "暗示过度控制或缺乏纪律。可能在权威面前感到受限，或自己过于严厉。需要学会适度放权和灵活性。皇帝逆位可能表示权威的滥用或者需要打破一些僵化的规则。",
            detailed: "皇帝与白羊座相连，代表着主动的能量和开创的精神。他是规则的制定者，为社会和家庭创造安全和秩序。",
            advice: "承担你的责任，但不要过于僵化。建立结构和规则来支持你的目标，同时保持足够的灵活性。",
            color: "#DC143C",
            image: "ar04.jpg"
        },
        {
            id: 5,
            name: "教皇",
            nameEn: "The Hierophant",
            numeral: "V",
            element: "地",
            keywords: ["传统", "信仰", "教育", "精神指引", "制度", "仪式", "智慧"],
            upright: "象征传统智慧和精神的指引。通过学习、信仰或遵循既定规则可以获得成长。寻求良师益友的建议将大有裨益。教皇代表着精神上的权威和传统知识，他提醒我们，前人的智慧可以为我们指明道路。",
            reversed: "表示打破传统或反叛精神。可能在挑战既有的信念体系，或感到被传统束缚。是时候建立自己的价值观。教皇逆位可能意味着你需要走出舒适区，创造属于自己的精神道路。",
            detailed: "教皇与金牛座相连，代表着物质世界中的精神追求。他是神圣与世俗之间的桥梁，教导人们如何生活得更有意义。",
            advice: "保持开放的心态。传统智慧有其价值，但也要敢于质疑。找到适合自己的精神实践或信念体系。",
            color: "#9370DB",
            image: "ar05.jpg"
        },
        {
            id: 6,
            name: "恋人",
            nameEn: "The Lovers",
            numeral: "VI",
            element: "风",
            keywords: ["爱情", "选择", "和谐", "价值观", "关系", "联合", "诱惑"],
            upright: "代表爱情、和谐与重要抉择。这不仅关乎感情关系，也涉及价值观的统一。遵循内心的选择，真诚地面对自己和他人。恋人牌的出现通常意味着一个重要的选择即将到来，这个选择将深深影响你的道路。",
            reversed: "暗示关系不和或价值观冲突。可能面临艰难的选择，或在关系中失去平衡。需要重新审视自己的真实需求。恋人逆位警告你可能在逃避做出选择，或者在一段不健康的关系中。",
            detailed: "恋人与双子座相连，代表着二元性和选择。这张牌不仅关于爱情，更是关于与自己内在的和解，以及做出与灵魂一致的选择。",
            advice: "面对选择时，倾听你的心。选择那条让你感到完整的道路。在感情中，保持诚实和真实。",
            color: "#FF69B4",
            image: "ar06.jpg"
        },
        {
            id: 7,
            name: "战车",
            nameEn: "The Chariot",
            numeral: "VII",
            element: "水",
            keywords: ["胜利", "决心", "意志", "控制", "行动", "动力", "克服"],
            upright: "象征胜利和坚定的意志力。通过自律和决心，你将克服障碍，达成目标。保持专注，勇往直前。战车代表着通过意志力和决心掌控生活的力量，你现在有能力驾驭相互对立的力量并取得胜利。",
            reversed: "表示失控或缺乏方向。可能在追求目标的过程中遇到挫折，或内心冲突阻碍前进。需要重新调整策略。战车逆位提醒你检查是什么在阻止你前进——是外部的障碍还是内心的恐惧？",
            detailed: "战车与巨蟹座相连，代表着通过情感智慧来驱动行动。战车驾驶员必须平衡两匹不同颜色的马——象征着需要整合生活中的对立面。",
            advice: "集中你的能量，不要被分散。识别并整合你的内在冲突。相信你有能力克服任何障碍。",
            color: "#4169E1",
            image: "ar07.jpg"
        },
        {
            id: 8,
            name: "力量",
            nameEn: "Strength",
            numeral: "VIII",
            element: "火",
            keywords: ["勇气", "耐心", "内在力量", "慈悲", "自我控制", "温柔", "坚持"],
            upright: "代表内在的勇气和温柔的力量。以耐心和慈悲面对困难，真正的力量来自内心的平静和自我掌控。力量牌展示了柔能克刚的智慧——用爱和耐心而非暴力来驯服内心的野兽。",
            reversed: "暗示自我怀疑或失去信心。可能在面对挑战时感到力不从心，或过度使用蛮力。需要培养内在的韧性。力量逆位提醒你，真正的力量从来不是通过压制获得的，而是通过理解和接纳。",
            detailed: "力量与狮子座相连，代表着心的力量。牌中的女性轻柔地抚摸狮子，展示了内在的勇气和对自己本能的控制。这种力量来自于对自己的了解和接纳。",
            advice: "温柔地对待自己和他人。面对挑战时，用爱和耐心而非恐惧和暴力。相信你的内在力量比你想象的更大。",
            color: "#F4A460",
            image: "ar08.jpg"
        },
        {
            id: 9,
            name: "隐士",
            nameEn: "The Hermit",
            numeral: "IX",
            element: "地",
            keywords: ["内省", "孤独", "寻求真理", "智慧", "引导", "反思", "独处"],
            upright: "象征内省和精神探索。这是一个独处、反思和寻求内在智慧的时刻。放慢脚步，倾听灵魂的声音。隐士提着灯笼照亮前路，提醒你答案不在外界，而在你自己的内心深处。",
            reversed: "表示过度孤立或拒绝帮助。可能陷入孤独和忧郁，或拒绝他人的支持。需要在独处和社交间找到平衡。隐士逆位可能意味着过度的退缩，或者你在逃避与他人建立联系。",
            detailed: "隐士与处女座相连，代表着通过内省和服务来获得智慧。隐士不是逃避世界，而是在寂静中寻找真理，以便更好地服务他人。",
            advice: "花时间独处和反思。不要害怕寂静。当你找到内在的光时，你也能照亮他人的道路。",
            color: "#708090",
            image: "ar09.jpg"
        },
        {
            id: 10,
            name: "命运之轮",
            nameEn: "Wheel of Fortune",
            numeral: "X",
            element: "火",
            keywords: ["命运", "转变", "机遇", "循环", "好运", "变化", "因果"],
            upright: "代表命运的转折和新的机遇。命运之轮正在转动，变化即将来临。保持开放的心态，把握机会。这张牌提醒我们，生活是循环的，高潮和低谷都是暂时的。现在是顺应变化而非抵抗它的时候。",
            reversed: "暗示厄运或抗拒变化。可能感到生活失控，或不愿意接受改变。学会适应，变化中蕴含着机会。命运之轮逆位提醒你，如果你一直抗拒变化，变化也会抗拒你。",
            detailed: "命运之轮与木星相连，代表着扩张和好运。轮上的斯芬克斯、阿努比斯和蛇象征着智慧、死亡和重生——生命永恒循环的核心主题。",
            advice: "接受变化，相信生命的智慧。当命运之轮转动时，你能做的是保持平衡，在顺境中感恩，在逆境中学习。",
            color: "#DAA520",
            image: "ar10.jpg"
        },
        {
            id: 11,
            name: "正义",
            nameEn: "Justice",
            numeral: "XI",
            element: "风",
            keywords: ["公正", "真相", "因果", "法律", "平衡", "决定", "责任"],
            upright: "象征公正和真相。所有事物都将得到公正的裁决，因果循环不爽。保持诚实和公平，真相终将大白。正义牌提醒我们，每一个选择都有后果，现在是收获你所播种的时候。",
            reversed: "表示不公正或逃避责任。可能在面对真相时感到不安，或有人正在欺骗你。需要寻求公正和真相。正义逆位可能意味着你正在逃避某个决定或责任，或者感觉被不公平对待。",
            detailed: "正义与天秤座相连，代表着平衡和公正。这张牌不仅关于外部的法律，更是关于内心的道德准则。正义之剑斩断幻觉，天平称量真相。",
            advice: "诚实面对自己和他人。承担你的选择带来的后果。寻求平衡，但不要为了和平而牺牲真相。",
            color: "#FFD700",
            image: "ar11.jpg"
        },
        {
            id: 12,
            name: "倒吊人",
            nameEn: "The Hanged Man",
            numeral: "XII",
            element: "水",
            keywords: ["牺牲", "等待", "新视角", "放手", "奉献", "暂停", "启蒙"],
            upright: "代表暂停、牺牲和新的视角。有时候需要放下执念，从不同的角度看待问题。牺牲会带来更高的智慧。倒吊人看似被困，实际上是自愿选择的悬置，为了获得更高的洞见。",
            reversed: "暗示无谓的牺牲或拖延。可能在需要行动时停滞不前，或牺牲没有意义。学会区分何时该等待，何时该行动。倒吊人逆位可能表示你正在不必要地拖延，或者在牺牲自己却没有获得任何成长。",
            detailed: "倒吊人与海王星（或古占中的水星）相连，代表着通过放弃和臣服来获得智慧。他头朝下悬挂，从颠倒的世界看到了正立的真相。",
            advice: "不要急于行动。有时候，暂停和等待是最好的选择。放下那些不再服务于你的东西，为新的腾出空间。",
            color: "#6495ED",
            image: "ar12.jpg"
        },
        {
            id: 13,
            name: "死神",
            nameEn: "Death",
            numeral: "XIII",
            element: "水",
            keywords: ["结束", "转变", "重生", "放下", "蜕变", "改变", "新生"],
            upright: "象征结束和转变。一个阶段即将结束，为新的开始腾出空间。不要恐惧改变，这是成长的必经之路。死神牌代表着深刻的蜕变——不是肉体的死亡，而是旧自我的转化。",
            reversed: "表示抗拒改变或停滞不前。可能在执着于已经结束的事物，无法放手。接受变化才能获得新生。死神逆位暗示你可能正在延迟一个必要的结束，或者在恐惧中无法前进。",
            detailed: "死神与天蝎座相连，代表着转变和重生。就像蛇蜕皮一样，我们必须放下旧的自我才能成长。这是一张关于深刻转化的牌。",
            advice: "拥抱结束，因为它们为新的开始创造空间。不要恐惧改变，它带来的永远是成长。",
            color: "#2F4F4F",
            image: "ar13.jpg"
        },
        {
            id: 14,
            name: "节制",
            nameEn: "Temperance",
            numeral: "XIV",
            element: "火",
            keywords: ["平衡", "和谐", "耐心", "适度", "治愈", "融合", "中庸"],
            upright: "代表平衡、和谐与耐心。在极端之间找到中庸之道，保持内心的平静。时间是治愈和整合的最佳良药。节制牌的天使将两杯水融合，象征着将生活中的对立面和谐统一的能力。",
            reversed: "暗示失衡或不耐烦。可能在追求目标时过于极端，或缺乏必要的耐心。需要重新找回生活的平衡。节制逆位可能表示你正在生活中某个方面过于极端，或者急于求成。",
            detailed: "节制与射手座相连，代表着将精神与物质融合的能力。这张牌教导我们，真正的智慧来自于平衡和适度——既不压抑也不放纵。",
            advice: "寻找生活中的平衡。不要走极端。耐心地整合不同的方面，让时间来完成它的治愈工作。",
            color: "#87CEEB",
            image: "ar14.jpg"
        },
        {
            id: 15,
            name: "恶魔",
            nameEn: "The Devil",
            numeral: "XV",
            element: "地",
            keywords: ["束缚", "欲望", "物质", "诱惑", "阴影", "成瘾", "依赖"],
            upright: "象征束缚和物质诱惑。你可能被某种习惯、关系或欲望所困。认识到这些枷锁的存在是解放的第一步。恶魔牌提醒我们，我们最大的牢笼往往是我们自己建造的——恐惧、成瘾、不健康的依恋。",
            reversed: "表示打破束缚或重获自由。正在摆脱有害的模式或关系，走向解放。勇敢面对内心的阴影。恶魔逆位是一个积极的信号，表示你正在认识到自己的束缚并开始打破它们。",
            detailed: "恶魔与摩羯座相连，代表着物质世界的诱惑和限制。但仔细看牌面，被锁链束缚的人其实可以自己解开——我们的束缚往往是我们自己选择不离开的。",
            advice: "诚实面对你的阴影。承认你的恐惧和欲望。只有认识到它们，你才能获得真正的自由。",
            color: "#1C1C1C",
            image: "ar15.jpg"
        },
        {
            id: 16,
            name: "塔",
            nameEn: "The Tower",
            numeral: "XVI",
            element: "火",
            keywords: ["突变", "灾难", "觉醒", "毁灭", "重建", "崩溃", "解放"],
            upright: "代表突如其来的改变和觉醒。虽然这可能带来混乱，但它是必要的毁灭，为新的建设扫清道路。塔牌代表着那些我们必须经历却被我们抗拒的蜕变——但它们最终会将我们解放。",
            reversed: "暗示正在经历或即将避免一次剧变。可能在抗拒必要的改变，或痛苦正在逐渐消退。接受改变才能重建。塔逆位可能表示你正在尽力避免一场必要的变革，或者你已经经历了最坏的情况，正在重建中。",
            detailed: "塔与火星相连，代表着突然的、破坏性的能量。虽然这张牌看起来可怕，但它实际上是解脱——摧毁那些建立在虚假基础上的结构，让真相得以显现。",
            advice: "不要害怕改变，即使它来得突然。那些被摧毁的，本就不是真实的。在废墟中，你将建造更坚固的基础。",
            color: "#8B0000",
            image: "ar16.jpg"
        },
        {
            id: 17,
            name: "星星",
            nameEn: "The Star",
            numeral: "XVII",
            element: "风",
            keywords: ["希望", "灵感", "治愈", "平静", "信念", "更新", "指引"],
            upright: "象征希望、灵感和治愈。在黑暗之后，星光指引着方向。保持信念，美好的事物正在靠近。星星牌出现在塔之后，代表着灾难后的平静和恢复——宇宙正在用它的光芒治愈你。",
            reversed: "表示失去希望或与灵感断联。可能在困境中感到绝望，或失去了内心的平静。重新连接你的精神源泉。星星逆位提醒你，即使在最黑暗的时刻，星光依然存在——你只是暂时看不见它。",
            detailed: "星星与水瓶座相连，代表着精神上的更新和灵感。牌中的女性将两罐水分别倒在陆地和水中，象征着将神圣的能量带入物质世界和潜意识的深处。",
            advice: "保持信念。即使在最黑暗的时刻，星星也在指引你。允许自己被治愈，敞开心扉接受宇宙的礼物。",
            color: "#FFE4B5",
            image: "ar17.jpg"
        },
        {
            id: 18,
            name: "月亮",
            nameEn: "The Moon",
            numeral: "XVIII",
            element: "水",
            keywords: ["幻觉", "恐惧", "潜意识", "直觉", "迷惑", "梦境", "神秘"],
            upright: "代表幻觉、恐惧和潜意识。事物并非表面那样清晰，需要警惕欺骗和误解。相信直觉，穿越迷雾。月亮牌提醒我们，有些真相隐藏在阴影中，我们需要勇敢地走过自己的恐惧。",
            reversed: "暗示恐惧正在消散或看清真相。困惑即将过去，真实面貌即将显现。面对内心的恐惧。月亮逆位可能表示你正在从一段困惑期中走出，或者你的直觉正在帮助你识别真相。",
            detailed: "月亮与双鱼座相连，代表着潜意识的深度和梦境的领域。月亮的光芒是反射的，提醒我们所看到的可能只是投射。两只狗对着月亮嚎叫，象征着被恐惧控制的本能。",
            advice: "不要被表象迷惑。相信你的直觉，穿越恐惧。月亮照亮了夜晚，让你看到那些平时隐藏的事物。",
            color: "#C0C0C0",
            image: "ar18.jpg"
        },
        {
            id: 19,
            name: "太阳",
            nameEn: "The Sun",
            numeral: "XIX",
            element: "火",
            keywords: ["成功", "喜悦", "活力", "光明", "积极", "快乐", "清晰"],
            upright: "象征成功、喜悦和光明。一切都在向好发展，享受生命中的美好时光。以积极的态度迎接每一天。太阳牌是塔罗中最积极的牌之一，代表着纯粹的快乐、成功和活力。",
            reversed: "表示短暂的阴霾或过度乐观。可能成功稍有延迟，或在喜悦中忽视了现实。保持积极但也要脚踏实地。太阳逆位虽然仍然积极，但提醒你不要过度自信或忽视重要细节。",
            detailed: "太阳与狮子座（或太阳本身）相连，代表着生命力和意识的觉醒。牌中的孩子在阳光下骑行，象征着纯真、快乐和无限的可能性。",
            advice: "享受这个时刻。让阳光照进你的生活。你的努力正在开花结果，快乐是你应得的。",
            color: "#FFD700",
            image: "ar19.jpg"
        },
        {
            id: 20,
            name: "审判",
            nameEn: "Judgement",
            numeral: "XX",
            element: "火",
            keywords: ["觉醒", "重生", "反省", "召唤", "救赎", "决定", "释放"],
            upright: "代表觉醒和重生。过去的经历正在被审视，现在是做出重要决定的时刻。听从内心的召唤，迎接新的开始。审判牌不是关于惩罚，而是关于觉醒和救赎——从过去的错误中释放自己。",
            reversed: "暗示自我怀疑或拒绝改变。可能在逃避必要的反省，或对自己的审判过于严厉。宽恕自己，接受成长。审判逆位可能表示你无法原谅自己，或者正在忽略一个重要的召唤。",
            detailed: "审判与冥王星（或古占中的火元素）相连，代表着深刻的转变和精神的觉醒。天使吹响号角，死者从坟墓中复活——象征着我们内在的更新和灵魂的召唤。",
            advice: "倾听你灵魂的召唤。不要害怕审视过去。宽恕自己和他人，让旧的自我死去，迎接新的你。",
            color: "#F5DEB3",
            image: "ar20.jpg"
        },
        {
            id: 21,
            name: "世界",
            nameEn: "The World",
            numeral: "XXI",
            element: "地",
            keywords: ["完成", "整合", "成就", "旅行", "圆满", "成功", "结束"],
            upright: "象征完成和圆满。一个重要的周期即将结束，你已经达成了目标。庆祝成就，准备迎接新的旅程。世界牌代表着大阿卡纳旅程的终点——整合所有的经验，达到更高的意识层次。",
            reversed: "表示未完成或缺乏闭合。可能在目标即将达成时退缩，或感觉生活中缺少某种完成感。坚持到底，完成你开始的事。世界逆位提醒你，不要在终点前放弃，或者还有一些部分需要整合。",
            detailed: "世界与土星相连，代表着完成和成熟。牌中的女性被花环环绕，象征着所有元素的整合和圆满。四个活物分别代表四个星座和四种元素，显示宇宙的完整和谐。",
            advice: "庆祝你的成就。你经历了一段完整的旅程，现在是享受成果的时刻。准备好迎接下一个更高层次的冒险。",
            color: "#228B22",
            image: "ar21.jpg"
        }
    ],
    
    minorArcana: {
        wands: {
            name: "权杖",
            nameEn: "Wands",
            element: "火",
            keywords: ["行动", "激情", "创造力", "事业"],
            cards: [
                { id: "w1", name: "权杖一", numeral: "Ace", upright: "新的开始、灵感闪现、潜力无限、创意萌芽", reversed: "延迟的开始、缺乏方向、创意受阻", symbol: "🔥", image: "waac.jpg" },
                { id: "w2", name: "权杖二", numeral: "2", upright: "计划、决策、未来的可能性、等待", reversed: "恐惧未知、缺乏计划、优柔寡断", symbol: "🗺️", image: "wa02.jpg" },
                { id: "w3", name: "权杖三", numeral: "3", upright: "扩展、远见、进步、海外机会", reversed: "障碍、挫折、缺乏远见", symbol: "🚢", image: "wa03.jpg" },
                { id: "w4", name: "权杖四", numeral: "4", upright: "庆祝、和谐、稳定、里程碑", reversed: "不稳定、缺乏支持、过渡期", symbol: "🎉", image: "wa04.jpg" },
                { id: "w5", name: "权杖五", numeral: "5", upright: "竞争、冲突、挑战、多元观点", reversed: "避免冲突、内部斗争、紧张缓解", symbol: "⚔️", image: "wa05.jpg" },
                { id: "w6", name: "权杖六", numeral: "6", upright: "胜利、荣耀、认可、进步", reversed: "自大、失败、缺乏认可", symbol: "🏆", image: "wa06.jpg" },
                { id: "w7", name: "权杖七", numeral: "7", upright: "挑战、竞争、坚持立场、防守", reversed: "放弃、不堪重负、退让", symbol: "🛡️", image: "wa07.jpg" },
                { id: "w8", name: "权杖八", numeral: "8", upright: "快速行动、运动、变化、空中旅行", reversed: "延迟、挫折、内部混乱", symbol: "✈️", image: "wa08.jpg" },
                { id: "w9", name: "权杖九", numeral: "9", upright: "韧性、坚持、最后的考验、警惕", reversed: "精疲力竭、固执、偏执", symbol: "💪", image: "wa09.jpg" },
                { id: "w10", name: "权杖十", numeral: "10", upright: "负担、责任、压力、辛勤工作", reversed: "释放负担、委托他人、崩溃", symbol: "🏋️", image: "wa10.jpg" },
                { id: "wp", name: "权杖侍从", numeral: "Page", upright: "探索、热情、新消息、好奇心", reversed: "缺乏方向、幼稚、坏消息", symbol: "📜", image: "wapa.jpg" },
                { id: "wk", name: "权杖骑士", numeral: "Knight", upright: "行动、冒险、激情、冲动", reversed: "鲁莽、傲慢、缺乏耐心", symbol: "🏇", image: "wakn.jpg" },
                { id: "wq", name: "权杖王后", numeral: "Queen", upright: "自信、独立、社交、有决断力", reversed: "嫉妒、自私、专横", symbol: "👸", image: "waqu.jpg" },
                { id: "wk2", name: "权杖国王", numeral: "King", upright: "领导力、远见、企业家、荣誉", reversed: "专制、傲慢、冲动", symbol: "👑", image: "waki.jpg" }
            ]
        },
        cups: {
            name: "圣杯",
            nameEn: "Cups",
            element: "水",
            keywords: ["情感", "直觉", "关系", "精神"],
            cards: [
                { id: "c1", name: "圣杯一", numeral: "Ace", upright: "新感情、爱、直觉、精神觉醒", reversed: "情感压抑、空虚、悲伤", symbol: "💧", image: "cuac.jpg" },
                { id: "c2", name: "圣杯二", numeral: "2", upright: "伙伴关系、统一、连接、吸引力", reversed: "失衡、分离、紧张关系", symbol: "💑", image: "cu02.jpg" },
                { id: "c3", name: "圣杯三", numeral: "3", upright: "庆祝、友谊、社区、创造力", reversed: "过度放纵、流言蜚语、孤立", symbol: "🎊", image: "cu03.jpg" },
                { id: "c4", name: "圣杯四", numeral: "4", upright: "冥想、沉思、冷漠、重新评估", reversed: "新机会、觉醒、行动", symbol: "🤔", image: "cu04.jpg" },
                { id: "c5", name: "圣杯五", numeral: "5", upright: "失落、悲伤、遗憾、失望", reversed: "接受、前进、宽恕", symbol: "😢", image: "cu05.jpg" },
                { id: "c6", name: "圣杯六", numeral: "6", upright: "怀旧、童年记忆、天真、重逢", reversed: "活在当下、放下过去、幼稚", symbol: "🧸", image: "cu06.jpg" },
                { id: "c7", name: "圣杯七", numeral: "7", upright: "幻想、选择、愿望思维、困惑", reversed: "明确选择、脚踏实地、承诺", symbol: "🌈", image: "cu07.jpg" },
                { id: "c8", name: "圣杯八", numeral: "8", upright: "离开、抛弃、寻求更深意义、失望", reversed: "恐惧改变、漂泊、停滞", symbol: "🚶", image: "cu08.jpg" },
                { id: "c9", name: "圣杯九", numeral: "9", upright: "满足、情感满足、愿望成真", reversed: "不满、贪婪、唯物主义", symbol: "😊", image: "cu09.jpg" },
                { id: "c10", name: "圣杯十", numeral: "10", upright: "幸福、和谐、家庭、对齐", reversed: "家庭冲突、失去平衡、分离", symbol: "🏡", image: "cu10.jpg" },
                { id: "cp", name: "圣杯侍从", numeral: "Page", upright: "创意机会、直觉消息、好奇心", reversed: "情感不成熟、不切实际", symbol: "🎭", image: "cupa.jpg" },
                { id: "ck", name: "圣杯骑士", numeral: "Knight", upright: "浪漫、魅力、想象力、美丽", reversed: "不切实际、嫉妒、喜怒无常", symbol: "🐴", image: "cukn.jpg" },
                { id: "cq", name: "圣杯王后", numeral: "Queen", upright: "同情、关怀、情感安全、直觉", reversed: "不安全、依赖、情感控制", symbol: "👸", image: "cuqu.jpg" },
                { id: "ck2", name: "圣杯国王", numeral: "King", upright: "情感平衡、外交、慷慨、同理心", reversed: "情绪化、操纵、自私", symbol: "👑", image: "cuki.jpg" }
            ]
        },
        swords: {
            name: "宝剑",
            nameEn: "Swords",
            element: "风",
            keywords: ["思想", "沟通", "真相", "挑战"],
            cards: [
                { id: "s1", name: "宝剑一", numeral: "Ace", upright: "突破、清晰、新想法、真相", reversed: "混乱、残酷、误解", symbol: "🗡️", image: "swac.jpg" },
                { id: "s2", name: "宝剑二", numeral: "2", upright: "困难的决定、选择、僵局、回避", reversed: "信息过载、混乱、释放压力", symbol: "⚖️", image: "sw02.jpg" },
                { id: "s3", name: "宝剑三", numeral: "3", upright: "心碎、悲伤、痛苦、释放", reversed: "恢复、宽恕、前进", symbol: "💔", image: "sw03.jpg" },
                { id: "s4", name: "宝剑四", numeral: "4", upright: "休息、恢复、沉思、静默", reversed: "疲惫、恢复期、不安", symbol: "🛏️", image: "sw04.jpg" },
                { id: "s5", name: "宝剑五", numeral: "5", upright: "冲突、紧张、失败、背叛", reversed: "和解、继续前进、宽恕", symbol: "😤", image: "sw05.jpg" },
                { id: "s6", name: "宝剑六", numeral: "6", upright: "过渡、变化、离开困境", reversed: "抵抗过渡、未解决的问题", symbol: "⛵", image: "sw06.jpg" },
                { id: "s7", name: "宝剑七", numeral: "7", upright: "欺骗、策略、狡猾、背叛", reversed: "忏悔、走正道、冲动", symbol: "🎭", image: "sw07.jpg" },
                { id: "s8", name: "宝剑八", numeral: "8", upright: "束缚、受害者心态、自我设限", reversed: "自我解放、新视角、自由", symbol: "🔒", image: "sw08.jpg" },
                { id: "s9", name: "宝剑九", numeral: "9", upright: "焦虑、恐惧、噩梦、担忧", reversed: "希望、释放、面对恐惧", symbol: "😰", image: "sw09.jpg" },
                { id: "s10", name: "宝剑十", numeral: "10", upright: "痛苦的结束、背叛、崩溃", reversed: "恢复、重生、抵抗结局", symbol: "⛔", image: "sw10.jpg" },
                { id: "sp", name: "宝剑侍从", numeral: "Page", upright: "好奇心、新想法、渴望知识", reversed: "流言蜚语、欺骗、多嘴", symbol: "📚", image: "swpa.jpg" },
                { id: "sk", name: "宝剑骑士", numeral: "Knight", upright: "雄心、行动导向、快速思维", reversed: "鲁莽、不考虑后果、冲突", symbol: "⚡", image: "swkn.jpg" },
                { id: "sq", name: "宝剑王后", numeral: "Queen", upright: "独立、清晰思维、直接沟通", reversed: "冷酷、残酷、过度批评", symbol: "👸", image: "swqu.jpg" },
                { id: "sk2", name: "宝剑国王", numeral: "King", upright: "智慧、权威、真相、高标准", reversed: "操纵、暴政、残酷", symbol: "👑", image: "swki.jpg" }
            ]
        },
        pentacles: {
            name: "星币",
            nameEn: "Pentacles",
            element: "地",
            keywords: ["物质", "财富", "工作", "稳定"],
            cards: [
                { id: "p1", name: "星币一", numeral: "Ace", upright: "新财务机会、繁荣、富足、安全", reversed: "错失机会、缺乏计划", symbol: "💰", image: "peac.jpg" },
                { id: "p2", name: "星币二", numeral: "2", upright: "平衡、适应、时间管理、优先级", reversed: "失衡、混乱、财务问题", symbol: "🔄", image: "pe02.jpg" },
                { id: "p3", name: "星币三", numeral: "3", upright: "团队合作、协作、学习、实施", reversed: "缺乏团队合作、单打独斗", symbol: "👷", image: "pe03.jpg" },
                { id: "p4", name: "星币四", numeral: "4", upright: "安全、保守、储蓄、控制", reversed: "过度消费、贪婪、不安全", symbol: "🔒", image: "pe04.jpg" },
                { id: "p5", name: "星币五", numeral: "5", upright: "困难、贫穷、孤立、担忧", reversed: "恢复、精神富有、新工作", symbol: "❄️", image: "pe05.jpg" },
                { id: "p6", name: "星币六", numeral: "6", upright: "慷慨、分享、财富、礼物", reversed: "债务、慈善、自私", symbol: "🎁", image: "pe06.jpg" },
                { id: "p7", name: "星币七", numeral: "7", upright: "长期计划、耐心、投资", reversed: "缺乏长期愿景、急躁", symbol: "🌱", image: "pe07.jpg" },
                { id: "p8", name: "星币八", numeral: "8", upright: "技能发展、勤奋、培训、工艺", reversed: "缺乏专注、重复、无目标", symbol: "🔨", image: "pe08.jpg" },
                { id: "p9", name: "星币九", numeral: "9", upright: "独立、富足、奢侈品、自给自足", reversed: "过度工作、自我价值问题", symbol: "🍇", image: "pe09.jpg" },
                { id: "p10", name: "星币十", numeral: "10", upright: "财富、遗产、家庭、稳定", reversed: "家庭冲突、财务失败", symbol: "🏘️", image: "pe10.jpg" },
                { id: "pp", name: "星币侍从", numeral: "Page", upright: "野心、勤奋、新目标", reversed: "缺乏进步、拖延、分散", symbol: "📖", image: "pepa.jpg" },
                { id: "pk", name: "星币骑士", numeral: "Knight", upright: "效率、常规、保守、方法", reversed: "自满、无聊、懒惰", symbol: "🐴", image: "pekn.jpg" },
                { id: "pq", name: "星币王后", numeral: "Queen", upright: "务实、富足、安全、资源", reversed: "财务独立、工作与家庭平衡", symbol: "👸", image: "pequ.jpg" },
                { id: "pk2", name: "星币国王", numeral: "King", upright: "财富、商业、领导力、安全", reversed: "财务损失、物质主义", symbol: "👑", image: "peki.jpg" }
            ]
        }
    },

    getFullDeck() {
        const deck = [...this.majorArcana];
        for (const suit of Object.values(this.minorArcana)) {
            deck.push(...suit.cards.map(card => ({
                ...card,
                suit: suit.name,
                suitEn: suit.nameEn,
                element: suit.element,
                suitKeywords: suit.keywords,
                isMinor: true,
                imageUrl: this.baseUrl + card.image
            })));
        }
        return deck.map(card => ({
            ...card,
            imageUrl: card.imageUrl || (this.baseUrl + card.image)
        }));
    },

    getCardById(id) {
        const major = this.majorArcana.find(c => c.id === id);
        if (major) return { ...major, imageUrl: this.baseUrl + major.image };
        
        for (const suit of Object.values(this.minorArcana)) {
            const card = suit.cards.find(c => c.id === id);
            if (card) {
                return {
                    ...card,
                    suit: suit.name,
                    suitEn: suit.nameEn,
                    element: suit.element,
                    suitKeywords: suit.keywords,
                    isMinor: true,
                    imageUrl: this.baseUrl + card.image
                };
            }
        }
        return null;
    },

    shuffleDeck(deck) {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};
