
import { Riddle, GalleryItem } from './types';

// ==========================================
// 1. 资源配置主文件
// ==========================================

export const IMAGES = {
  // 广州背景图
  GUANGZHOU_BG: 'https://i.postimg.cc/vTMyx2wm/R.jpg', 
  // 学校背景图
  SCHOOL_BG: 'https://i.postimg.cc/jSS190hn/Gemini-Generated-Image-mqvzd1mqvzd1mqvz-cleanup.png',
};

export const AUDIO = {
  // 活动背景音乐 (校园风采、集福、灯谜)
  ACTIVITY_BGM: 'https://blickhand.ukit.me/uploads/s/f/c/t/fct10ozrfg2i/file/LZckHICB.mp3',
  // 烟花背景音乐 (SNH48 - 新年这一刻 / 新年快乐)
  FIREWORKS_BGM: 'https://blickhand.ukit.me/uploads/s/f/c/t/fct10ozrfg2i/file/SejoBUeu.mp3'
};

// ==========================================
// 2. 相册图片手动配置区域
// ==========================================

// --- B. 激情运动会 (52张) ---
// 已更新为您提供的真实链接
const sportsImages = [
    'https://i.postimg.cc/wvp4sKC2/DSCF3362.jpg',
    'https://i.postimg.cc/MTmP7Pw4/DSCF3366.jpg',
    'https://i.postimg.cc/KzDqPqbs/DSCF3477.jpg',
    'https://i.postimg.cc/wvQfXfzr/DSCF3482.jpg',
    'https://i.postimg.cc/d1jH2HFp/DSCF3492.jpg',
    'https://i.postimg.cc/sX46Y6yr/DSCF3499.jpg',
    'https://i.postimg.cc/4dQL6LZZ/DSCF3504.jpg',
    'https://i.postimg.cc/vBtqrqMG/DSCF3525.jpg',
    'https://i.postimg.cc/rmNn1ncp/DSCF3539.jpg',
    'https://i.postimg.cc/6q6HYr5K/DSCF3544.jpg',
    'https://i.postimg.cc/mkZd8Y2b/DSCF3545.jpg',
    'https://i.postimg.cc/wMxW0XTq/DSCF3574.jpg',
    'https://i.postimg.cc/d3QW42tt/DSCF3583.jpg',
    'https://i.postimg.cc/brY63xNr/DSCF3587.jpg',
    'https://i.postimg.cc/hv4CpLPf/DSCF3609.jpg',
    'https://i.postimg.cc/2yjH2Q81/DSCF3619.jpg',
    'https://i.postimg.cc/qqBmjsM6/DSCF3621.jpg',
    'https://i.postimg.cc/kGMjfQXb/DSCF3623.jpg',
    'https://i.postimg.cc/J0TpgsGJ/DSCF3625.jpg',
    'https://i.postimg.cc/nrd35XCB/DSCF3629.jpg',
    'https://i.postimg.cc/yxfL5DkF/DSCF3630.jpg',
    'https://i.postimg.cc/kGjTZ2BQ/DSCF3631.jpg',
    'https://i.postimg.cc/vTP0j4cv/DSCF3641.jpg',
    'https://i.postimg.cc/tJrBfsY5/DSCF3678.jpg',
    'https://i.postimg.cc/NFNdVK5N/DSCF3683.jpg',
    'https://i.postimg.cc/gjMg5xnQ/DSCF3701.jpg',
    'https://i.postimg.cc/Vv7KTJJQ/DSCF3707.jpg',
    'https://i.postimg.cc/66zbTmY3/DSCF3712.jpg',
    'https://i.postimg.cc/kMwYDpf6/DSCF3716.jpg',
    'https://i.postimg.cc/G3zg95qX/DSCF3735.jpg',
    'https://i.postimg.cc/bYLVdB3B/DSCF3743.jpg',
    'https://i.postimg.cc/T2QNh4CH/DSCF3745.jpg',
    'https://i.postimg.cc/Qxt47Jym/DSCF3764.jpg',
    'https://i.postimg.cc/VL6GtWVG/DSCF3766.jpg',
    'https://i.postimg.cc/DyZjGPMD/DSCF3769.jpg',
    'https://i.postimg.cc/7Y6sznWp/DSCF3775.jpg',
    'https://i.postimg.cc/yYdQRyG4/DSCF3805.jpg',
    'https://i.postimg.cc/rFmn4NHM/DSCF3816.jpg',
    'https://i.postimg.cc/02QWS045/DSCF3822.jpg',
    'https://i.postimg.cc/yYbfySqq/DSCF3826.jpg',
    'https://i.postimg.cc/BQVhB1Ws/DSCF3829.jpg',
    'https://i.postimg.cc/X7z2kyM7/DSCF3834.jpg',
    'https://i.postimg.cc/wTGWQsKs/DSCF3853.jpg',
    'https://i.postimg.cc/Gh5Mxs0y/DSCF3860.jpg',
    'https://i.postimg.cc/X7z2kyMf/DSCF3865.jpg',
    'https://i.postimg.cc/Nj2dJfYK/DSCF3866.jpg',
    'https://i.postimg.cc/zGHxtX5t/DSCF3878.jpg',
    'https://i.postimg.cc/RZJgsV9b/DSCF3881.jpg',
    'https://i.postimg.cc/kgRT1X9L/DSCF3883.jpg',
    'https://i.postimg.cc/9f3Jv5F1/DSCF3888.jpg',
    'https://i.postimg.cc/Gp0qZwhS/DSCF3898.jpg',
    'https://i.postimg.cc/YScbJKqZ/DSCF3905.jpg',
];

