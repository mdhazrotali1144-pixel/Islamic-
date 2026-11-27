import React, {useState} from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  HeartHandshake,
  Layers,
  ScrollText,
} from 'lucide-react';
import {
  CityInfo,
  Language,
  NavSection,
  PrayerSchedule,
  ToolsTab,
} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {LEXICON_ENTRIES} from '../data/lexicon';
import {formatNumber} from '../utils/prayerTimes';

interface HomeOverviewProps {
  lang: Language;
  t: Translations;
  selectedCity: CityInfo;
  schedule: PrayerSchedule;
  onNavigate: (section: NavSection, toolsTab?: ToolsTab) => void;
  onOpenSurah: (surahNumber: number) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  lang,
  t,
  selectedCity,
  schedule,
  onNavigate,
  onOpenSurah,
}) => {
  const [heroImgError, setHeroImgError] = useState(false);
  const [manuscriptImgError, setManuscriptImgError] = useState(false);

  const featuredWord = LEXICON_ENTRIES[0]; // Taqwa

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. Editorial Hero Split */}
      <section className="pt-8 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center py-2">
              <p className="text-xs sm:text-[13px] font-medium tracking-wider uppercase text-emerald-900 dark:text-emerald-400 mb-4">
                {t.hero.kicker}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-semibold leading-[1.16] tracking-tight text-stone-900 dark:text-stone-50 text-balance mb-5">
                {t.hero.title}
              </h1>
              <p className="text-base sm:text-[17px] leading-relaxed text-stone-600 dark:text-stone-300 max-w-xl mb-8">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('quran')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-900 text-stone-50 hover:bg-emerald-800 dark:bg-emerald-600 dark:text-stone-950 dark:hover:bg-emerald-500 text-sm font-semibold transition-colors duration-150 whitespace-nowrap min-h-[44px]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t.hero.primaryCta}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('lexicon')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-800 dark:hover:border-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 text-sm font-semibold transition-colors duration-150 whitespace-nowrap min-h-[44px]"
                >
                  <span>{t.hero.secondaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Framed Architectural Photography */}
            <div className="lg:col-span-6 flex flex-col">
              <figure className="flex-1 flex flex-col">
                <div className="relative flex-1 min-h-[280px] sm:min-h-[360px] rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-200 dark:bg-stone-900">
                  {!heroImgError ? (
                    <img
                      src="/src/assets/images/hero_islamic_architecture_1795776665289.jpg"
                      alt={t.hero.caption}
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full lg:h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-950 to-stone-900 text-stone-200">
                      <Compass className="w-10 h-10 mb-3 text-emerald-400" />
                      <p className="font-display text-lg">{t.brandName}</p>
                    </div>
                  )}
                </div>
                <figcaption className="mt-2.5 text-xs text-stone-500 dark:text-stone-400 italic">
                  {t.hero.caption}
                </figcaption>
              </figure>
            </div>
          </div>

          {/* 2. Full-Width 6-Prayer Operational Strip below Hero */}
          <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-5">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {t.overview.prayerStripTitle}
                </h2>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {lang === 'bn'
                    ? `${selectedCity.nameBn}, ${selectedCity.countryBn}`
                    : `${selectedCity.nameEn}, ${selectedCity.countryEn}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('prayer')}
                className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{t.overview.gatewayQiblaTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {schedule.prayers.map((prayer) => {
                const isNext = prayer.key === schedule.nextPrayerKey;
                return (
                  <button
                    key={prayer.key}
                    type="button"
                    onClick={() => onNavigate('prayer')}
                    className={`text-left p-4 rounded-xl border transition-colors duration-150 ${
                      isNext
                        ? 'bg-emerald-900 text-stone-50 border-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-500/70'
                        : 'bg-white dark:bg-[#131B17] border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-xs font-medium ${
                          isNext
                            ? 'text-emerald-100'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {lang === 'bn' ? prayer.labelBn : prayer.labelEn}
                      </span>
                      <span
                        className={`font-arabic text-sm ${
                          isNext
                            ? 'text-emerald-200'
                            : 'text-stone-400 dark:text-stone-500'
                        }`}
                      >
                        {prayer.arabicLabel}
                      </span>
                    </div>
                    <div
                      className={`font-mono-tabular text-base sm:text-lg font-semibold ${
                        isNext
                          ? 'text-white'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {lang === 'bn' ? prayer.time12Bn : prayer.time12En}
                    </div>
                    {isNext && (
                      <div className="mt-1.5 text-[11px] font-medium text-emerald-200">
                        {t.overview.nextBadge}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Daily Quranic Reflection & Featured Word Study */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left: Featured Quran Verse + Manuscript Image */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-5">
                <span className="font-semibold text-emerald-900 dark:text-emerald-400">
                  {t.overview.dailyVerseKicker}
                </span>
                <span>{t.overview.dailyVerseTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-7 space-y-4">
                  <p className="font-arabic text-2xl sm:text-3xl leading-[2.1] text-right text-stone-900 dark:text-stone-100">
                    فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا
                  </p>
                  <p className="text-base sm:text-lg font-medium text-stone-800 dark:text-stone-200 leading-relaxed">
                    {lang === 'bn'
                      ? 'নিশ্চয়ই কষ্টের সাথেই রয়েছে স্বস্তি ও সহজতা। নিশ্চয়ই কষ্টের সাথেই রয়েছে সহজতা।'
                      : 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.'}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                    {lang === 'bn'
                      ? '— সূরা আল-ইনশিরাহ (৯৪:৫-৬) · বাংলা উচ্চারণ: ফাইন্না মাআল উসরি ইউসরা'
                      : '— Surah Al-Inshirah (94:5–6) · Transliteration: Fa-inna ma-al-usri yusra'}
                  </p>
                </div>

                <figure className="sm:col-span-5">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
                    {!manuscriptImgError ? (
                      <img
                        src="/src/assets/images/quran_manuscript_study_1795776666012.jpg"
                        alt={t.overview.manuscriptCaption}
                        referrerPolicy="no-referrer"
                        onError={() => setManuscriptImgError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <BookOpen className="w-8 h-8 text-emerald-800 dark:text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 italic">
                    {t.overview.manuscriptCaption}
                  </figcaption>
                </figure>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'bn'
                  ? `সূরা ${formatNumber(94, lang)} · আয়াত ${formatNumber(5, lang)}–${formatNumber(6, lang)}`
                  : 'Surah 94 · Ayahs 5–6'}
              </span>
              <button
                type="button"
                onClick={() => onOpenSurah(94)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-900 dark:text-emerald-400 hover:underline"
              >
                <span>{t.overview.openInReader}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Bilingual Islamic Word of the Day */}
          <div className="lg:col-span-5 bg-[#EFECE4] dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-stone-600 dark:text-stone-400 mb-5">
                <span className="font-semibold text-amber-900 dark:text-amber-400">
                  {t.overview.wordOfDayKicker}
                </span>
                <span>{featuredWord.root}</span>
              </div>

              <div className="flex items-baseline justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
                    {lang === 'bn' ? featuredWord.termBn : featuredWord.termEn}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                    {lang === 'bn'
                      ? `${featuredWord.termEn} · ${featuredWord.pronunciationBn}`
                      : `${featuredWord.termBn} · ${featuredWord.pronunciationBn}`}
                  </p>
                </div>
                <span className="font-arabic text-3xl text-emerald-900 dark:text-emerald-300">
                  {featuredWord.arabic}
                </span>
              </div>

              <div className="space-y-3 text-sm leading-relaxed">
                <p className="font-medium text-stone-900 dark:text-stone-100">
                  {featuredWord.meaningBn}
                </p>
                <p className="text-stone-700 dark:text-stone-300">
                  {featuredWord.meaningEn}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-300/70 dark:border-stone-700/70">
                  {lang === 'bn' ? featuredWord.nuanceBn : featuredWord.nuanceEn}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-300/70 dark:border-stone-700/70 flex items-center justify-between">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {lang === 'bn' ? featuredWord.referenceBn : featuredWord.referenceEn}
              </span>
              <button
                type="button"
                onClick={() => onNavigate('lexicon')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-900 dark:text-emerald-400 hover:underline"
              >
                <span>{t.overview.exploreLexicon}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Scholarly Modules & Daily Utilities Gateways */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 text-balance">
            {t.overview.gatewaysTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            {t.overview.gatewaysSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button
            type="button"
            onClick={() => onNavigate('hadith')}
            className="text-left p-6 rounded-xl bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 hover:border-emerald-800/60 dark:hover:border-emerald-500/60 transition-colors duration-150 flex flex-col justify-between group"
          >
            <div>
              <ScrollText className="w-5 h-5 text-emerald-900 dark:text-emerald-400 mb-4" />
              <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {t.overview.gatewayHadithTitle}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {t.overview.gatewayHadithDesc}
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 dark:text-emerald-400 group-hover:underline">
              <span>{t.nav.hadith}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('duas')}
            className="text-left p-6 rounded-xl bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 hover:border-emerald-800/60 dark:hover:border-emerald-500/60 transition-colors duration-150 flex flex-col justify-between group"
          >
            <div>
              <HeartHandshake className="w-5 h-5 text-emerald-900 dark:text-emerald-400 mb-4" />
              <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {t.overview.gatewayDuasTitle}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {t.overview.gatewayDuasDesc}
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 dark:text-emerald-400 group-hover:underline">
              <span>{t.nav.duas}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('prayer')}
            className="text-left p-6 rounded-xl bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 hover:border-emerald-800/60 dark:hover:border-emerald-500/60 transition-colors duration-150 flex flex-col justify-between group"
          >
            <div>
              <Compass className="w-5 h-5 text-emerald-900 dark:text-emerald-400 mb-4" />
              <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {t.overview.gatewayQiblaTitle}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {t.overview.gatewayQiblaDesc}
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 dark:text-emerald-400 group-hover:underline">
              <span>{t.nav.prayer}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tools', 'tasbih')}
            className="text-left p-6 rounded-xl bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 hover:border-emerald-800/60 dark:hover:border-emerald-500/60 transition-colors duration-150 flex flex-col justify-between group"
          >
            <div>
              <Layers className="w-5 h-5 text-emerald-900 dark:text-emerald-400 mb-4" />
              <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                {t.overview.gatewayToolsTitle}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {t.overview.gatewayToolsDesc}
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 dark:text-emerald-400 group-hover:underline">
              <span>{t.nav.tools}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
