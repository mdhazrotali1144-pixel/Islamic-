import React, {useMemo, useState} from 'react';
import {Bookmark, Check, Copy, Search} from 'lucide-react';
import {BookmarkItem, HadithEntry, Language} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {HADITH_COLLECTION} from '../data/hadiths';

interface HadithSectionProps {
  lang: Language;
  t: Translations;
  bookmarks: BookmarkItem[];
  onToggleBookmark: (item: BookmarkItem) => void;
}

export const HadithSection: React.FC<HadithSectionProps> = ({
  lang,
  t,
  bookmarks,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | HadithEntry['category']
  >('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: {id: 'all' | HadithEntry['category']; label: string}[] = [
    {id: 'all', label: t.hadith.allCategories},
    {id: 'intention', label: t.hadith.categories.intention},
    {id: 'character', label: t.hadith.categories.character},
    {id: 'worship', label: t.hadith.categories.worship},
    {id: 'knowledge', label: t.hadith.categories.knowledge},
    {id: 'charity', label: t.hadith.categories.charity},
    {id: 'mercy', label: t.hadith.categories.mercy},
  ];

  const filteredHadiths = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return HADITH_COLLECTION.filter((h) => {
      if (selectedCategory !== 'all' && h.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        h.textEn.toLowerCase().includes(q) ||
        h.textBn.toLowerCase().includes(q) ||
        h.narratorEn.toLowerCase().includes(q) ||
        h.narratorBn.toLowerCase().includes(q) ||
        h.sourceEn.toLowerCase().includes(q) ||
        h.arabic.includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (h: HadithEntry) => {
    const text = `${h.arabic}\n\n${h.textBn}\n${h.textEn}\n— ${h.narratorEn} (${h.sourceEn})`;
    navigator.clipboard?.writeText(text);
    setCopiedId(h.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 text-balance">
          {t.hadith.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
          {t.hadith.subtitle}
        </p>
      </div>

      {/* Filter & Search Bar */}
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

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.hadith.searchPlaceholder}
            className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#131B17] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-2 focus:outline-emerald-800"
          />
        </div>
      </div>

      {filteredHadiths.length === 0 ? (
        <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-10 text-center text-sm text-stone-600 dark:text-stone-400">
          {t.hadith.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHadiths.map((hadith) => {
            const isBookmarked = bookmarks.some((b) => b.id === hadith.id);
            return (
              <article
                key={hadith.id}
                className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <span>
                      <strong className="font-semibold text-emerald-900 dark:text-emerald-400">
                        {t.hadith.categories[hadith.category]}
                      </strong>{' '}
                      · {t.hadith.narratedBy}:{' '}
                      {lang === 'bn' ? hadith.narratorBn : hadith.narratorEn}
                    </span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {lang === 'bn' ? hadith.gradeBn : hadith.gradeEn}
                    </span>
                  </div>

                  {/* Arabic Matn */}
                  <p className="font-arabic text-2xl leading-[2.05] text-right text-stone-900 dark:text-stone-100">
                    {hadith.arabic}
                  </p>

                  {/* Bilingual Translations */}
                  <div className="space-y-3">
                    <p className="font-bengali text-base leading-[1.75] text-stone-900 dark:text-stone-100">
                      {hadith.textBn}
                    </p>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                      {hadith.textEn}
                    </p>
                  </div>
                </div>

                {/* Footer & Actions */}
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {t.hadith.source}:{' '}
                    {lang === 'bn' ? hadith.sourceBn : hadith.sourceEn}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(hadith)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-800 transition-colors"
                    >
                      {copiedId === hadith.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedId === hadith.id ? t.quran.copied : t.quran.copy}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleBookmark({
                          id: hadith.id,
                          type: 'hadith',
                          titleEn: `${hadith.narratorEn} · ${hadith.sourceEn}`,
                          titleBn: `${hadith.narratorBn} · ${hadith.sourceBn}`,
                          arabic: hadith.arabic,
                          textEn: hadith.textEn,
                          textBn: hadith.textBn,
                          refEn: hadith.sourceEn,
                          refBn: hadith.sourceBn,
                          savedAt: new Date().toISOString(),
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isBookmarked
                          ? 'bg-emerald-900 text-white border-emerald-900 dark:bg-emerald-700 dark:border-emerald-700'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-800'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>
                        {isBookmarked ? t.quran.bookmarked : t.quran.bookmark}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
