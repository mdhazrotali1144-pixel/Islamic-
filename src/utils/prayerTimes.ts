import {
  AsrSchool,
  CalculationMethodId,
  Language,
  PrayerSchedule,
  PrayerTimeItem,
} from '../types/islamic';

const KAABA_LAT = 21.422487;
const KAABA_LON = 39.826206;

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
}

export function formatNumber(input: string | number, lang: Language): string {
  return lang === 'bn' ? toBengaliDigits(input) : String(input);
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fixAngle(angle: number): number {
  let a = angle - 360 * Math.floor(angle / 360);
  return a < 0 ? a + 360 : a;
}

function fixHour(hour: number): number {
  let h = hour - 24 * Math.floor(hour / 24);
  return h < 0 ? h + 24 : h;
}

function julianDate(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5
  );
}

function sunPosition(jd: number): {declination: number; equationOfTime: number} {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));
  const e = 23.439 - 0.00000036 * D;
  const RA = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L)))) / 15;
  const eqt = q / 15 - fixHour(RA);
  const decl = radToDeg(Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(L))));
  return {declination: decl, equationOfTime: eqt};
}

function sunAngleTime(
  jd: number,
  lat: number,
  angle: number,
  direction: 'ccw' | 'cw',
  midDay: number
): number {
  const {declination} = sunPosition(jd);
  const num =
    -Math.sin(degToRad(angle)) -
    Math.sin(degToRad(lat)) * Math.sin(degToRad(declination));
  const den = Math.cos(degToRad(lat)) * Math.cos(degToRad(declination));
  const ratio = Math.max(-1, Math.min(1, num / den));
  const t = radToDeg(Math.acos(ratio)) / 15;
  return midDay + (direction === 'ccw' ? -t : t);
}

function asrTime(jd: number, lat: number, factor: number, midDay: number): number {
  const {declination} = sunPosition(jd);
  const angle = -radToDeg(
    Math.atan(1 / (factor + Math.tan(degToRad(Math.abs(lat - declination)))))
  );
  return sunAngleTime(jd, lat, angle, 'cw', midDay);
}

function formatFloatHour(
  floatHour: number
): {time24: string; time12En: string; time12Bn: string; minutesFromMidnight: number} {
  const normalized = fixHour(floatHour + 0.5 / 60); // round to nearest minute
  const hours = Math.floor(normalized);
  const minutes = Math.floor((normalized - hours) * 60);
  const totalMinutes = hours * 60 + minutes;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const time24 = `${hh}:${mm}`;

  const suffixEn = hours >= 12 ? 'PM' : 'AM';
  const suffixBn = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const h12Str = String(h12).padStart(2, '0');
  const time12En = `${h12Str}:${mm} ${suffixEn}`;
  const time12Bn = `${toBengaliDigits(h12Str)}:${toBengaliDigits(mm)} ${suffixBn}`;

  return {time24, time12En, time12Bn, minutesFromMidnight: totalMinutes};
}

