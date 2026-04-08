const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getEaster = (year) => {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);

  return new Date(year, month - 1, day);
};

const fixedHolidays = [
  { month: 0, day: 1, name: "New Year's Day", type: 'international' },
  { month: 0, day: 26, name: 'Republic Day', type: 'national' },
  { month: 4, day: 1, name: 'Labour Day', type: 'international' },
  { month: 7, day: 15, name: 'Independence Day', type: 'national' },
  { month: 9, day: 2, name: 'Gandhi Jayanti', type: 'national' },
  { month: 11, day: 25, name: 'Christmas Day', type: 'religious' },
];

export const generateHolidays = (year) => {
  let holidays = [];

  fixedHolidays.forEach(h => {
    holidays.push({
      date: formatDate(new Date(year, h.month, h.day)),
      name: h.name,
      type: h.type,
    });
  });

  const easter = getEaster(year);
  holidays.push({
    date: formatDate(easter),
    name: 'Easter Sunday',
    type: 'religious',
  });

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  holidays.push({
    date: formatDate(goodFriday),
    name: 'Good Friday',
    type: 'religious',
  });

  holidays.push(
    { date: `${year}-02-14`, name: "Valentine's Day", type: 'cultural' },
    { date: `${year}-03-08`, name: 'International Women’s Day', type: 'international' },
    { date: `${year}-04-22`, name: 'Earth Day', type: 'international' },
    { date: `${year}-06-21`, name: 'International Yoga Day', type: 'international' },
    { date: `${year}-10-31`, name: 'Halloween', type: 'cultural' },
    { date: `${year}-12-31`, name: "New Year's Eve", type: 'cultural' }
  );

  holidays.push(
    { date: `${year}-03-14`, name: 'Holi', type: 'religious' },
    { date: `${year}-04-10`, name: 'Eid ul-Fitr', type: 'religious' },
    { date: `${year}-11-01`, name: 'Diwali', type: 'religious' }
  );

  return holidays;
};

export const getHolidaysForDate = (dateString) => {
  const year = new Date(dateString).getFullYear();
  const holidays = generateHolidays(year);
  return holidays.filter(h => h.date === dateString);
};