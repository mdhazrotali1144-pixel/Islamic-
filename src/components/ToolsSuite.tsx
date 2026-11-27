import React, {useMemo, useState} from 'react';
import {
  RotateCcw,
  Search,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {BookmarkItem, Language, ToolsTab} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {NAMES_OF_ALLAH} from '../data/namesOfAllah';
import {
  formatGregorianDate,
  formatHijriDate,
  formatNumber,
  getHijriDateParts,
  HIJRI_MONTHS,
} from '../utils/prayerTimes';

interface ToolsSuiteProps {
  lang: Language;
  t: Translations;
  activeTab: ToolsTab;
  onSelectTab: (tab: ToolsTab) => void;
  now: Date;
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
  onOpenDuas: () => void;
}

const DHIKR_PRESETS = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    en: 'SubhanAllah (Glory be to Allah)',
    bn: 'সুবহানাল্লাহ (আল্লাহ পবিত্র ও মহান)',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    en: 'Alhamdulillah (All praise belongs to Allah)',
    bn: 'আলহামদুলিল্লাহ (সকল প্রশংসা আল্লাহর)',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    en: 'Allahu Akbar (Allah is the Greatest)',
    bn: 'আল্লাহু আকবার (আল্লাহ সর্বশ্রেষ্ঠ)',
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    en: 'Astaghfirullah (I seek forgiveness from Allah)',
    bn: 'আস্তাগফিরুল্লাহ (আমি আল্লাহর ক্ষমা চাই)',
  },
  {
    id: 'lailaha',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    en: 'La ilaha illallah (None is worthy of worship but Allah)',
    bn: 'লা ইলাহা ইল্লাল্লাহ (আল্লাহ ছাড়া কোনো উপাস্য নেই)',
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    en: 'Allahumma salli ala Muhammad',
    bn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মদ',
  },
];

const SACRED_DATES = [
  {monthEn: '10 Muharram', monthBn: '১০ মুহররম', titleEn: 'Day of Ashura', titleBn: 'পবিত্র আশুরা'},
  {monthEn: '12 Rabi’ al-Awwal', monthBn: '১২ রবিউল আউয়াল', titleEn: 'Prophetic Seerah Remembrance', titleBn: 'সীরাতুন্নবী (ﷺ) স্মরণ'},
  {monthEn: '27 Rajab', monthBn: '২৭ রজব', titleEn: 'Al-Isra wal-Mi’raj', titleBn: 'পবিত্র মেরাজ রজনী'},
  {monthEn: '15 Sha’ban', monthBn: '১৫ শাবান', titleEn: 'Laylatul Bara’ah', titleBn: 'শবে বরাত'},
  {monthEn: '1 Ramadan', monthBn: '১ রমজান', titleEn: 'Beginning of Ramadan Fasting', titleBn: 'মাহে রমজান শুরু'},
  {monthEn: '27 Ramadan', monthBn: '২৭ রমজান', titleEn: 'Laylatul Qadr (Odd Last Nights)', titleBn: 'লাইলাতুল কদর (সম্ভাব্য রাত)'},
  {monthEn: '1 Shawwal', monthBn: '১ শাওয়াল', titleEn: 'Eid al-Fitr', titleBn: 'পবিত্র ঈদুল ফিতর'},
  {monthEn: '9 Dhu al-Hijjah', monthBn: '৯ যিলহজ্জ', titleEn: 'Day of Arafah', titleBn: 'আরাফার দিন'},
  {monthEn: '10 Dhu al-Hijjah', monthBn: '১০ যিলহজ্জ', titleEn: 'Eid al-Adha', titleBn: 'পবিত্র ঈদুল আযহা'},
];

const CURRENCY_CONFIG = {
  BDT: {symbol: '৳', silverNisab: 95000, goldNisab: 1180000},
  USD: {symbol: '$', silverNisab: 620, goldNisab: 7400},
  GBP: {symbol: '£', silverNisab: 490, goldNisab: 5850},
  EUR: {symbol: '€', silverNisab: 570, goldNisab: 6850},
};

