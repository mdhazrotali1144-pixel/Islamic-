import React, {useMemo, useState} from 'react';
import {Search} from 'lucide-react';
import {Language, LexiconEntry} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {LEXICON_ENTRIES} from '../data/lexicon';

interface LexiconSectionProps {
  lang: Language;
  t: Translations;
}

export const LexiconSection: React.FC<LexiconSectionProps> = ({lang, t}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | LexiconEntry['category']
  >('all');

  const categories: {id: 'all' | LexiconEntry['category']; label: string}[] = [
    {id: 'all', label: t.lexicon.allCategories},
    {id: 'faith', label: t.lexicon.categories.faith},
    {id: 'worship', label: t.lexicon.categories.worship},
    {id: 'ethics', label: t.lexicon.categories.ethics},
    {id: 'community', label: t.lexicon.categories.community},
  ];

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LEXICON_ENTRIES.filter((entry) => {
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        entry.termEn.toLowerCase().includes(q) ||
        entry.termBn.toLowerCase().includes(q) ||
        entry.pronunciationBn.toLowerCase().includes(q) ||
        entry.meaningEn.toLowerCase().includes(q) ||
        entry.meaningBn.toLowerCase().includes(q) ||
        entry.arabic.includes(q) ||
        entry.root.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 text-balance">
          {t.lexicon.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
          {t.lexicon.subtitle}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFECE4] dark:bg-[#131B17] rounded-lg border border-stone-200 dark:border-stone-800">
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

        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.lexicon.searchPlaceholder}
            className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#131B17] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-2 focus:outline-emerald-800"
          />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-10 text-center text-sm text-stone-600 dark:text-stone-400">
          {t.lexicon.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntries.map((item) => (
            <article
              key={item.id}
              className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-400">
                      {t.lexicon.categories[item.category]}
                    </span>{' '}
                    · {t.lexicon.rootLabel}: {item.root}
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {item.termEn} · {item.termBn}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {t.lexicon.pronunciationLabel}: {item.pronunciationBn}
                  </p>
                </div>
                <span className="font-arabic text-3xl text-emerald-900 dark:text-emerald-300 shrink-0">
                  {item.arabic}
                </span>
              </div>

              {/* Meanings */}
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {t.lexicon.bengaliMeaning}
                  </dt>
                  <dd className="font-bengali text-base text-stone-900 dark:text-stone-100 mt-0.5 leading-relaxed">
                    {item.meaningBn}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {t.lexicon.englishMeaning}
                  </dt>
                  <dd className="text-stone-700 dark:text-stone-300 mt-0.5 leading-relaxed">
                    {item.meaningEn}
                  </dd>
                </div>
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  <dt className="text-xs font-semibold text-amber-900 dark:text-amber-400">
                    {t.lexicon.scholarlyNuance}
                  </dt>
                  <dd className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    {lang === 'bn' ? item.nuanceBn : item.nuanceEn}
                  </dd>
                </div>
              </dl>

              <div className="pt-2 text-xs text-stone-500 dark:text-stone-400">
                {t.lexicon.referenceLabel}:{' '}
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  {lang === 'bn' ? item.referenceBn : item.referenceEn}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