export function calculatePrayerSchedule(
  date: Date,
  lat: number,
  lon: number,
  timezoneOffset: number,
  method: CalculationMethodId,
  asrSchool: AsrSchool
): PrayerSchedule {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDate(year, month, day) - lon / (15 * 24);
  const {equationOfTime} = sunPosition(jd + 0.5);
  const midDay = fixHour(12 - equationOfTime) + timezoneOffset - lon / 15;

  const methodParams: Record<
    CalculationMethodId,
    {fajrAngle: number; ishaAngle: number; ishaOffsetMinutes?: number}
  > = {
    karachi: {fajrAngle: 18, ishaAngle: 18},
    isna: {fajrAngle: 15, ishaAngle: 15},
    mwl: {fajrAngle: 18, ishaAngle: 17},
    makkah: {fajrAngle: 18.5, ishaAngle: 0, ishaOffsetMinutes: 90},
  };

  const params = methodParams[method];

  const fajrH = sunAngleTime(jd + 5 / 24, lat, params.fajrAngle, 'ccw', midDay);
  const sunriseH = sunAngleTime(jd + 6 / 24, lat, 0.833, 'ccw', midDay);
  const dhuhrH = midDay + 2 / 60; // 2-minute safety zenith buffer
  const asrFactor = asrSchool === 'hanafi' ? 2 : 1;
  const asrH = asrTime(jd + 15 / 24, lat, asrFactor, midDay);
  const maghribH = sunAngleTime(jd + 18 / 24, lat, 0.833, 'cw', midDay);
  const ishaH = params.ishaOffsetMinutes
    ? maghribH + params.ishaOffsetMinutes / 60
    : sunAngleTime(jd + 19.5 / 24, lat, params.ishaAngle, 'cw', midDay);

  const fajrFmt = formatFloatHour(fajrH);
  const sunriseFmt = formatFloatHour(sunriseH);
  const dhuhrFmt = formatFloatHour(dhuhrH);
  const asrFmt = formatFloatHour(asrH);
  const maghribFmt = formatFloatHour(maghribH);
  const ishaFmt = formatFloatHour(ishaH);

  // Night duration between Maghrib and Fajr for Tahajjud (last third)
  let nightLengthH = fajrH - maghribH;
  if (nightLengthH < 0) nightLengthH += 24;
  const tahajjudStartH = fixHour(fajrH - nightLengthH / 3);
  const suhoorEndH = fixHour(fajrH - 4 / 60);

  const prayers: PrayerTimeItem[] = [
    {
      key: 'fajr',
      labelEn: 'Fajr',
      labelBn: 'ফজর',
      arabicLabel: 'الفجر',
      ...fajrFmt,
    },
    {
      key: 'sunrise',
      labelEn: 'Sunrise',
      labelBn: 'সূর্যোদয়',
      arabicLabel: 'الشروق',
      ...sunriseFmt,
    },
    {
      key: 'dhuhr',
      labelEn: 'Dhuhr',
      labelBn: 'যোহর',
      arabicLabel: 'الظهر',
      ...dhuhrFmt,
    },
    {
      key: 'asr',
      labelEn: 'Asr',
      labelBn: 'আসর',
      arabicLabel: 'العصر',
      ...asrFmt,
    },
    {
      key: 'maghrib',
      labelEn: 'Maghrib',
      labelBn: 'মাগরিব',
      arabicLabel: 'المغرب',
      ...maghribFmt,
    },
    {
      key: 'isha',
      labelEn: 'Isha',
      labelBn: 'ইশা',
      arabicLabel: 'العشاء',
      ...ishaFmt,
    },
  ];

  // Current time in target city timezone
  const utcMinutes =
    date.getUTCHours() * 60 +
    date.getUTCMinutes() +
    date.getUTCSeconds() / 60;
  let cityNowMinutes = utcMinutes + timezoneOffset * 60;
  cityNowMinutes = ((cityNowMinutes % 1440) + 1440) % 1440;

  let nextPrayer = prayers.find((p) => p.minutesFromMidnight > cityNowMinutes);
  let diffMinutes: number;
  if (nextPrayer) {
    diffMinutes = nextPrayer.minutesFromMidnight - cityNowMinutes;
  } else {
    nextPrayer = prayers[0];
    diffMinutes = 1440 - cityNowMinutes + nextPrayer.minutesFromMidnight;
  }

  return {
    prayers,
    suhoorEnds24: formatFloatHour(suhoorEndH).time24,
    tahajjudStarts24: formatFloatHour(tahajjudStartH).time24,
    nextPrayerKey: nextPrayer.key,
    countdownSeconds: Math.max(0, Math.round(diffMinutes * 60)),
  };
}

export function formatCountdown(totalSeconds: number, lang: Language): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const raw = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return formatNumber(raw, lang);
}

