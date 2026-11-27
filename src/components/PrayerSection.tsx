import React, {useEffect, useState} from 'react';
import {Compass, LocateFixed} from 'lucide-react';
import {
  AsrSchool,
  CalculationMethodId,
  CityInfo,
  Language,
  PrayerSchedule,
} from '../types/islamic';
import {Translations} from '../i18n/translations';
import {CITIES} from '../data/cities';
import {
  calculateDistanceToKaaba,
  calculateQiblaBearing,
  formatCountdown,
  formatNumber,
  getCompassCardinal,
} from '../utils/prayerTimes';

interface PrayerSectionProps {
  lang: Language;
  t: Translations;
  selectedCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
  usingGps: boolean;
  coords: {lat: number; lon: number};
  onRequestGps: () => void;
  gpsError: string | null;
  method: CalculationMethodId;
  onChangeMethod: (m: CalculationMethodId) => void;
  asrSchool: AsrSchool;
  onChangeAsr: (a: AsrSchool) => void;
  schedule: PrayerSchedule;
}

export const PrayerSection: React.FC<PrayerSectionProps> = ({
  lang,
  t,
  selectedCity,
  onSelectCity,
  usingGps,
  coords,
  onRequestGps,
  gpsError,
  method,
  onChangeMethod,
  asrSchool,
  onChangeAsr,
  schedule,
}) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassEnabled, setCompassEnabled] = useState(false);
  const [compassNote, setCompassNote] = useState(false);
  const [astrolabeImgError, setAstrolabeImgError] = useState(false);

  const qiblaBearing = calculateQiblaBearing(coords.lat, coords.lon);
  const distanceKm = calculateDistanceToKaaba(coords.lat, coords.lon);
  const cardinal = getCompassCardinal(qiblaBearing, lang);

  const dialRotation =
    compassEnabled && deviceHeading !== null
      ? qiblaBearing - deviceHeading
      : qiblaBearing;

  useEffect(() => {
    if (!compassEnabled) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const webkitHeading = (
        event as DeviceOrientationEvent & {webkitCompassHeading?: number}
      ).webkitCompassHeading;
      if (typeof webkitHeading === 'number') {
        setDeviceHeading(webkitHeading);
      } else if (typeof event.alpha === 'number') {
        setDeviceHeading(360 - event.alpha);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [compassEnabled]);

  const handleEnableCompass = async () => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DOE?.requestPermission === 'function') {
      try {
        const res = await DOE.requestPermission();
        if (res === 'granted') {
          setCompassEnabled(true);
          return;
        }
      } catch {
        setCompassNote(true);
      }
    }
    if ('DeviceOrientationEvent' in window) {
      setCompassEnabled(true);
      setCompassNote(true);
    } else {
      setCompassNote(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 text-balance">
          {t.prayer.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
          {t.prayer.subtitle}
        </p>
      </div>

      {/* Configuration Row */}
      <div className="bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="city-select"
            className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2"
          >
            {t.prayer.cityLabel}
          </label>
          <div className="flex gap-2">
            <select
              id="city-select"
              value={usingGps ? 'gps' : selectedCity.id}
              onChange={(e) => {
                const found = CITIES.find((c) => c.id === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="flex-1 px-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-[#F8F6F1] dark:bg-[#0B110E] text-stone-900 dark:text-stone-100"
            >
              {usingGps && (
                <option value="gps">{t.utility.gpsActive}</option>
              )}
              {CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {lang === 'bn'
                    ? `${city.nameBn} (${city.countryBn})`
                    : `${city.nameEn} (${city.countryEn})`}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onRequestGps}
              title={t.utility.useGps}
              className="px-3 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:border-emerald-800 text-stone-700 dark:text-stone-200 inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <LocateFixed className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              <span>{t.utility.useGps}</span>
            </button>
          </div>
          {gpsError && (
            <p className="mt-1.5 text-xs text-amber-800 dark:text-amber-300">
              {gpsError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="method-select"
            className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2"
          >
            {t.prayer.methodLabel}
          </label>
          <select
            id="method-select"
            value={method}
            onChange={(e) =>
              onChangeMethod(e.target.value as CalculationMethodId)
            }
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-[#F8F6F1] dark:bg-[#0B110E] text-stone-900 dark:text-stone-100"
          >
            <option value="karachi">{t.prayer.methods.karachi}</option>
            <option value="isna">{t.prayer.methods.isna}</option>
            <option value="mwl">{t.prayer.methods.mwl}</option>
            <option value="makkah">{t.prayer.methods.makkah}</option>
          </select>
        </div>

        <div>
          <span className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
            {t.prayer.asrLabel}
          </span>
          <div className="flex items-center gap-1 p-1 bg-[#F2EFE8] dark:bg-[#0B110E] rounded-lg border border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => onChangeAsr('hanafi')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                asrSchool === 'hanafi'
                  ? 'bg-white dark:bg-[#1F2C25] text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {t.prayer.asrHanafi}
            </button>
            <button
              type="button"
              onClick={() => onChangeAsr('shafi')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                asrSchool === 'shafi'
                  ? 'bg-white dark:bg-[#1F2C25] text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {t.prayer.asrShafi}
            </button>
          </div>
        </div>
      </div>

      {/* Prayer Timetable & Qibla Astrolabe Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Detailed Timetable */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800 mb-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
                  {t.overview.prayerStripTitle}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {formatNumber(coords.lat.toFixed(3), lang)}° N,{' '}
                  {formatNumber(coords.lon.toFixed(3), lang)}° E
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {t.utility.nextPrayer}
                </div>
                <div className="font-mono-tabular text-xl font-semibold text-emerald-900 dark:text-emerald-300">
                  {formatCountdown(schedule.countdownSeconds, lang)}
                </div>
              </div>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {schedule.prayers.map((prayer) => {
                const isNext = prayer.key === schedule.nextPrayerKey;
                return (
                  <div
                    key={prayer.key}
                    className={`py-3.5 px-3 rounded-lg flex items-center justify-between ${
                      isNext
                        ? 'bg-emerald-900/10 dark:bg-emerald-400/10'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-arabic text-xl text-stone-500 dark:text-stone-400 w-14 text-right">
                        {prayer.arabicLabel}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {lang === 'bn' ? prayer.labelBn : prayer.labelEn}
                        </div>
                        {isNext && (
                          <div className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-400">
                            {t.overview.nextBadge}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="font-mono-tabular text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100">
                      {lang === 'bn' ? prayer.time12Bn : prayer.time12En}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#F8F6F1] dark:bg-[#0D1411] border border-stone-200/70 dark:border-stone-800">
              <div className="text-stone-500 dark:text-stone-400">
                {t.prayer.suhoorEnds}
              </div>
              <div className="font-mono-tabular text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1">
                {formatNumber(schedule.suhoorEnds24, lang)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#F8F6F1] dark:bg-[#0D1411] border border-stone-200/70 dark:border-stone-800">
              <div className="text-stone-500 dark:text-stone-400">
                {t.prayer.tahajjudStarts}
              </div>
              <div className="font-mono-tabular text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1">
                {formatNumber(schedule.tahajjudStarts24, lang)}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Precision Qibla Compass & Astrolabe Heritage */}
        <div className="lg:col-span-6 bg-white dark:bg-[#131B17] border border-stone-200 dark:border-stone-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">
              {t.prayer.qiblaTitle}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              {t.prayer.qiblaSubtitle}
            </p>
          </div>

          {/* Precision SVG Astrolabe Compass Dial */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-56 h-56 shrink-0 flex items-center justify-center">
              <svg
                viewBox="0 0 220 220"
                className="w-full h-full"
                aria-label={`${t.prayer.bearingLabel} ${qiblaBearing.toFixed(1)}°`}
              >
                {/* Outer Ring */}
                <circle
                  cx="110"
                  cy="110"
                  r="102"
                  className="fill-[#F8F6F1] dark:fill-[#0B110E] stroke-stone-300 dark:stroke-stone-700"
                  strokeWidth="2"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="86"
                  className="fill-none stroke-stone-200 dark:stroke-stone-800"
                  strokeWidth="1"
                />

                {/* Degree Ticks */}
                {Array.from({length: 36}).map((_, i) => {
                  const angle = i * 10;
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const r1 = i % 3 === 0 ? 90 : 95;
                  const r2 = 100;
                  return (
                    <line
                      key={i}
                      x1={110 + r1 * Math.cos(rad)}
                      y1={110 + r1 * Math.sin(rad)}
                      x2={110 + r2 * Math.cos(rad)}
                      y2={110 + r2 * Math.sin(rad)}
                      className="stroke-stone-400 dark:stroke-stone-600"
                      strokeWidth={i % 9 === 0 ? '2' : '1'}
                    />
                  );
                })}

                {/* Cardinal Labels */}
                <text x="110" y="25" textAnchor="middle" className="fill-emerald-900 dark:fill-emerald-400 text-[11px] font-bold">
                  N
                </text>
                <text x="197" y="114" textAnchor="middle" className="fill-stone-500 text-[10px] font-semibold">
                  E
                </text>
                <text x="110" y="203" textAnchor="middle" className="fill-stone-500 text-[10px] font-semibold">
                  S
                </text>
                <text x="23" y="114" textAnchor="middle" className="fill-stone-500 text-[10px] font-semibold">
                  W
                </text>

                {/* Rotating Qibla Pointer */}
                <g
                  transform={`rotate(${dialRotation} 110 110)`}
                  style={{transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'}}
                >
                  <polygon
                    points="110,28 117,110 103,110"
                    className="fill-emerald-900 dark:fill-emerald-400"
                  />
                  <polygon
                    points="110,175 115,110 105,110"
                    className="fill-stone-300 dark:fill-stone-700"
                  />
                  <circle
                    cx="110"
                    cy="34"
                    r="6"
                    className="fill-amber-700 dark:fill-amber-400"
                  />
                </g>

                <circle
                  cx="110"
                  cy="110"
                  r="8"
                  className="fill-stone-900 dark:fill-stone-100"
                />
              </svg>
            </div>

            <div className="space-y-4 flex-1 w-full">
              <div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {t.prayer.bearingLabel}
                </div>
                <div className="font-mono-tabular text-3xl font-semibold text-emerald-900 dark:text-emerald-300 mt-0.5">
                  {formatNumber(qiblaBearing.toFixed(1), lang)}° {cardinal}
                </div>
              </div>

              <div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {t.prayer.distanceLabel}
                </div>
                <div className="font-mono-tabular text-lg font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                  {formatNumber(distanceKm.toLocaleString('en-US'), lang)} km
                </div>
              </div>

              <button
                type="button"
                onClick={handleEnableCompass}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 hover:border-emerald-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
              >
                <Compass className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>
                  {compassEnabled
                    ? t.prayer.compassActive
                    : t.prayer.enableCompass}
                </span>
              </button>

              {compassNote && (
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                  {t.prayer.compassUnsupported}
                </p>
              )}
            </div>
          </div>

          <figure className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="aspect-[16/7] rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
              {!astrolabeImgError ? (
                <img
                  src="/src/assets/images/astrolabe_brass_compass_1795776666780.jpg"
                  alt={t.prayer.astrolabeCaption}
                  referrerPolicy="no-referrer"
                  onError={() => setAstrolabeImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Compass className="w-8 h-8 text-amber-800" />
                </div>
              )}
            </div>
            <figcaption className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 italic">
              {t.prayer.astrolabeCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
};