// --- C. 艺术节汇演 (37张) ---
// 已更新为您提供的真实链接
const artsImages = [
    'https://i.postimg.cc/j2kGfgQd/00000850.jpg',
    'https://i.postimg.cc/wMbSNfc6/00000856.jpg',
    'https://i.postimg.cc/7hQpzsMH/00000859.jpg',
    'https://i.postimg.cc/SRtw9T7K/00000873.jpg',
    'https://i.postimg.cc/T278B189/00000876.jpg',
    'https://i.postimg.cc/tJmL6StW/00000879.jpg',
    'https://i.postimg.cc/qBbfWqf1/00000884.jpg',
    'https://i.postimg.cc/8kK8xc8y/00000887.jpg',
    'https://i.postimg.cc/mZXxKkx5/00000921.jpg',
    'https://i.postimg.cc/pVGN3rNg/00000930.jpg',
    'https://i.postimg.cc/J76wS0wf/00000936(1).jpg',
    'https://i.postimg.cc/dQHMg3Pv/00000973.jpg',
    'https://i.postimg.cc/c4vqWW0N/00001007.jpg',
    'https://i.postimg.cc/9X83s050/00001010.jpg',
    'https://i.postimg.cc/zDtm4vZG/00001012.jpg',
    'https://i.postimg.cc/J4sw88Mr/00001025.jpg',
    'https://i.postimg.cc/NfKhttBM/00001062.jpg',
    'https://i.postimg.cc/SNn044kR/00001064.jpg',
    'https://i.postimg.cc/tCs0bbps/DSCF0031.jpg',
    'https://i.postimg.cc/pXmNvvRz/DSCF0040.jpg',
    'https://i.postimg.cc/SNn044kL/DSCF0060.jpg',
    'https://i.postimg.cc/7Y5v44wN/DSCF0061.jpg',
    'https://i.postimg.cc/Pr9gr75v/DSCF0091.jpg',
    'https://i.postimg.cc/vHkJHKZv/DSCF0105.jpg',
    'https://i.postimg.cc/VLpxLhkZ/DSCF0117.jpg',
    'https://i.postimg.cc/gkQCk72T/DSCF0118.jpg',
    'https://i.postimg.cc/CLX3L2x9/DSCF0127.jpg',
    'https://i.postimg.cc/tCwKCcgQ/DSCF0133.jpg',
    'https://i.postimg.cc/4xcrK1YL/DSCF0134.jpg',
    'https://i.postimg.cc/vZnp1v42/DSCF0136.jpg',
    'https://i.postimg.cc/pLjg9Bmg/DSCF0137.jpg',
    'https://i.postimg.cc/P5DBLMLH/DSCF0189.jpg',
    'https://i.postimg.cc/DwGtWcWf/DSCF0195.jpg',
    'https://i.postimg.cc/13FLgKgV/DSCF0197.jpg',
    'https://i.postimg.cc/cJNPf8Yx/DSCF0200.jpg',
    'https://i.postimg.cc/g0P136Rj/DSCF0202.jpg',
    'https://i.postimg.cc/bvj412b1/DSCF0206.jpg',
];

