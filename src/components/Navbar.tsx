import React, {useState} from 'react';
import {Menu, X} from 'lucide-react';
import {Language, NavSection} from '../types/islamic';
import {Translations} from '../i18n/translations';

interface NavbarProps {
  lang: Language;
  t: Translations;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  t,
  activeSection,
  onSelectSection,
  onToggleLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {id: NavSection; label: string}[] = [
    {id: 'quran', label: t.nav.quran},
    {id: 'hadith', label: t.nav.hadith},
    {id: 'lexicon', label: t.nav.lexicon},
    {id: 'prayer', label: t.nav.prayer},
    {id: 'tools', label: t.nav.tools},
  ];

  const handleNavClick = (section: NavSection) => {
    onSelectSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F1]/95 dark:bg-[#0B110E]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('overview')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
        >
          {t.brandName}
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive =
              activeSection === item.id ||
              (item.id === 'tools' && activeSection === 'duas');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800 ${
                  isActive
                    ? 'text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-emerald-900 dark:bg-emerald-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action (Bilingual Toggle) + Mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={lang === 'en' ? 'Switch to Bengali' : 'Switch to English'}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-900 text-stone-50 hover:bg-emerald-800 dark:bg-emerald-600 dark:text-stone-950 dark:hover:bg-emerald-500 transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            {t.switchLangLabel}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-[#F8F6F1] dark:bg-[#0B110E] px-4 py-3 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] ${
              activeSection === 'overview'
                ? 'bg-emerald-900/10 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-300'
                : 'text-stone-700 dark:text-stone-300'
            }`}
          >
            {t.nav.overview}
          </button>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-900/10 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-300'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNavClick('duas')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] ${
              activeSection === 'duas'
                ? 'bg-emerald-900/10 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-300'
                : 'text-stone-700 dark:text-stone-300'
            }`}
          >
            {t.nav.duas}
          </button>
        </div>
      )}
    </header>
  );
};
