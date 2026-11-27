import React from 'react';
import {Compass, Moon, Sun} from 'lucide-react';
import {CityInfo, Language, NavSection, PrayerSchedule} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {
  formatCountdown,
  formatGregorianDate,
  formatHijriDate,
} from '../utils/prayerTimes';

interface UtilityRibbonProps {
  lang: Language;
  t: Translations;
  now: Date;
  selectedCity: CityInfo;
  usingGps: boolean;
  schedule: PrayerSchedule;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (section: NavSection) => void;
}

export const UtilityRibbon: React.FC<UtilityRibbonProps> = ({
  lang,
  t,
  now,
  selectedCity,
  usingGps,
  schedule,
  isDark,
  onToggleTheme,
  onNavigate,
}) => {
  const hijriStr = formatHijriDate(now, lang);
  const gregorianStr = formatGregorianDate(now, lang);
  const nextPrayerItem =
    schedule.prayers.find((p) => p.key === schedule.nextPrayerKey) ??
    schedule.prayers[0];
  const nextLabel = lang === 'bn' ? nextPrayerItem.labelBn : nextPrayerItem.labelEn;
  const cityLabel = usingGps
    ? t.utility.gpsActive
    : lang === 'bn'
      ? selectedCity.nameBn
      : selectedCity.nameEn;

  return (
    <div className="bg-[#EFECE4] dark:bg-[#111915] border-b border-stone-200 dark:border-stone-800/90 text-xs sm:text-[13px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {/* Hijri & Gregorian Date */}
        <button
          type="button"
          onClick={() => onNavigate('tools')}
          className="flex items-center gap-2 text-stone-700 dark:text-stone-300 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors text-left"
        >
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {hijriStr}
          </span>
          <span aria-hidden="true" className="text-stone-400">
            ·
          </span>
          <span className="hidden sm:inline text-stone-600 dark:text-stone-400">
            {gregorianStr}
          </span>
        </button>

        {/* Operational Prayer Status & Theme Switch */}
        <div className="flex items-center gap-4 sm:gap-6 ml-auto">
          <button
            type="button"
            onClick={() => onNavigate('prayer')}
            className="flex items-center gap-2 text-stone-700 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400 shrink-0" />
            <span>{cityLabel}</span>
            <span aria-hidden="true" className="text-stone-400">
              ·
            </span>
            <span className="text-stone-600 dark:text-stone-400">
              {t.utility.nextPrayer}:
            </span>
            <span className="font-semibold text-emerald-900 dark:text-emerald-300">
              {nextLabel}
            </span>
            <span className="font-mono-tabular font-semibold text-stone-900 dark:text-stone-100">
              {formatCountdown(schedule.countdownSeconds, lang)}
            </span>
          </button>

          <span aria-hidden="true" className="h-3.5 w-px bg-stone-300 dark:bg-stone-700" />

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 px-2 rounded-md hover:bg-stone-200/70 dark:hover:bg-stone-800/70"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.theme.light}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-stone-700" />
                <span>{t.theme.dark}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
