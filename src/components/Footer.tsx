import React from 'react';
import {Language, NavSection} from '../types/islamic';
import {Translations} from '../i18n/translations';

interface FooterProps {
  lang: Language;
  t: Translations;
  onNavigate: (section: NavSection) => void;
}

export const Footer: React.FC<FooterProps> = ({lang, t, onNavigate}) => {
  const links: {id: NavSection; label: string}[] = [
    {id: 'quran', label: t.nav.quran},
    {id: 'hadith', label: t.nav.hadith},
    {id: 'lexicon', label: t.nav.lexicon},
    {id: 'duas', label: t.nav.duas},
    {id: 'prayer', label: t.nav.prayer},
    {id: 'tools', label: t.nav.tools},
  ];

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#EFECE4] dark:bg-[#0E1612] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-lg">
          <div className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
            {t.brandName}
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            {t.footer.tagline}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-500">
            {t.footer.copyright} · {lang === 'bn' ? '১৪৪৮ হিজরি' : '1448 AH'}
          </p>
        </div>

        <nav
          aria-label={t.footer.quickLinks}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          {links.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
};
