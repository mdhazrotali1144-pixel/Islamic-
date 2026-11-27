import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Bookmark,
  Check,
  Copy,
  Pause,
  Play,
  RefreshCw,
  Search,
  Volume2,
} from 'lucide-react';
import {BookmarkItem, Language, QuranAyah, SurahMeta} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {SURAHS_META} from '../data/surahsMeta';
import {CURATED_SURAHS} from '../data/curatedSurahs';
import {formatNumber} from '../utils/prayerTimes';

interface QuranReaderProps {
  lang: Language;
  t: Translations;
  activeSurahNumber: number;
  onSelectSurah: (num: number) => void;
  bookmarks: BookmarkItem[];
  onToggleBookmark: (item: BookmarkItem) => void;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  lang,
  t,
  activeSurahNumber,
  onSelectSurah,
  bookmarks,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Makki' | 'Madani'>('all');
  const [arabicFontSize, setArabicFontSize] = useState<number>(30);
  const [showTranslit, setShowTranslit] = useState(true);
  const [showBengali, setShowBengali] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showWordByWord, setShowWordByWord] = useState(true);

  const [fetchedCache, setFetchedCache] = useState<Record<number, QuranAyah[]>>({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAyahGlobal, setPlayingAyahGlobal] = useState<number | null>(null);
  const [audioError, setAudioError] = useState(false);

  const activeMeta: SurahMeta =
    SURAHS_META.find((s) => s.number === activeSurahNumber) || SURAHS_META[0];

  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SURAHS_META.filter((s) => {
      if (revelationFilter !== 'all' && s.revelationEn !== revelationFilter) {
        return false;
      }
      if (!q) return true;
      return (
        String(s.number).includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.meaningEn.toLowerCase().includes(q) ||
        s.nameBn.toLowerCase().includes(q) ||
        s.meaningBn.toLowerCase().includes(q) ||
        s.arabicName.includes(q)
      );
    });
  }, [searchQuery, revelationFilter]);

  const loadRemoteSurah = async (surahNum: number) => {
    setLoading(true);
    setFetchError(false);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih,bn.bengali`
      );
      if (!response.ok) throw new Error('Network error');
      const json = await response.json();
      if (!json?.data || json.data.length < 3) throw new Error('Invalid format');

      const [arEdition, enEdition, bnEdition] = json.data;
      const ayahs: QuranAyah[] = arEdition.ayahs.map(
        (arAyah: {number: number; numberInSurah: number; text: string}, idx: number) => ({
          numberInSurah: arAyah.numberInSurah,
          globalNumber: arAyah.number,
          arabic: arAyah.text,
          translationEn: enEdition.ayahs[idx]?.text ?? '',
          translationBn: bnEdition.ayahs[idx]?.text ?? '',
        })
      );

      setFetchedCache((prev) => ({...prev, [surahNum]: ayahs}));
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Stop audio when changing surah
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAyahGlobal(null);
    }
    setAudioError(false);

    if (!CURATED_SURAHS[activeSurahNumber] && !fetchedCache[activeSurahNumber]) {
      loadRemoteSurah(activeSurahNumber);
    } else {
      setFetchError(false);
    }
  }, [activeSurahNumber]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const currentAyahs: QuranAyah[] =
    CURATED_SURAHS[activeSurahNumber]?.ayahs || fetchedCache[activeSurahNumber] || [];

  const handleToggleAudio = (ayah: QuranAyah) => {
    if (!ayah.globalNumber) return;
    setAudioError(false);

    if (playingAyahGlobal === ayah.globalNumber) {
      audioRef.current?.pause();
      setPlayingAyahGlobal(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.globalNumber}.mp3`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAyahGlobal(ayah.globalNumber);

    audio.onended = () => {
      setPlayingAyahGlobal(null);
    };
    audio.onerror = () => {
      setPlayingAyahGlobal(null);
      setAudioError(true);
    };
    audio.play().catch(() => {
      setPlayingAyahGlobal(null);
      setAudioError(true);
    });
  };

  const handleCopyAyah = (ayah: QuranAyah) => {
    const text = `${ayah.arabic}\n\n${ayah.translationBn}\n${ayah.translationEn}\n— ${activeMeta.nameEn} (${activeMeta.number}:${ayah.numberInSurah})`;
    navigator.clipboard?.writeText(text);
    const id = `${activeMeta.number}:${ayah.numberInSurah}`;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 text-balance">
          {t.quran.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
          {t.quran.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Surah Directory Sidebar */}
        <aside className="lg:col-span-4 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-4 sm:p-5 lg:sticky lg:top-24">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.quran.searchPlaceholder}
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-[#F8F6F1] dark:bg-[#0B110E] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-2 focus:outline-emerald-800"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F2EFE8] dark:bg-[#0B110E] rounded-lg mb-4">
            {(['all', 'Makki', 'Madani'] as const).map((filterKey) => {
              const label =
                filterKey === 'all'
                  ? t.quran.allSurahs
                  : filterKey === 'Makki'
                    ? t.quran.makki
                    : t.quran.madani;
              const active = revelationFilter === filterKey;
              return (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setRevelationFilter(filterKey)}
                  className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-white dark:bg-[#1A241F] text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="max-h-[340px] lg:max-h-[540px] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/80 pr-1">
            {filteredSurahs.map((surah) => {
              const isSelected = surah.number === activeSurahNumber;
              const hasCurated = Boolean(CURATED_SURAHS[surah.number]);
              return (
                <button
                  key={surah.number}
                  type="button"
                  onClick={() => onSelectSurah(surah.number)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-900 text-stone-50 dark:bg-emerald-950 dark:border dark:border-emerald-700/60'
                      : 'hover:bg-stone-100/80 dark:hover:bg-stone-800/50 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`font-mono-tabular text-xs font-semibold w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-800 text-white'
                          : 'bg-[#EFECE4] dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {formatNumber(surah.number, lang)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {lang === 'bn' ? surah.nameBn : surah.nameEn}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          isSelected
                            ? 'text-emerald-100'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {lang === 'bn' ? surah.meaningBn : surah.meaningEn} ·{' '}
                        {formatNumber(surah.ayahCount, lang)} {t.quran.ayahsLabel}
                        {hasCurated && (lang === 'bn' ? ' · শব্দসহ' : ' · Word Study')}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`font-arabic text-lg shrink-0 ${
                      isSelected
                        ? 'text-emerald-100'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {surah.arabicName}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Quran Reading Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Surah Banner & Reading Controls */}
          <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  {lang === 'bn'
                    ? `সূরা ${formatNumber(activeMeta.number, lang)} · ${activeMeta.revelationBn} · ${formatNumber(activeMeta.ayahCount, lang)} আয়াত`
                    : `Surah ${activeMeta.number} · ${activeMeta.revelationEn} · ${activeMeta.ayahCount} Ayahs`}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
                  {lang === 'bn'
                    ? `${activeMeta.nameBn} — ${activeMeta.meaningBn}`
                    : `${activeMeta.nameEn} — ${activeMeta.meaningEn}`}
                </h2>
              </div>
              <div className="font-arabic text-3xl sm:text-4xl text-emerald-900 dark:text-emerald-300">
                سورة {activeMeta.arabicName}
              </div>
            </div>

            {/* Reader Toolbar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBengali((v) => !v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                    showBengali
                      ? 'bg-emerald-900 text-white border-emerald-900 dark:bg-emerald-700 dark:border-emerald-700'
                      : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {t.quran.showBengali}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEnglish((v) => !v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                    showEnglish
                      ? 'bg-emerald-900 text-white border-emerald-900 dark:bg-emerald-700 dark:border-emerald-700'
                      : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {t.quran.showEnglish}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTranslit((v) => !v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                    showTranslit
                      ? 'bg-emerald-900 text-white border-emerald-900 dark:bg-emerald-700 dark:border-emerald-700'
                      : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {t.quran.showTranslit}
                </button>
                <button
                  type="button"
                  onClick={() => setShowWordByWord((v) => !v)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                    showWordByWord
                      ? 'bg-amber-900 text-white border-amber-900 dark:bg-amber-700 dark:border-amber-700'
                      : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {t.quran.wordByWord}
                </button>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
                <label htmlFor="arabic-size-range" className="whitespace-nowrap">
                  {t.quran.arabicSize}
                </label>
                <input
                  id="arabic-size-range"
                  type="range"
                  min={22}
                  max={44}
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(Number(e.target.value))}
                  className="w-24 accent-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* Bismillah Header (except Surah 1 & 9) */}
          {activeMeta.number !== 1 && activeMeta.number !== 9 && (
            <div className="bg-[#EFECE4] dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl px-6 py-5 text-center">
              <p className="font-arabic text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400">
                {t.quran.bismillahNote}
              </p>
            </div>
          )}

          {audioError && (
            <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'bn'
                  ? 'এই মুহূর্তে অডিও স্ট্রিমিং সংযোগ করা যায়নি।'
                  : 'Audio stream could not be reached from this network environment.'}
              </span>
            </div>
          )}

          {/* Loading & Error States */}
          {loading && (
            <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-10 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-800 dark:text-emerald-400 mb-3" />
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {t.quran.loadingSurah}
              </p>
            </div>
          )}

          {!loading && fetchError && currentAyahs.length === 0 && (
            <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-8 text-center space-y-4">
              <p className="text-sm text-stone-700 dark:text-stone-300">
                {t.quran.fetchError}
              </p>
              <button
                type="button"
                onClick={() => loadRemoteSurah(activeSurahNumber)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-900 text-white hover:bg-emerald-800"
              >
                {t.quran.retry}
              </button>
            </div>
          )}

          {/* Ayah Verses */}
          <div className="space-y-4">
            {currentAyahs.map((ayah) => {
              const ayahId = `ayah-${activeMeta.number}-${ayah.numberInSurah}`;
              const isBookmarked = bookmarks.some((b) => b.id === ayahId);
              const isPlaying =
                ayah.globalNumber !== undefined &&
                playingAyahGlobal === ayah.globalNumber;
              const copyKey = `${activeMeta.number}:${ayah.numberInSurah}`;

              return (
                <article
                  key={ayah.numberInSurah}
                  className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 space-y-5"
                >
                  {/* Verse Header & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800/80">
                    <span className="font-mono-tabular text-xs font-semibold text-emerald-900 dark:text-emerald-400">
                      {formatNumber(activeMeta.number, lang)}:
                      {formatNumber(ayah.numberInSurah, lang)}
                    </span>

                    <div className="flex items-center gap-2">
                      {ayah.globalNumber && (
                        <button
                          type="button"
                          onClick={() => handleToggleAudio(ayah)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-800 dark:hover:border-emerald-400 transition-colors whitespace-nowrap"
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isPlaying ? t.quran.pauseAudio : t.quran.playAudio}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyAyah(ayah)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-800 dark:hover:border-emerald-400 transition-colors whitespace-nowrap"
                      >
                        {copiedId === copyKey ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {copiedId === copyKey ? t.quran.copied : t.quran.copy}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onToggleBookmark({
                            id: ayahId,
                            type: 'ayah',
                            titleEn: `${activeMeta.nameEn} (${activeMeta.number}:${ayah.numberInSurah})`,
                            titleBn: `${activeMeta.nameBn} (${formatNumber(activeMeta.number, 'bn')}:${formatNumber(ayah.numberInSurah, 'bn')})`,
                            arabic: ayah.arabic,
                            textEn: ayah.translationEn,
                            textBn: ayah.translationBn,
                            refEn: `Surah ${activeMeta.nameEn}`,
                            refBn: `সূরা ${activeMeta.nameBn}`,
                            savedAt: new Date().toISOString(),
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
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

                  {/* Arabic Uthmani Script */}
                  <p
                    style={{fontSize: `${arabicFontSize}px`, lineHeight: 2.05}}
                    className="font-arabic text-right text-stone-900 dark:text-stone-50"
                  >
                    {ayah.arabic}
                  </p>

                  {/* Transliteration */}
                  {showTranslit &&
                    (ayah.transliterationBn || ayah.transliterationEn) && (
                      <div className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 space-y-1">
                        {lang === 'bn' && ayah.transliterationBn && (
                          <p>{ayah.transliterationBn}</p>
                        )}
                        {ayah.transliterationEn && (
                          <p className="italic">{ayah.transliterationEn}</p>
                        )}
                      </div>
                    )}

                  {/* Bilingual Translations */}
                  <div className="space-y-3 max-w-prose">
                    {showBengali && (
                      <p className="font-bengali text-base sm:text-[17px] leading-[1.75] text-stone-900 dark:text-stone-100">
                        {ayah.translationBn}
                      </p>
                    )}
                    {showEnglish && (
                      <p className="text-[15px] sm:text-base leading-[1.7] text-stone-700 dark:text-stone-300">
                        {ayah.translationEn}
                      </p>
                    )}
                  </div>

                  {/* Word-by-Word Bilingual Lexical Breakdown */}
                  {showWordByWord && ayah.words && ayah.words.length > 0 && (
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                      <p className="text-xs font-semibold text-amber-900 dark:text-amber-400 mb-3">
                        {t.quran.wordByWord}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {ayah.words.map((word, wIdx) => (
                          <div
                            key={wIdx}
                            className="p-3 rounded-lg bg-[#F8F6F1] dark:bg-[#0D1411] border border-stone-200/80 dark:border-stone-800 text-center space-y-1"
                          >
                            <div className="font-arabic text-xl text-stone-900 dark:text-stone-100">
                              {word.arabic}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400">
                              {lang === 'bn'
                                ? word.transliterationBn
                                : word.transliterationEn}
                            </div>
                            <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                              {word.meaningBn}
                            </div>
                            <div className="text-[11px] text-stone-700 dark:text-stone-300">
                              {word.meaningEn}
                            </div>
                            {word.root && (
                              <div className="text-[10px] text-stone-400 dark:text-stone-500 pt-0.5">
                                {t.quran.rootLabel}: {word.root}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brief Tafsir Note */}
                  {(ayah.tafsirEn || ayah.tafsirBn) && (
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        {t.quran.tafsirLabel}:{' '}
                      </span>
                      {lang === 'bn' ? ayah.tafsirBn : ayah.tafsirEn}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