export const ToolsSuite: React.FC<ToolsSuiteProps> = ({
  lang,
  t,
  activeTab,
  onSelectTab,
  now,
  bookmarks,
  onRemoveBookmark,
  onOpenDuas,
}) => {
  // Tasbih State
  const [selectedDhikrId, setSelectedDhikrId] = useState(DHIKR_PRESETS[0].id);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState<number>(33);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 99 Names Search
  const [namesSearch, setNamesSearch] = useState('');

  // Zakat State
  const [currency, setCurrency] = useState<'BDT' | 'USD' | 'GBP' | 'EUR'>('BDT');
  const [nisabType, setNisabType] = useState<'silver' | 'gold'>('silver');
  const [cash, setCash] = useState('');
  const [goldVal, setGoldVal] = useState('');
  const [silverVal, setSilverVal] = useState('');
  const [investments, setInvestments] = useState('');
  const [business, setBusiness] = useState('');
  const [debts, setDebts] = useState('');

  const playBeadSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore audio errors
    }
  };

  const handleTasbihTap = () => {
    playBeadSound();
    setSessionTotal((s) => s + 1);
    setTasbihCount((c) => {
      if (tasbihTarget > 0 && c + 1 > tasbihTarget) {
        return 1;
      }
      return c + 1;
    });
  };

  const selectedDhikr =
    DHIKR_PRESETS.find((d) => d.id === selectedDhikrId) || DHIKR_PRESETS[0];

  const filteredNames = useMemo(() => {
    const q = namesSearch.trim().toLowerCase();
    if (!q) return NAMES_OF_ALLAH;
    return NAMES_OF_ALLAH.filter(
      (n) =>
        String(n.number).includes(q) ||
        n.transliterationEn.toLowerCase().includes(q) ||
        n.pronunciationBn.toLowerCase().includes(q) ||
        n.meaningEn.toLowerCase().includes(q) ||
        n.meaningBn.toLowerCase().includes(q) ||
        n.arabic.includes(q)
    );
  }, [namesSearch]);

  // Zakat Calculations
  const num = (v: string) => Math.max(0, parseFloat(v) || 0);
  const netWealth = Math.max(
    0,
    num(cash) +
      num(goldVal) +
      num(silverVal) +
      num(investments) +
      num(business) -
      num(debts)
  );
  const currCfg = CURRENCY_CONFIG[currency];
  const nisabThreshold =
    nisabType === 'silver' ? currCfg.silverNisab : currCfg.goldNisab;
  const isZakatEligible = netWealth >= nisabThreshold && netWealth > 0;
  const zakatPayable = isZakatEligible ? netWealth * 0.025 : 0;

  const hijriParts = getHijriDateParts(now);

  const tabs: {id: ToolsTab; label: string}[] = [
    {id: 'tasbih', label: t.tools.tabs.tasbih},
    {id: 'names', label: t.tools.tabs.names},
    {id: 'zakat', label: t.tools.tabs.zakat},
    {id: 'calendar', label: t.tools.tabs.calendar},
    {
      id: 'bookmarks',
      label: `${t.tools.tabs.bookmarks} (${formatNumber(bookmarks.length, lang)})`,
    },
  ];

  const progressRatio =
    tasbihTarget > 0 ? Math.min(1, tasbihCount / tasbihTarget) : 0;
  const circumference = 2 * Math.PI * 76;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 text-balance">
            {t.tools.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
            {t.tools.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDuas}
          className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 hover:border-emerald-800 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 transition-colors"
        >
          {t.nav.duas}
        </button>
      </div>

      {/* Segmented Tool Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFECE4] dark:bg-[#131B17] rounded-lg border border-stone-200 dark:border-stone-800 mb-8 w-fit">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white dark:bg-[#1F2C25] text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Digital Tasbih */}
      {activeTab === 'tasbih' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-3">
                {t.tools.tasbih.selectDhikr}
              </h2>
              <div className="space-y-2">
                {DHIKR_PRESETS.map((preset) => {
                  const active = preset.id === selectedDhikrId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedDhikrId(preset.id);
                        setTasbihCount(0);
                      }}
                      className={`w-full text-left p-3.5 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                        active
                          ? 'bg-emerald-900 text-white border-emerald-900 dark:bg-emerald-950 dark:border-emerald-600'
                          : 'bg-[#F8F6F1] dark:bg-[#0D1411] border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-medium">
                        {lang === 'bn' ? preset.bn : preset.en}
                      </span>
                      <span className="font-arabic text-lg shrink-0">
                        {preset.arabic}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                {t.tools.tasbih.targetLabel}
              </span>
              <div className="flex items-center gap-1.5">
                {[33, 99, 100, 0].map((targetVal) => (
                  <button
                    key={targetVal}
                    type="button"
                    onClick={() => {
                      setTasbihTarget(targetVal);
                      setTasbihCount(0);
                    }}
                    className={`px-2.5 py-1 text-xs font-mono-tabular font-medium rounded-md border ${
                      tasbihTarget === targetVal
                        ? 'bg-emerald-900 text-white border-emerald-900'
                        : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {targetVal === 0
                      ? t.tools.tasbih.unlimited
                      : formatNumber(targetVal, lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2">
              <p className="font-arabic text-3xl sm:text-4xl text-emerald-900 dark:text-emerald-300">
                {selectedDhikr.arabic}
              </p>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {lang === 'bn' ? selectedDhikr.bn : selectedDhikr.en}
              </p>
            </div>

            {/* Interactive SVG Ring Counter Button */}
            <button
              type="button"
              onClick={handleTasbihTap}
              className="relative w-48 h-48 rounded-full flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800 active:scale-[0.98] transition-transform duration-100"
              aria-label={t.tools.tasbih.tapToCount}
            >
              <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r="76"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-stone-200 dark:stroke-stone-800"
                />
                {tasbihTarget > 0 && (
                  <circle
                    cx="90"
                    cy="90"
                    r="76"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progressRatio)}
                    className="stroke-emerald-900 dark:stroke-emerald-400 transition-all duration-150"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono-tabular text-4xl font-bold text-stone-900 dark:text-stone-100">
                  {formatNumber(tasbihCount, lang)}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {tasbihTarget > 0
                    ? `/ ${formatNumber(tasbihTarget, lang)}`
                    : t.tools.tasbih.tapToCount}
                </span>
              </div>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTasbihTap}
                className="px-6 py-2.5 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:text-stone-950 dark:hover:bg-emerald-500 text-sm font-semibold min-h-[44px]"
              >
                {t.tools.tasbih.tapToCount}
              </button>

              <button
                type="button"
                onClick={() => setTasbihCount(0)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:border-stone-500 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.tools.tasbih.reset}</span>
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled((v) => !v)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[44px]"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span>
                  {soundEnabled
                    ? t.tools.tasbih.soundOn
                    : t.tools.tasbih.soundOff}
                </span>
              </button>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400">
              {t.tools.tasbih.totalSession}:{' '}
              <span className="font-mono-tabular font-semibold text-stone-800 dark:text-stone-200">
                {formatNumber(sessionTotal, lang)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. 99 Names of Allah */}
      {activeTab === 'names' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
              {t.tools.names.title}
            </h2>
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={namesSearch}
                onChange={(e) => setNamesSearch(e.target.value)}
                placeholder={t.tools.names.searchPlaceholder}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#131B17] text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {filteredNames.length === 0 ? (
            <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-10 text-center text-sm text-stone-500">
              {t.tools.names.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNames.map((item) => (
                <div
                  key={item.number}
                  className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-mono-tabular text-xs text-stone-400">
                      {formatNumber(item.number, lang)}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
                      {lang === 'bn'
                        ? item.pronunciationBn
                        : item.transliterationEn}
                    </h3>
                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                      {item.meaningBn}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {item.meaningEn}
                    </p>
                  </div>
                  <span className="font-arabic text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 shrink-0">
                    {item.arabic}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Zakat Calculator */}
      {activeTab === 'zakat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
                {t.tools.zakat.title}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                {t.tools.zakat.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  {t.tools.zakat.currencyLabel}
                </label>
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(e.target.value as 'BDT' | 'USD' | 'GBP' | 'EUR')
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-[#F8F6F1] dark:bg-[#0B110E] text-stone-900 dark:text-stone-100"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  {t.tools.zakat.nisabStandard}
                </label>
                <select
                  value={nisabType}
                  onChange={(e) =>
                    setNisabType(e.target.value as 'silver' | 'gold')
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-[#F8F6F1] dark:bg-[#0B110E] text-stone-900 dark:text-stone-100"
                >
                  <option value="silver">{t.tools.zakat.silverNisab}</option>
                  <option value="gold">{t.tools.zakat.goldNisab}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {label: t.tools.zakat.cashLabel, val: cash, set: setCash},
                {label: t.tools.zakat.goldValueLabel, val: goldVal, set: setGoldVal},
                {label: t.tools.zakat.silverValueLabel, val: silverVal, set: setSilverVal},
                {label: t.tools.zakat.investmentsLabel, val: investments, set: setInvestments},
                {label: t.tools.zakat.businessLabel, val: business, set: setBusiness},
                {label: t.tools.zakat.debtsLabel, val: debts, set: setDebts},
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={field.val}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 font-mono-tabular text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-[#F8F6F1] dark:bg-[#0B110E] text-stone-900 dark:text-stone-100"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setCash('');
                setGoldVal('');
                setSilverVal('');
                setInvestments('');
                setBusiness('');
                setDebts('');
              }}
              className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline"
            >
              {t.tools.zakat.resetForm}
            </button>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-5 bg-[#EFECE4] dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-400">
                  {t.tools.zakat.netZakatable}
                </span>
                <span className="font-mono-tabular font-semibold text-stone-900 dark:text-stone-100">
                  {currCfg.symbol}{' '}
                  {formatNumber(netWealth.toLocaleString('en-US', {maximumFractionDigits: 2}), lang)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 dark:text-stone-400">
                  {t.tools.zakat.nisabThreshold}
                </span>
                <span className="font-mono-tabular font-semibold text-stone-900 dark:text-stone-100">
                  {currCfg.symbol}{' '}
                  {formatNumber(nisabThreshold.toLocaleString('en-US'), lang)}
                </span>
              </div>
            </div>

            <div className="pt-5 border-t border-stone-300 dark:border-stone-700">
              <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
                {t.tools.zakat.zakatPayable}
              </div>
              <div className="font-mono-tabular text-4xl font-bold text-emerald-900 dark:text-emerald-300">
                {currCfg.symbol}{' '}
                {formatNumber(zakatPayable.toLocaleString('en-US', {maximumFractionDigits: 2}), lang)}
              </div>
              <p className="mt-3 text-xs font-medium text-stone-700 dark:text-stone-300">
                {isZakatEligible
                  ? t.tools.zakat.statusEligible
                  : t.tools.zakat.statusBelow}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Hijri Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-400 mb-1">
                {t.tools.calendar.todayHijri}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
                {formatHijriDate(now, lang)}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                {t.tools.calendar.todayGregorian}: {formatGregorianDate(now, lang)}
              </p>
            </div>
            <div className="font-arabic text-3xl sm:text-4xl text-emerald-900 dark:text-emerald-300">
              {HIJRI_MONTHS[hijriParts.monthIndex].ar}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6">
              <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
                {t.tools.calendar.hijriMonthsTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {HIJRI_MONTHS.map((m, idx) => {
                  const isCurrent = idx === hijriParts.monthIndex;
                  return (
                    <div
                      key={m.num}
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-900 text-white border-emerald-900'
                          : 'bg-[#F8F6F1] dark:bg-[#0D1411] border-stone-200/80 dark:border-stone-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-mono-tabular opacity-75">
                          {formatNumber(m.num, lang)}
                        </div>
                        <div className="text-sm font-semibold">
                          {lang === 'bn' ? m.bn : m.en}
                        </div>
                      </div>
                      <span className="font-arabic text-lg">{m.ar}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6">
              <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100 mb-4">
                {t.tools.calendar.sacredDatesTitle}
              </h3>
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {SACRED_DATES.map((sd, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {lang === 'bn' ? sd.titleBn : sd.titleEn}
                    </span>
                    <span className="text-xs font-mono-tabular text-stone-500 dark:text-stone-400 shrink-0">
                      {lang === 'bn' ? sd.monthBn : sd.monthEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Saved Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
            {t.tools.bookmarks.title}
          </h2>
          {bookmarks.length === 0 ? (
            <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-10 text-center text-sm text-stone-600 dark:text-stone-400">
              {t.tools.bookmarks.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bookmarks.map((bm) => (
                <article
                  key={bm.id}
                  className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-400">
                      {lang === 'bn' ? bm.titleBn : bm.titleEn}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveBookmark(bm.id)}
                      className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.tools.bookmarks.remove}</span>
                    </button>
                  </div>
                  <p className="font-arabic text-2xl text-right leading-[2] text-stone-900 dark:text-stone-100">
                    {bm.arabic}
                  </p>
                  <p className="font-bengali text-sm text-stone-900 dark:text-stone-100 leading-relaxed">
                    {bm.textBn}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {bm.textEn}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
