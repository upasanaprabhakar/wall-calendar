// Indian public holidays (month is 1-indexed)
const HOLIDAYS = {
  '1-26': 'Republic Day',
  '3-25': 'Holi',
  '4-14': 'Dr. Ambedkar Jayanti',
  '4-18': 'Good Friday',
  '5-1': 'Labour Day',
  '8-15': 'Independence Day',
  '10-2': 'Gandhi Jayanti',
  '10-20': 'Dussehra',
  '11-5': 'Diwali',
  '12-25': 'Christmas',
};

export const getHoliday = (day, month) => HOLIDAYS[`${month}-${day}`] || null;

export const MONTH_THEMES = [
  { accent: '#7dd3fc', accentRgb: '125,211,252', img: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=900&q=85', season: 'Winter' },
  { accent: '#f9a8d4', accentRgb: '249,168,212', img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&q=85', season: 'Winter' },
  { accent: '#6ee7b7', accentRgb: '110,231,183', img: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=85', season: 'Spring' },
  { accent: '#fcd34d', accentRgb: '252,211,77',  img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc2e?w=900&q=85', season: 'Spring' },
  { accent: '#fdba74', accentRgb: '253,186,116', img: 'https://images.unsplash.com/photo-1444926379091-98c1c7d9a4a4?w=900&q=85', season: 'Summer' },
  { accent: '#67e8f9', accentRgb: '103,232,249', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85', season: 'Summer' },
  { accent: '#5eead4', accentRgb: '94,234,212',  img: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=85', season: 'Monsoon' },
  { accent: '#a5b4fc', accentRgb: '165,180,252', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85', season: 'Monsoon' },
  { accent: '#fbbf24', accentRgb: '251,191,36',  img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=85', season: 'Autumn' },
  { accent: '#fb923c', accentRgb: '251,146,60',  img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=85', season: 'Autumn' },
  { accent: '#f59e0b', accentRgb: '245,158,11',  img: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=900&q=85', season: 'Autumn' },
  { accent: '#f87171', accentRgb: '248,113,113', img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=900&q=85', season: 'Winter' },
];

export const getMonthTheme = (month) => MONTH_THEMES[month];

export const formatDate = (date, options = {}) =>
  date?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...options });