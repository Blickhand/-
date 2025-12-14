
import { Riddle, GalleryItem } from './types';

// Placeholder images - In production, replace with real School assets
export const IMAGES = {
  // Guangzhou Skyline placeholder
  GUANGZHOU_BG: 'https://images.unsplash.com/photo-1536528734268-3bb647890f84?q=80&w=1920&auto=format&fit=crop', 
  // School Gate/Campus placeholder
  SCHOOL_BG: '/public/assets/1.png',
};

// Audio Placeholders - Replace with local files in production
export const AUDIO = {
  // Chinese New Year Playlist
  // In a real production environment, replace these URLs with actual local files like:
  // '/assets/music/gongxi_facai.mp3', '/assets/music/spring_festival.mp3', etc.
  CNY_PLAYLIST: [
    // Track 1: Upbeat & Festive (Placeholder)
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
    // Track 2: Grand & Orchestral (Placeholder)
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 
    // Track 3: Melodic & Traditional (Placeholder)
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 
    // Track 4: Joyful (Placeholder)
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  ]
};

export const RIDDLES: Riddle[] = [
  {
    id: 1,
    question: "有时挂在天边，有时挂在树梢，有时像个圆盘，有时像把镰刀。（打一自然物）",
    options: ["太阳", "月亮", "星星", "云彩"],
    correctIndex: 1
  },
  {
    id: 2,
    question: "千条线，万条线，落到水里看不见。（打一自然现象）",
    options: ["雪", "雾", "雨", "风"],
    correctIndex: 2
  },
  {
    id: 3,
    question: "身体洁白如玉，心中丰富多汁，虽然没嘴没眼，却有好多牙齿。（打一植物）",
    options: ["大蒜", "橘子", "玉米", "石榴"],
    correctIndex: 0
  },
  {
    id: 4,
    question: "红关公，白刘备，黑张飞，三结义。（打一水果）",
    options: ["西瓜", "荔枝", "火龙果", "山竹"],
    correctIndex: 0
  },
  {
    id: 5,
    question: "身穿绿衣裳，肚里水汪汪，生的子儿多，个个黑脸膛。（打一水果）",
    options: ["猕猴桃", "西瓜", "哈密瓜", "木瓜"],
    correctIndex: 1
  },
  {
    id: 6,
    question: "远看像座山，近看不是山，上边水直流，下边石头满。（打一自然物）",
    options: ["瀑布", "河流", "雨伞", "喷泉"],
    correctIndex: 0
  },
  {
    id: 7,
    question: "一位老公公，面孔红彤彤，晴天早早起，按时来上工。（打一自然物）",
    options: ["太阳", "月亮", "火烧云", "公鸡"],
    correctIndex: 0
  },
  {
    id: 8,
    question: "头戴红帽子，身穿白袍子，走路摆架子，说话伸脖子。（打一动物）",
    options: ["鸭子", "天鹅", "鹅", "鸵鸟"],
    correctIndex: 2
  },
  {
    id: 9,
    question: "耳朵像蒲扇，身子像小山，鼻子长又长，帮人把活干。（打一动物）",
    options: ["犀牛", "大象", "骆驼", "河马"],
    correctIndex: 1
  },
  {
    id: 10,
    question: "八字须，往上翘，说话好像哇哇叫，只洗脸，不梳头，夜行不用灯光照。（打一动物）",
    options: ["猫", "老鼠", "猫头鹰", "老虎"],
    correctIndex: 0
  },
  {
    id: 11,
    question: "身披花棉袄，唱歌叽叽喳，花边采花蜜，忙碌为了家。（打一昆虫）",
    options: ["蝴蝶", "蜜蜂", "蜻蜓", "瓢虫"],
    correctIndex: 1
  },
  {
    id: 12,
    question: "一个黑孩，从不开口，要是开口，掉出舌头。（打一水果）",
    options: ["西瓜", "瓜子", "葡萄", "黑莓"],
    correctIndex: 1
  },
  {
    id: 13,
    question: "屋子方方，有门没窗，屋外热火，屋里冰霜。（打一电器）",
    options: ["空调", "微波炉", "冰箱", "烤箱"],
    correctIndex: 2
  },
  {
    id: 14,
    question: "独木造高楼，没瓦没砖头，人在水下走，水在人上流。（打一用品）",
    options: ["雨衣", "雨伞", "帐篷", "草帽"],
    correctIndex: 1
  },
  {
    id: 15,
    question: "四四方方一块田，一块一块买铜钱。（打一食物）",
    options: ["豆腐", "年糕", "巧克力", "饼干"],
    correctIndex: 0
  },
  {
    id: 16,
    question: "青青藤儿上篱笆，红红花儿开满架，结出果实像辣椒，用来做菜味道佳。（打一蔬菜）",
    options: ["黄瓜", "丝瓜", "四季豆", "苦瓜"],
    correctIndex: 2
  },
  {
    id: 17,
    question: "麻屋子，红帐子，里面睡个白胖子。（打一植物）",
    options: ["花生", "核桃", "杏仁", "栗子"],
    correctIndex: 0
  },
  {
    id: 18,
    question: "有个宝宝真奇怪，胸前长个大口袋，袋里装着小宝宝，跳得高来跑得快。（打一动物）",
    options: ["兔子", "松鼠", "袋鼠", "考拉"],
    correctIndex: 2
  },
  {
    id: 19,
    question: "像云不是云，像烟不是烟，风吹轻轻飘，日出慢慢散。（打一自然现象）",
    options: ["雨", "雪", "雾", "露水"],
    correctIndex: 2
  },
  {
    id: 20,
    question: "两棵小树十个杈，不长叶子不开花，能写会算还会画，天天干活不说话。（打一人体部位）",
    options: ["脚", "手", "眼睛", "耳朵"],
    correctIndex: 1
  },
  {
    id: 21,
    question: "弟兄七八个，围着柱子坐，只要一分开，衣服就扯破。（打一植物）",
    options: ["橘子", "大蒜", "柚子", "洋葱"],
    correctIndex: 1
  },
  {
    id: 22,
    question: "身穿绿衣裳，肚里红瓤瓤，生的儿子多，个个黑脸膛。（打一水果）",
    options: ["西瓜", "木瓜", "火龙果", "哈密瓜"],
    correctIndex: 0
  },
  {
    id: 23,
    question: "小小一间房，只有一扇窗，唱歌又演戏，天天翻花样。（打一电器）",
    options: ["收音机", "电视机", "电脑", "手机"],
    correctIndex: 1
  },
  {
    id: 24,
    question: "驼背公公，力大无穷，爱驮什么？车水马龙。（打一建筑物）",
    options: ["桥", "塔", "房子", "亭子"],
    correctIndex: 0
  },
  {
    id: 25,
    question: "头戴红缨帽，身穿白战袍，走路像摇船，说话像驴叫。（打一动物）",
    options: ["鸭子", "鹅", "公鸡", "火鸡"],
    correctIndex: 1
  },
  {
    id: 26,
    question: "嘴像小铲子，脚像小扇子，走路左右摆，水上划船子。（打一动物）",
    options: ["鸡", "鸭", "鹅", "鹤"],
    correctIndex: 1
  },
  {
    id: 27,
    question: "年纪不算大，胡子一大把，不管见到谁，总爱叫妈妈。（打一动物）",
    options: ["山羊", "绵羊", "牛", "马"],
    correctIndex: 0
  },
  {
    id: 28,
    question: "头戴珊瑚帽，身穿梅花袄，腿儿细又长，翻山快如飞。（打一动物）",
    options: ["梅花鹿", "长颈鹿", "马", "羚羊"],
    correctIndex: 0
  },
  {
    id: 29,
    question: "形状像耗子，生活在水里，白天睡觉觉，晚上捉鱼吃。（打一动物）",
    options: ["海豚", "海狮", "水獭", "海豹"],
    correctIndex: 2
  },
  {
    id: 30,
    question: "红口袋，绿口袋，有人怕，有人爱。（打一蔬菜）",
    options: ["番茄", "茄子", "辣椒", "南瓜"],
    correctIndex: 2
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: '思源校门',
    description: '宏伟的学校大门，迎接每一位学子。',
    images: [
        'https://picsum.photos/800/600?random=101',
        'https://picsum.photos/800/600?random=102',
        'https://picsum.photos/800/600?random=103',
        'https://picsum.photos/800/600?random=104',
        'https://picsum.photos/800/600?random=105',
    ]
  },
  {
    id: 2,
    title: '激情运动会',
    description: '赛场上挥洒汗水的思源健儿。',
    images: [
        'https://picsum.photos/800/600?random=201',
        'https://picsum.photos/800/600?random=202',
        'https://picsum.photos/800/600?random=203',
        'https://picsum.photos/800/600?random=204',
        'https://picsum.photos/800/600?random=205',
    ]
  },
  {
    id: 3,
    title: '艺术节汇演',
    description: '多才多艺的同学们在舞台上闪耀。',
    images: [
        'https://picsum.photos/800/600?random=301',
        'https://picsum.photos/800/600?random=302',
        'https://picsum.photos/800/600?random=303',
        'https://picsum.photos/800/600?random=304',
        'https://picsum.photos/800/600?random=305',
    ]
  },
  {
    id: 4,
    title: '美丽校园一角',
    description: '清晨阳光下的教学楼花园。',
    images: [
        'https://picsum.photos/800/600?random=401',
        'https://picsum.photos/800/600?random=402',
        'https://picsum.photos/800/600?random=403',
        'https://picsum.photos/800/600?random=404',
        'https://picsum.photos/800/600?random=405',
    ]
  }
];

// 20 Vibrant Colors for the Lucky Bag Rain
export const GAME_COLORS = [
  '#EF4444', // Red 500
  '#F97316', // Orange 500
  '#F59E0B', // Amber 500
  '#EAB308', // Yellow 500
  '#84CC16', // Lime 500
  '#22C55E', // Green 500
  '#10B981', // Emerald 500
  '#14B8A6', // Teal 500
  '#06B6D4', // Cyan 500
  '#0EA5E9', // Sky 500
  '#3B82F6', // Blue 500
  '#6366F1', // Indigo 500
  '#8B5CF6', // Violet 500
  '#A855F7', // Purple 500
  '#D946EF', // Fuchsia 500
  '#EC4899', // Pink 500
  '#F43F5E', // Rose 500
  '#9F1239', // Rose 800 (Dark Red)
  '#854D0E', // Yellow 800 (Gold-ish)
  '#94A3B8', // Slate 400 (Silver-ish)
];
