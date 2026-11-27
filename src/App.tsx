import {useEffect, useMemo, useState} from 'react';
import {
  AsrSchool,
  BookmarkItem,
  CalculationMethodId,
  CityInfo,
  Language,
  NavSection,
  ToolsTab,
} from './types/islamic';
import {TRANSLATIONS} from './i18n/translations';
import {CITIES} from './data/cities';
import {calculatePrayerSchedule} from './utils/prayerTimes';
import {Navbar} from './components/Navbar';
import {UtilityRibbon} from './components/UtilityRibbon';
import {HomeOverview} from './components/HomeOverview';
import {QuranReader} from './components/QuranReader';
import {HadithSection} from './components/HadithSection';
import {LexiconSection} from './components/LexiconSection';
import {DuasSection} from './components/DuasSection';
import {PrayerSection} from './components/PrayerSection';
import {ToolsSuite} from './components/ToolsSuite';
import {Footer} from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('almizan_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('almizan_theme');
    return saved === 'dark';
  });

  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [activeToolsTab, setActiveToolsTab] = useState<ToolsTab>('tasbih');
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(1);

  const [selectedCity, setSelectedCity] = useState<CityInfo>(CITIES[0]); // Dhaka default
  const [usingGps, setUsingGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{lat: number; lon: number} | null>(
    null
  );
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [method, setMethod] = useState<CalculationMethodId>('karachi');
  const [asrSchool, setAsrSchool] = useState<AsrSchool>('hanafi');

  const [now, setNow] = useState<Date>(() => new Date());

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const raw = localStorage.getItem('almizan_bookmarks');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('almizan_lang', lang);
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('almizan_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('almizan_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 1-second ticking clock for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const coords = useMemo(() => {
    if (usingGps && gpsCoords) return gpsCoords;
    return {lat: selectedCity.lat, lon: selectedCity.lon};
  }, [usingGps, gpsCoords, selectedCity]);

  const timezoneOffset = usingGps
    ? -now.getTimezoneOffset() / 60
    : selectedCity.timezoneOffset;

  const schedule = useMemo(() => {
    return calculatePrayerSchedule(
      now,
      coords.lat,
      coords.lon,
      timezoneOffset,
      method,
      asrSchool
    );
  }, [now, coords.lat, coords.lon, timezoneOffset, method, asrSchool]);

  const t = TRANSLATIONS[lang];

  const handleNavigate = (section: NavSection, toolsTab?: ToolsTab) => {
    setActiveSection(section);
    if (toolsTab) {
      setActiveToolsTab(toolsTab);
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleOpenSurah = (surahNumber: number) => {
    setActiveSurahNumber(surahNumber);
    setActiveSection('quran');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleSelectCity = (city: CityInfo) => {
    setUsingGps(false);
    setGpsError(null);
    setSelectedCity(city);
    setMethod(city.defaultMethod);
    setAsrSchool(city.defaultAsr);
  };

  const handleRequestGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError(
        lang === 'bn'
          ? 'আপনার ব্রাউজার জিপিএস লোকেশন সমর্থন করে না।'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setUsingGps(true);
      },
      () => {
        setGpsError(
          lang === 'bn'
            ? 'লোকেশন অনুমতি পাওয়া যায়নি; তালিকা থেকে শহর নির্বাচন করুন।'
            : 'Location permission denied; please choose a city from the list.'
        );
      }
    );
  };

  const handleToggleBookmark = (item: BookmarkItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) {
        return prev.filter((b) => b.id !== item.id);
      }
      return [item, ...prev];
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F1] dark:bg-[#0B110E] text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <Navbar
        lang={lang}
        t={t}
        activeSection={activeSection}
        onSelectSection={(sec) => handleNavigate(sec)}
        onToggleLanguage={() => setLang((prev) => (prev === 'en' ? 'bn' : 'en'))}
      />

      <UtilityRibbon
        lang={lang}
        t={t}
        now={now}
        selectedCity={selectedCity}
        usingGps={usingGps}
        schedule={schedule}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onNavigate={(sec) =>
          handleNavigate(sec, sec === 'tools' ? 'calendar' : undefined)
        }
      />

      <main className="flex-1">
        {activeSection === 'overview' && (
          <HomeOverview
            lang={lang}
            t={t}
            selectedCity={selectedCity}
            schedule={schedule}
            onNavigate={handleNavigate}
            onOpenSurah={handleOpenSurah}
          />
        )}

        {activeSection === 'quran' && (
          <QuranReader
            lang={lang}
            t={t}
            activeSurahNumber={activeSurahNumber}
            onSelectSurah={setActiveSurahNumber}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeSection === 'hadith' && (
          <HadithSection
            lang={lang}
            t={t}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeSection === 'lexicon' && <LexiconSection lang={lang} t={t} />}

        {activeSection === 'duas' && <DuasSection lang={lang} t={t} />}

        {activeSection === 'prayer' && (
          <PrayerSection
            lang={lang}
            t={t}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
            usingGps={usingGps}
            coords={coords}
            onRequestGps={handleRequestGps}
            gpsError={gpsError}
            method={method}
            onChangeMethod={setMethod}
            asrSchool={asrSchool}
            onChangeAsr={setAsrSchool}
            schedule={schedule}
          />
        )}

        {activeSection === 'tools' && (
          <ToolsSuite
            lang={lang}
            t={t}
            activeTab={activeToolsTab}
            onSelectTab={setActiveToolsTab}
            now={now}
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onOpenDuas={() => handleNavigate('duas')}
          />
        )}
      </main>

      <Footer
        lang={lang}
        t={t}
        onNavigate={(sec) => handleNavigate(sec)}
      />
    </div>
  );
}
