import React, {useMemo, useState} from 'react';
import {Check, Copy, RotateCcw} from 'lucide-react';
import {DuaEntry, Language} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {MASNOON_DUAS} from '../data/duas';
import {formatNumber} from '../utils/prayerTimes';

interface DuasSectionProps {
  lang: Language;
  t: Translations;
}

export const DuasSection: React.FC<DuasSectionProps> = ({lang, t}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | DuaEntry['category']
  >('all');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: {id: 'all' | DuaEntry['category']; label: string}[] = [
    {id: 'all', label: t.duas.allCategories},
    {id: 'morning_evening', label: t.duas.categories.morning_evening},
    {id: 'salah', label: t.duas.categories.salah},
    {id: 'knowledge', label: t.duas.categories.knowledge},
    {id: 'forgiveness', label: t.duas.categories.forgiveness},
    {id: 'protection', label: t.duas.categories.protection},
    {id: 'family', label: t.duas.categories.family},
  ];

  const filteredDuas = useMemo(() => {
    if (selectedCategory === 'all') return MASNOON_DUAS;
    return MASNOON_DUAS.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const incrementDua = (id: string, max: number) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      if (current >= max) return prev;
      return {...prev, [id]: current + 1};
    });
  };

  const resetDua = (id: string) => {
    setCounts((prev) => ({...prev, [id]: 0}));
  };

  const handleCopy = (dua: DuaEntry) => {
    const text = `${dua.arabic}\n\n${dua.pronunciationBn}\n${dua.meaningBn}\n\n${dua.meaningEn}\n(${dua.referenceEn})`;
    navigator.clipboard?.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 text-balance">
          {t.duas.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
          {t.duas.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFECE4] dark:bg-[#131B17] rounded-lg border border-stone-200 dark:border-stone-800 mb-8 w-fit">
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                active
                  ? 'bg-white dark:bg-[#1F2C25] text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {filteredDuas.map((dua) => {
          const current = counts[dua.id] || 0;
          const isDone = current >= dua.recommendedCount;

          return (
            <article
              key={dua.id}
              className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-400">
                      {t.duas.categories[dua.category]}
                    </span>{' '}
                    · {lang === 'bn' ? dua.referenceBn : dua.referenceEn}
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {lang === 'bn' ? dua.titleBn : dua.titleEn}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(dua)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-800 transition-colors shrink-0"
                >
                  {copiedId === dua.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === dua.id ? t.quran.copied : t.quran.copy}</span>
                </button>
              </div>

              <p className="font-arabic text-2xl sm:text-3xl leading-[2.15] text-right text-stone-900 dark:text-stone-50">
                {dua.arabic}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {t.duas.pronunciationBnLabel}
                  </p>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {dua.pronunciationBn}
                  </p>
                  <p className="font-bengali text-base text-stone-900 dark:text-stone-100 leading-relaxed pt-1">
                    {dua.meaningBn}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {t.duas.transliterationEnLabel}
                  </p>
                  <p className="text-sm italic text-stone-600 dark:text-stone-400 leading-relaxed">
                    {dua.transliterationEn}
                  </p>
                  <p className="text-sm sm:text-[15px] text-stone-800 dark:text-stone-200 leading-relaxed pt-1">
                    {dua.meaningEn}
                  </p>
                </div>
              </div>

              {/* Interactive Repetition Counter */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => incrementDua(dua.id, dua.recommendedCount)}
                    disabled={isDone}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors min-h-[40px] ${
                      isDone
                        ? 'bg-emerald-900/15 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-300 cursor-default'
                        : 'bg-emerald-900 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:text-stone-950 dark:hover:bg-emerald-500'
                    }`}
                  >
                    {isDone
                      ? t.duas.completed
                      : `${t.duas.countProgress}: ${formatNumber(current, lang)} / ${formatNumber(dua.recommendedCount, lang)}`}
                  </button>

                  {current > 0 && (
                    <button
                      type="button"
                      onClick={() => resetDua(dua.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 min-h-[40px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.duas.resetCount}</span>
                    </button>
                  )}
                </div>

                <span className="font-mono-tabular text-xs text-stone-500 dark:text-stone-400">
                  {formatNumber(current, lang)} / {formatNumber(dua.recommendedCount, lang)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
