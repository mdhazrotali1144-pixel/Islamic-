export type Language = 'en' | 'bn';

export type NavSection =
  | 'overview'
  | 'quran'
  | 'hadith'
  | 'prayer'
  | 'lexicon'
  | 'duas'
  | 'tools';

export type ToolsTab = 'tasbih' | 'names' | 'zakat' | 'calendar' | 'bookmarks';

export type CalculationMethodId = 'karachi' | 'isna' | 'mwl' | 'makkah';
export type AsrSchool = 'hanafi' | 'shafi';

export interface CityInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  countryEn: string;
  countryBn: string;
  lat: number;
  lon: number;
  timezoneOffset: number; // hours from UTC
  defaultMethod: CalculationMethodId;
  defaultAsr: AsrSchool;
}

export interface PrayerTimeItem {
  key: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  labelEn: string;
  labelBn: string;
  arabicLabel: string;
  time24: string;
  time12En: string;
  time12Bn: string;
  minutesFromMidnight: number;
}

export interface PrayerSchedule {
  prayers: PrayerTimeItem[];
  suhoorEnds24: string;
  tahajjudStarts24: string;
  nextPrayerKey: PrayerTimeItem['key'];
  countdownSeconds: number;
}

export interface SurahMeta {
  number: number;
  arabicName: string;
  nameEn: string;
  meaningEn: string;
  nameBn: string;
  meaningBn: string;
  revelationEn: 'Makki' | 'Madani';
  revelationBn: 'মাক্কী' | 'মাদানী';
  ayahCount: number;
}

export interface WordAnalysis {
  arabic: string;
  transliterationEn: string;
  transliterationBn: string;
  meaningEn: string;
  meaningBn: string;
  root?: string;
}

export interface QuranAyah {
  numberInSurah: number;
  globalNumber?: number;
  arabic: string;
  transliterationEn?: string;
  transliterationBn?: string;
  translationEn: string;
  translationBn: string;
  tafsirEn?: string;
  tafsirBn?: string;
  words?: WordAnalysis[];
}

export interface CuratedSurahData {
  surahNumber: number;
  ayahs: QuranAyah[];
}

export interface HadithEntry {
  id: string;
  category: 'intention' | 'character' | 'worship' | 'knowledge' | 'charity' | 'mercy';
  arabic: string;
  narratorEn: string;
  narratorBn: string;
  textEn: string;
  textBn: string;
  sourceEn: string;
  sourceBn: string;
  gradeEn: string;
  gradeBn: string;
}

export interface LexiconEntry {
  id: string;
  arabic: string;
  root: string;
  category: 'faith' | 'worship' | 'ethics' | 'community';
  termEn: string;
  termBn: string;
  pronunciationBn: string;
  meaningEn: string;
  meaningBn: string;
  nuanceEn: string;
  nuanceBn: string;
  referenceEn: string;
  referenceBn: string;
}

export interface DuaEntry {
  id: string;
  category: 'morning_evening' | 'salah' | 'knowledge' | 'forgiveness' | 'protection' | 'family';
  titleEn: string;
  titleBn: string;
  arabic: string;
  transliterationEn: string;
  pronunciationBn: string;
  meaningEn: string;
  meaningBn: string;
  referenceEn: string;
  referenceBn: string;
  recommendedCount: number;
}

export interface NameOfAllah {
  number: number;
  arabic: string;
  transliterationEn: string;
  pronunciationBn: string;
  meaningEn: string;
  meaningBn: string;
}

export interface BookmarkItem {
  id: string;
  type: 'ayah' | 'hadith';
  titleEn: string;
  titleBn: string;
  arabic: string;
  textEn: string;
  textBn: string;
  refEn: string;
  refBn: string;
  savedAt: string;
}
