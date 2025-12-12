
import { Riddle, GalleryItem } from './types';

// Placeholder images - In production, replace with real School assets
export const IMAGES = {
  // Guangzhou Skyline placeholder
  GUANGZHOU_BG: 'https://images.unsplash.com/photo-1536528734268-3bb647890f84?q=80&w=1920&auto=format&fit=crop', 
  // School Gate/Campus placeholder
  SCHOOL_BG: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop',
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
    question: "思源学子勤读书，新年进步节节高（打一校园场景）",
    options: ["食堂", "图书馆", "操场", "宿舍"],
    correctIndex: 1
  },
  {
    id: 2,
    question: "红灯笼，挂校园，辞旧迎新笑开颜（打一新年习俗）",
    options: ["贴春联", "吃粽子", "赛龙舟", "赏月"],
    correctIndex: 0
  },
  {
    id: 3,
    question: "小小一间房，只有一扇窗，唱歌又演戏，天天翻花样（打一教学设备）",
    options: ["黑板", "课桌", "电视/投影仪", "粉笔"],
    correctIndex: 2
  },
  {
    id: 4,
    question: "白纸上画画，五颜六色花，思源美术课，手里全靠它（打一文具）",
    options: ["橡皮", "油画棒", "圆规", "尺子"],
    correctIndex: 1
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    url: 'https://picsum.photos/800/600?random=1',
    title: '思源校门',
    description: '宏伟的学校大门，迎接每一位学子。'
  },
  {
    id: 2,
    url: 'https://picsum.photos/800/600?random=2',
    title: '激情运动会',
    description: '赛场上挥洒汗水的思源健儿。'
  },
  {
    id: 3,
    url: 'https://picsum.photos/800/600?random=3',
    title: '艺术节汇演',
    description: '多才多艺的同学们在舞台上闪耀。'
  },
  {
    id: 4,
    url: 'https://picsum.photos/800/600?random=4',
    title: '美丽校园一角',
    description: '清晨阳光下的教学楼花园。'
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