// --- D. 美丽校园一角 (18张) ---
// 已更新为您提供的真实链接
const campusImages = [
    'https://i.postimg.cc/Z5BjkTXH/da-men.png',
    'https://i.postimg.cc/tCmDm1vx/da-men2.jpg',
    'https://i.postimg.cc/g2X49Y1K/su-she.jpg',
    'https://i.postimg.cc/Gm8z0c6M/tian-jing-chang.jpg',
    'https://i.postimg.cc/9QR13Wsp/lan-qiu-chang.jpg',
    'https://i.postimg.cc/wjyFK6Sp/yun-dong-chang.jpg',
    'https://i.postimg.cc/15YMYg76/jin-men-xiao-nei.jpg',
    'https://i.postimg.cc/bNFLFGVk/fan-tang.jpg',
    'https://i.postimg.cc/Z5DCR4dT/DSCF7120.jpg',
    'https://i.postimg.cc/DzJm4Hrw/DSCF7143.jpg',
    'https://i.postimg.cc/CKBdnXG5/DSCF7144.jpg',
    'https://i.postimg.cc/SK2jY36s/DSCF7153.jpg',
    'https://i.postimg.cc/pdwrfCCC/DSCF7159.jpg',
    'https://i.postimg.cc/Jhf0NxxS/DSCF7166.jpg',
    'https://i.postimg.cc/KztzJTpq/DSCF7171.jpg',
    'https://i.postimg.cc/NMRMpXP0/DSCF7175.jpg',
    'https://i.postimg.cc/Xq3vhvTG/DSCF7178.jpg',
    'https://i.postimg.cc/8cDC3Cqr/DSCF7189.jpg',
    'https://i.postimg.cc/3N7w6wP9/DSCF7196.jpg',
    'https://i.postimg.cc/x8RdS22x/DSCF7197.jpg',
    'https://i.postimg.cc/2yw5fDDM/DSCF7202.jpg',
    'https://i.postimg.cc/QCbMr33P/DSCF7210.jpg',
    'https://i.postimg.cc/qBXqK837/DSCF7247.jpg',
    'https://i.postimg.cc/SQ7R9WM2/DSCF7256.jpg',
    'https://i.postimg.cc/Wp6zZMkr/DSCF7373.jpg',
    'https://i.postimg.cc/ZYFnNrdd/DSCF7415.jpg',
];


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
    id: 4,
    title: '美丽校园一角',
    description: '清晨阳光下的教学楼花园。',
    images: campusImages
  },
  {
    id: 2,
    title: '激情运动会',
    description: '赛场上挥洒汗水的思源健儿。',
    images: sportsImages
  },
  {
    id: 3,
    title: '艺术节汇演',
    description: '多才多艺的同学们在舞台上闪耀。',
    images: artsImages
  }
];

export const GAME_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', 
  '#84CC16', '#22C55E', '#10B981', '#14B8A6', 
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', 
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', 
  '#F43F5E', '#9F1239', '#854D0E', '#94A3B8', 
];
