import type { Spread, SpreadPosition } from '@/types'

export const spreads: Spread[] = [
  {
    id: 'single',
    name: '单牌指引',
    nameEn: 'Single Card',
    cardCount: 1,
    difficulty: '初级',
    description: '最简单的牌阵，适合日常指引或快速问答',
    icon: '✦',
    positions: [
      { name: '指引', description: '当前的指引与建议' }
    ]
  },
  {
    id: 'three-card',
    name: '三牌阵',
    nameEn: 'Three Card Spread',
    cardCount: 3,
    difficulty: '初级',
    description: '经典的过去、现在、未来时间线牌阵',
    icon: '◇',
    positions: [
      { name: '过去', description: '影响当前情况的历史因素和根源' },
      { name: '现在', description: '当前的状况和你所处的位置' },
      { name: '未来', description: '根据当前趋势可能的发展方向' }
    ]
  },
  {
    id: 'three-card-choice',
    name: '抉择牌阵',
    nameEn: 'Choice Spread',
    cardCount: 3,
    difficulty: '初级',
    description: '帮助你看清选择的不同结果',
    icon: '◈',
    positions: [
      { name: '选项A', description: '选择A可能带来的结果' },
      { name: '选项B', description: '选择B可能带来的结果' },
      { name: '建议', description: '在决策中的建议和指引' }
    ]
  },
  {
    id: 'cross',
    name: '十字牌阵',
    nameEn: 'Cross Spread',
    cardCount: 4,
    difficulty: '中级',
    description: '简洁但深入的牌阵，适合解决具体问题',
    icon: '✚',
    positions: [
      { name: '现状', description: '当前面临的核心问题' },
      { name: '阻碍', description: '阻碍你前进的因素' },
      { name: '帮助', description: '可以助你一臂之力的因素' },
      { name: '结果', description: '如果继续当前道路的最终结果' }
    ]
  },
  {
    id: 'relationship',
    name: '关系牌阵',
    nameEn: 'Relationship Spread',
    cardCount: 5,
    difficulty: '中级',
    description: '探索你与他人之间的关系动态',
    icon: '♡',
    positions: [
      { name: '你的立场', description: '你在这段关系中的态度和感受' },
      { name: '对方的立场', description: '对方在这段关系中的态度和感受' },
      { name: '连接', description: '你们之间的纽带和共同点' },
      { name: '挑战', description: '关系中存在的障碍和问题' },
      { name: '未来', description: '这段关系可能的发展方向' }
    ]
  },
  {
    id: 'horseshoe',
    name: '马蹄牌阵',
    nameEn: 'Horseshoe Spread',
    cardCount: 7,
    difficulty: '中级',
    description: '全面分析问题的各个层面',
    icon: '☾',
    positions: [
      { name: '过去', description: '影响当前情况的历史事件' },
      { name: '现在', description: '当前的情况和主要问题' },
      { name: '隐藏因素', description: '你可能忽视或不知道的影响因素' },
      { name: '阻碍', description: '阻止你达成目标的障碍' },
      { name: '环境', description: '周围环境对他人的影响' },
      { name: '希望与恐惧', description: '你对结果的期望和担忧' },
      { name: '结果', description: '最可能的结果' }
    ]
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    nameEn: 'Celtic Cross',
    cardCount: 10,
    difficulty: '高级',
    description: '最经典全面的塔罗牌阵，深入分析问题的各个层面',
    icon: '✙',
    positions: [
      { name: '核心现状', description: '当前核心问题和你所处的位置' },
      { name: '挑战', description: '你面临的主要挑战或阻碍' },
      { name: '根源', description: '问题的根源和潜意识的影响' },
      { name: '过去', description: '已经过去但仍影响现在的事件' },
      { name: '目标', description: '你意识和期望达到的目标' },
      { name: '近期未来', description: '即将发生的事件' },
      { name: '自我', description: '你对自己的看法和态度' },
      { name: '环境', description: '外界环境和他人的影响' },
      { name: '希望与恐惧', description: '你对结果的期望和担忧' },
      { name: '最终结果', description: '如果继续当前道路的最终结果' }
    ]
  },
  {
    id: 'tree-of-life',
    name: '生命之树',
    nameEn: 'Tree of Life',
    cardCount: 10,
    difficulty: '高级',
    description: '基于卡巴拉生命之树的神秘牌阵，深入探索灵魂之旅',
    icon: '🌳',
    positions: [
      { name: '王冠 Kether', description: '最高精神目标和生命意义' },
      { name: '智慧 Chokmah', description: '创造力和阳性能量' },
      { name: '理解 Binah', description: '直觉和阴性能量' },
      { name: '仁慈 Chesed', description: '慈悲、爱和扩展' },
      { name: '严厉 Geburah', description: '纪律、限制和净化' },
      { name: '美丽 Tiphareth', description: '和谐、平衡和自我' },
      { name: '胜利 Netzach', description: '情感、欲望和艺术' },
      { name: '辉煌 Hod', description: '智力、沟通和理性' },
      { name: '基础 Yesod', description: '潜意识、梦想和想象力' },
      { name: '王国 Malkuth', description: '物质世界和现实结果' }
    ]
  },
  {
    id: 'new-moon',
    name: '新月愿望',
    nameEn: 'New Moon Spread',
    cardCount: 6,
    difficulty: '中级',
    description: '在新月时设定意图和愿望的牌阵',
    icon: '🌑',
    positions: [
      { name: '释放', description: '需要放下和释放的旧模式' },
      { name: '意图', description: '这个周期你想显化的意图' },
      { name: '行动', description: '需要采取的具体行动' },
      { name: '资源', description: '可以支持你的资源和力量' },
      { name: '祝福', description: '宇宙给你的祝福和礼物' },
      { name: '结果', description: '下一个新月时的预期结果' }
    ]
  },
  {
    id: 'full-moon',
    name: '满月启示',
    nameEn: 'Full Moon Spread',
    cardCount: 5,
    difficulty: '中级',
    description: '在满月时反思和收获的牌阵',
    icon: '🌕',
    positions: [
      { name: '完成', description: '这个周期已经完成的事情' },
      { name: '显现', description: '正在显现的结果' },
      { name: '隐藏', description: '需要被照亮的隐藏因素' },
      { name: '释放', description: '需要释放和放下的事物' },
      { name: '整合', description: '需要整合到生活中的智慧' }
    ]
  }
]

export function getSpreadById(id: string): Spread | undefined {
  return spreads.find(s => s.id === id)
}

export function getSpreadsByDifficulty(difficulty: string): Spread[] {
  return spreads.filter(s => s.difficulty === difficulty)
}

export function getAllSpreads(): Spread[] {
  return spreads
}