export function calculateQiblaBearing(lat: number, lon: number): number {
  const phi1 = degToRad(lat);
  const phi2 = degToRad(KAABA_LAT);
  const dLambda = degToRad(KAABA_LON - lon);

  const y = Math.sin(dLambda);
  const x =
    Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);
  const bearing = radToDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function calculateDistanceToKaaba(lat: number, lon: number): number {
  const R = 6371; // km
  const dLat = degToRad(KAABA_LAT - lat);
  const dLon = degToRad(KAABA_LON - lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat)) *
      Math.cos(degToRad(KAABA_LAT)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function getCompassCardinal(bearing: number, lang: Language): string {
  const dirsEn = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const dirsBn = ['উত্তর', 'উত্তর-পূর্ব', 'উত্তর-পূর্ব', 'পূর্ব-উত্তর', 'পূর্ব', 'পূর্ব-দক্ষিণ', 'দক্ষিণ-পূর্ব', 'দক্ষিণ-পূর্ব', 'দক্ষিণ', 'দক্ষিণ-পশ্চিম', 'দক্ষিণ-পশ্চিম', 'পশ্চিম-দক্ষিণ', 'পশ্চিম', 'পশ্চিম-উত্তর', 'উত্তর-পশ্চিম', 'উত্তর-পশ্চিম'];
  const idx = Math.round(bearing / 22.5) % 16;
  return lang === 'bn' ? dirsBn[idx] : dirsEn[idx];
}

export const HIJRI_MONTHS = [
  {num: 1, en: 'Muharram', bn: 'মুহররম', ar: 'محرم'},
  {num: 2, en: 'Safar', bn: 'সফর', ar: 'صفر'},
  {num: 3, en: "Rabi' al-Awwal", bn: 'রবিউল আউয়াল', ar: 'ربيع الأول'},
  {num: 4, en: "Rabi' al-Thani", bn: 'রবিউস সানি', ar: 'ربيع الآخر'},
  {num: 5, en: 'Jumada al-Ula', bn: 'জমাদিউল আউয়াল', ar: 'جمادى الأولى'},
  {num: 6, en: 'Jumada al-Thani', bn: 'জমাদিউস সানি', ar: 'جمادى الآخرة'},
  {num: 7, en: 'Rajab', bn: 'রজব', ar: 'رجب'},
  {num: 8, en: "Sha'ban", bn: 'শাবান', ar: 'شعبان'},
  {num: 9, en: 'Ramadan', bn: 'রমজান', ar: 'رمضان'},
  {num: 10, en: 'Shawwal', bn: 'শাওয়াল', ar: 'شوال'},
  {num: 11, en: "Dhu al-Qi'dah", bn: 'যিলকদ', ar: 'ذو القعدة'},
  {num: 12, en: 'Dhu al-Hijjah', bn: 'যিলহজ্জ', ar: 'ذو الحجة'},
];

export function getHijriDateParts(date: Date): {
  day: number;
  monthIndex: number;
  year: number;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const day = Number(parts.find((p) => p.type === 'day')?.value || 1);
    const month = Number(parts.find((p) => p.type === 'month')?.value || 1);
    const yearStr = parts.find((p) => p.type === 'year')?.value || '1448';
    const year = Number(yearStr.replace(/\D/g, '')) || 1448;
    return {day, monthIndex: Math.max(0, Math.min(11, month - 1)), year};
  } catch {
    return {day: 16, monthIndex: 5, year: 1448};
  }
}

export function formatHijriDate(date: Date, lang: Language): string {
  const {day, monthIndex, year} = getHijriDateParts(date);
  const month = HIJRI_MONTHS[monthIndex];
  if (lang === 'bn') {
    return `${toBengaliDigits(day)} ${month.bn} ${toBengaliDigits(year)} হিজরি`;
  }
  return `${day} ${month.en} ${year} AH`;
}

export function formatGregorianDate(date: Date, lang: Language): string {
  try {
    return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toDateString();
  }
}
