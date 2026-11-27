import {Language} from '../types/islamic';

export interface Translations {
  brandName: string;
  nav: {
    quran: string;
    hadith: string;
    prayer: string;
    lexicon: string;
    duas: string;
    tools: string;
    overview: string;
  };
  switchLangLabel: string;
  theme: {
    light: string;
    dark: string;
  };
  utility: {
    nextPrayer: string;
    location: string;
    useGps: string;
    gpsActive: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    caption: string;
  };
  overview: {
    prayerStripTitle: string;
    nextBadge: string;
    dailyVerseKicker: string;
    dailyVerseTitle: string;
    openInReader: string;
    manuscriptCaption: string;
    wordOfDayKicker: string;
    exploreLexicon: string;
    gatewaysTitle: string;
    gatewaysSubtitle: string;
    gatewayHadithTitle: string;
    gatewayHadithDesc: string;
    gatewayDuasTitle: string;
    gatewayDuasDesc: string;
    gatewayQiblaTitle: string;
    gatewayQiblaDesc: string;
    gatewayToolsTitle: string;
    gatewayToolsDesc: string;
  };
  quran: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allSurahs: string;
    makki: string;
    madani: string;
    ayahsLabel: string;
    arabicSize: string;
    showTranslit: string;
    showBengali: string;
    showEnglish: string;
    wordByWord: string;
    rootLabel: string;
    playAudio: string;
    pauseAudio: string;
    loadingSurah: string;
    fetchError: string;
    retry: string;
    bookmark: string;
    bookmarked: string;
    copy: string;
    copied: string;
    bismillahNote: string;
    tafsirLabel: string;
  };
  hadith: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    categories: {
      intention: string;
      character: string;
      worship: string;
      knowledge: string;
      charity: string;
      mercy: string;
    };
    narratedBy: string;
    source: string;
    grade: string;
    noResults: string;
  };
  lexicon: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    categories: {
      faith: string;
      worship: string;
      ethics: string;
      community: string;
    };
    rootLabel: string;
    pronunciationLabel: string;
    bengaliMeaning: string;
    englishMeaning: string;
    scholarlyNuance: string;
    referenceLabel: string;
    noResults: string;
  };
  duas: {
    title: string;
    subtitle: string;
    allCategories: string;
    categories: {
      morning_evening: string;
      salah: string;
      knowledge: string;
      forgiveness: string;
      protection: string;
      family: string;
    };
    pronunciationBnLabel: string;
    transliterationEnLabel: string;
    countProgress: string;
    resetCount: string;
    completed: string;
  };
  prayer: {
    title: string;
    subtitle: string;
    cityLabel: string;
    methodLabel: string;
    asrLabel: string;
    asrHanafi: string;
    asrShafi: string;
    methods: {
      karachi: string;
      isna: string;
      mwl: string;
      makkah: string;
    };
    suhoorEnds: string;
    tahajjudStarts: string;
    qiblaTitle: string;
    qiblaSubtitle: string;
    bearingLabel: string;
    distanceLabel: string;
    kaabaLabel: string;
    enableCompass: string;
    compassActive: string;
    compassUnsupported: string;
    astrolabeCaption: string;
  };
  tools: {
    title: string;
    subtitle: string;
    tabs: {
      tasbih: string;
      names: string;
      zakat: string;
      calendar: string;
      bookmarks: string;
    };
    tasbih: {
      selectDhikr: string;
      targetLabel: string;
      unlimited: string;
      tapToCount: string;
      reset: string;
      totalSession: string;
      soundOn: string;
      soundOff: string;
    };
    names: {
      title: string;
      searchPlaceholder: string;
      noResults: string;
    };
    zakat: {
      title: string;
      subtitle: string;
      currencyLabel: string;
      nisabStandard: string;
      silverNisab: string;
      goldNisab: string;
      cashLabel: string;
      goldValueLabel: string;
      silverValueLabel: string;
      investmentsLabel: string;
      businessLabel: string;
      debtsLabel: string;
      netZakatable: string;
      nisabThreshold: string;
      statusEligible: string;
      statusBelow: string;
      zakatPayable: string;
      resetForm: string;
    };
    calendar: {
      title: string;
      subtitle: string;
      todayHijri: string;
      todayGregorian: string;
      sacredDatesTitle: string;
      hijriMonthsTitle: string;
    };
    bookmarks: {
      title: string;
      empty: string;
      remove: string;
    };
  };
  footer: {
    tagline: string;
    copyright: string;
    quickLinks: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'Al-Mizan',
    nav: {
      overview: 'Overview',
      quran: 'Quran',
      hadith: 'Hadith',
      prayer: 'Prayer',
      lexicon: 'Lexicon',
      duas: 'Duas',
      tools: 'Tools',
    },
    switchLangLabel: 'বাংলা',
    theme: {
      light: 'Light',
      dark: 'Dark',
    },
    utility: {
      nextPrayer: 'Next',
      location: 'City',
      useGps: 'Use GPS',
      gpsActive: 'GPS Location',
    },
    hero: {
      kicker: 'Bilingual Islamic Archive · English & Bengali',
      title: 'Al-Mizan: Sanctuary of Sacred Knowledge',
      subtitle:
        'Read the Holy Quran with Bengali and English translations, trace Arabic word roots in our bilingual lexicon, verify authentic Hadith, and calculate astronomical prayer times and Qibla direction.',
      primaryCta: 'Read Holy Quran',
      secondaryCta: 'Explore Bilingual Lexicon',
      caption: 'Fig. 1 — Classical limestone courtyard and geometric mashrabiya light study',
    },
    overview: {
      prayerStripTitle: 'Daily Salah Schedule',
      nextBadge: 'Next',
      dailyVerseKicker: 'Daily Quranic Reflection',
      dailyVerseTitle: 'Surah Al-Inshirah · Verses 5–6',
      openInReader: 'Open in Quran Reader',
      manuscriptCaption: 'Fig. 2 — Illuminated Arabic manuscript folio resting on a carved walnut rehal',
      wordOfDayKicker: 'Featured Lexicon Entry · Bengali & English',
      exploreLexicon: 'Browse Full Word Lexicon',
      gatewaysTitle: 'Scholarly Modules & Daily Utilities',
      gatewaysSubtitle: 'Every core Islamic reference and practical worship tool, structured cleanly in both Bengali and English.',
      gatewayHadithTitle: 'Sahih Hadith Archive',
      gatewayHadithDesc: 'Verified narrations from Bukhari and Muslim with Arabic Matn and bilingual commentary.',
      gatewayDuasTitle: 'Masnoon Duas & Adhkar',
      gatewayDuasDesc: 'Daily supplications from Hisn al-Muslim with Bengali pronunciation, English meaning, and tap counters.',
      gatewayQiblaTitle: 'Prayer Times & Qibla',
      gatewayQiblaDesc: 'Astronomical Salah timetables with Hanafi & Shafi Asr calculation and precision Qibla bearing.',
      gatewayToolsTitle: 'Tasbih, Zakat & 99 Names',
      gatewayToolsDesc: 'Tactile Dhikr counter, Asma-ul-Husna gallery, Nisab Zakat calculator, and Hijri calendar.',
    },
    quran: {
      title: 'Al-Quran Al-Kareem',
      subtitle: 'Complete 114-Surah index with Arabic Uthmani script, Bengali and English translations, audio recitation, and root word analysis.',
      searchPlaceholder: 'Search Surah by name or number (e.g. Rahman, রাহমান, 55)...',
      allSurahs: 'All 114',
      makki: 'Makki',
      madani: 'Madani',
      ayahsLabel: 'Ayahs',
      arabicSize: 'Arabic Size',
      showTranslit: 'Transliteration',
      showBengali: 'Bengali',
      showEnglish: 'English',
      wordByWord: 'Word Study',
      rootLabel: 'Root',
      playAudio: 'Play Audio',
      pauseAudio: 'Pause Audio',
      loadingSurah: 'Loading Surah verses in Arabic, Bengali, and English...',
      fetchError: 'Could not reach the online Quran archive right now. Curated Surahs remain available offline.',
      retry: 'Retry',
      bookmark: 'Save',
      bookmarked: 'Saved',
      copy: 'Copy',
      copied: 'Copied',
      bismillahNote: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      tafsirLabel: 'Brief Commentary',
    },
    hadith: {
      title: 'Authentic Hadith Collection',
      subtitle: 'Selected Sahih narrations with original Arabic text, chain of narration, and parallel Bengali and English translations.',
      searchPlaceholder: 'Search Hadith in English, Bengali, or narrator...',
      allCategories: 'All Topics',
      categories: {
        intention: 'Intention',
        character: 'Character',
        worship: 'Worship',
        knowledge: 'Knowledge',
        charity: 'Charity',
        mercy: 'Mercy',
      },
      narratedBy: 'Narrated by',
      source: 'Source',
      grade: 'Grade',
      noResults: 'No Hadith entries matched your search query.',
    },
    lexicon: {
      title: 'Bilingual Islamic Word Lexicon',
      subtitle: 'Understand essential Quranic and Islamic Arabic terms through parallel Bengali and English definitions, trilateral roots, and scriptural usage.',
      searchPlaceholder: 'Search Arabic, English, or Bengali terms (e.g. Taqwa, তাকওয়া, Sabr)...',
      allCategories: 'All Terms',
      categories: {
        faith: 'Faith & Heart',
        worship: 'Worship',
        ethics: 'Ethics & Character',
        community: 'Society & Law',
      },
      rootLabel: 'Arabic Root',
      pronunciationLabel: 'Bengali Pronunciation',
      bengaliMeaning: 'Bengali Meaning',
      englishMeaning: 'English Meaning',
      scholarlyNuance: 'Scholarly Context',
      referenceLabel: 'Reference',
      noResults: 'No matching Islamic terms found.',
    },
    duas: {
      title: 'Masnoon Duas & Daily Adhkar',
      subtitle: 'Authentic prophetic supplications with Arabic text, Bengali pronunciation guide, English transliteration, and interactive repetition counters.',
      allCategories: 'All Categories',
      categories: {
        morning_evening: 'Morning & Evening',
        salah: 'Salah & Mosque',
        knowledge: 'Knowledge & Guidance',
        forgiveness: 'Forgiveness',
        protection: 'Protection & Peace',
        family: 'Parents & Family',
      },
      pronunciationBnLabel: 'Bengali Pronunciation',
      transliterationEnLabel: 'English Transliteration',
      countProgress: 'Repetition',
      resetCount: 'Reset',
      completed: 'Completed',
    },
    prayer: {
      title: 'Astronomical Prayer Times & Qibla Compass',
      subtitle: 'Calculated locally from solar declination and geographic coordinates with regional calculation standards.',
      cityLabel: 'Select City',
      methodLabel: 'Calculation Method',
      asrLabel: 'Asr Juristic School',
      asrHanafi: 'Hanafi (Shadow 2x)',
      asrShafi: 'Shafi / Standard (Shadow 1x)',
      methods: {
        karachi: 'Univ. of Islamic Sciences, Karachi (BD / South Asia)',
        isna: 'Islamic Society of North America (ISNA)',
        mwl: 'Muslim World League (MWL)',
        makkah: 'Umm al-Qura University, Makkah',
      },
      suhoorEnds: 'Suhoor Ends (Fajr)',
      tahajjudStarts: 'Last Third of Night (Tahajjud)',
      qiblaTitle: 'Precision Qibla Astrolabe',
      qiblaSubtitle: 'True great-circle bearing toward the Sacred Kaaba in Makkah Al-Mukarramah.',
      bearingLabel: 'Qibla Bearing',
      distanceLabel: 'Distance to Kaaba',
      kaabaLabel: 'Kaaba',
      enableCompass: 'Enable Live Device Compass',
      compassActive: 'Live Compass Active',
      compassUnsupported: 'Orientation sensor unavailable on desktop; dial displays true geographic bearing from North (0°).',
      astrolabeCaption: 'Fig. 3 — Classical engraved brass astrolabe calibrated for celestial azimuth calculation',
    },
    tools: {
      title: 'Essential Islamic Utilities',
      subtitle: 'Practical tools for daily remembrance, Zakat calculation, Hijri dates, and studying the 99 Names of Allah.',
      tabs: {
        tasbih: 'Digital Tasbih',
        names: '99 Names',
        zakat: 'Zakat Calculator',
        calendar: 'Hijri Calendar',
        bookmarks: 'Bookmarks',
      },
      tasbih: {
        selectDhikr: 'Select Remembrance (Dhikr)',
        targetLabel: 'Cycle Target',
        unlimited: 'Unlimited',
        tapToCount: 'Tap to Count',
        reset: 'Reset Cycle',
        totalSession: 'Session Total',
        soundOn: 'Sound On',
        soundOff: 'Sound Off',
      },
      names: {
        title: 'Al-Asma-ul-Husna — The 99 Beautiful Names of Allah',
        searchPlaceholder: 'Search by number, English, or Bengali meaning...',
        noResults: 'No Names matched your search.',
      },
      zakat: {
        title: 'Annual Zakat Calculator (2.5%)',
        subtitle: 'Compute Zakat accurately in BDT, USD, GBP, or EUR based on current Nisab thresholds.',
        currencyLabel: 'Currency',
        nisabStandard: 'Nisab Standard',
        silverNisab: 'Silver (612.36g / 52.5 Tola — Recommended)',
        goldNisab: 'Gold (87.48g / 7.5 Tola)',
        cashLabel: 'Cash & Bank Balances',
        goldValueLabel: 'Gold Value',
        silverValueLabel: 'Silver Value',
        investmentsLabel: 'Shares, Mutual Funds & Receivables',
        businessLabel: 'Business Inventory & Trade Goods',
        debtsLabel: 'Short-Term Debts Due (Deducted)',
        netZakatable: 'Net Zakatable Wealth',
        nisabThreshold: 'Nisab Threshold',
        statusEligible: 'Eligible — Zakat is Obligatory (2.5%)',
        statusBelow: 'Below Nisab — No Zakat Due',
        zakatPayable: 'Total Zakat Payable',
        resetForm: 'Clear Values',
      },
      calendar: {
        title: 'Hijri Calendar & Sacred Dates',
        subtitle: 'Current Islamic lunar date, all 12 Hijri months, and notable annual observances in English and Bengali.',
        todayHijri: 'Hijri Date',
        todayGregorian: 'Gregorian Date',
        sacredDatesTitle: 'Notable Dates in the Islamic Year',
        hijriMonthsTitle: 'The Twelve Hijri Months',
      },
      bookmarks: {
        title: 'Saved Verses & Hadiths',
        empty: 'No saved bookmarks yet. Click Save on any Quran verse or Hadith to keep it here.',
        remove: 'Remove',
      },
    },
    footer: {
      tagline: 'Al-Mizan — Bilingual Quran, Hadith, Lexicon & Islamic Utilities in Bengali and English.',
      copyright: 'Designed for contemplative reading and accurate daily worship.',
      quickLinks: 'Sections',
    },
  },
  bn: {
    brandName: 'আল-মীযান',
    nav: {
      overview: 'মূলপাতা',
      quran: 'কুরআন',
      hadith: 'হাদীস',
      prayer: 'নামাজ',
      lexicon: 'শব্দকোষ',
      duas: 'দুআ',
      tools: 'টুলস',
    },
    switchLangLabel: 'English',
    theme: {
      light: 'আলো',
      dark: 'রাত',
    },
    utility: {
      nextPrayer: 'পরবর্তী',
      location: 'শহর',
      useGps: 'জিপিএস ব্যবহার',
      gpsActive: 'বর্তমান অবস্থান',
    },
    hero: {
      kicker: 'দ্বিভাষিক ইসলামিক জ্ঞানভাণ্ডার · বাংলা ও ইংরেজি',
      title: 'আল-মীযান: পবিত্র কুরআন ও সুন্নাহর আলোকবর্তিকা',
      subtitle:
        'বাংলা ও ইংরেজি অনুবাদসহ পবিত্র কুরআন পাঠ করুন, আরবি শব্দের মূল ও অর্থ জানুন দ্বিভাষিক শব্দকোষে, সহীহ হাদীস যাচাই করুন এবং নির্ভুল নামাজের সময়সূচী ও কিবলার দিক নির্ণয় করুন।',
      primaryCta: 'পবিত্র কুরআন পাঠ করুন',
      secondaryCta: 'ইসলামিক শব্দকোষ দেখুন',
      caption: 'চিত্র ১ — ঐতিহ্যবাহী ইসলামি স্থাপত্য ও জ্যামিতিক আলোকছায়া',
    },
    overview: {
      prayerStripTitle: 'দৈনিক নামাজের সময়সূচী',
      nextBadge: 'পরবর্তী',
      dailyVerseKicker: 'আজকের কুরআনিক অনুধ্যান',
      dailyVerseTitle: 'সূরা আল-ইনশিরাহ · আয়াত ৫–৬',
      openInReader: 'কুরআন পাঠকে খুলুন',
      manuscriptCaption: 'চিত্র ২ — কাঠের রেহালে সংরক্ষিত প্রাচীন কুরআনের পাণ্ডুলিপি',
      wordOfDayKicker: 'আজকের নির্বাচিত শব্দ · বাংলা ও ইংরেজি',
      exploreLexicon: 'সম্পূর্ণ শব্দকোষ দেখুন',
      gatewaysTitle: 'গবেষণা ও দৈনন্দিন ইবাদত সহায়ক',
      gatewaysSubtitle: 'ইসলামিক মৌলিক জ্ঞান ও ইবাদতের সকল প্রয়োজনীয় উপকরণ বাংলা ও ইংরেজিতে সুবিন্যস্ত।',
      gatewayHadithTitle: 'সহীহ হাদীস সংকলন',
      gatewayHadithDesc: 'বুখারী ও মুসলিম থেকে যাচাইকৃত হাদীস, মূল আরবি, সনদ এবং বাংলা-ইংরেজি অনুবাদসহ।',
      gatewayDuasTitle: 'মাসনূন দুআ ও যিকির',
      gatewayDuasDesc: 'হিসনুল মুসলিম থেকে দৈনন্দিন দুআ—বাংলা উচ্চারণ, অর্থ ও গণনা বাটনসহ।',
      gatewayQiblaTitle: 'নামাজের সময় ও কিবলা',
      gatewayQiblaDesc: 'হানাফী ও শাফেয়ী পদ্ধতিতে নামাজের সময়সূচী এবং জ্যোতির্বৈজ্ঞানিক কিবলা কম্পাস।',
      gatewayToolsTitle: 'তাসবীহ, যাকাত ও ৯৯ নাম',
      gatewayToolsDesc: 'ডিজিটাল তাসবীহ কাউন্টার, আসমাউল হুসনা, নিসাব ভিত্তিক যাকাত ক্যালকুলেটর ও হিজরি ক্যালেন্ডার।',
    },
    quran: {
      title: 'আল-কুরআনুল কারীম',
      subtitle: '১১৪টি সূরার পূর্ণাঙ্গ তালিকা—আরবি উসমানী লিপি, বাংলা ও ইংরেজি অনুবাদ, তিলাওয়াত অডিও এবং শব্দভিত্তিক মূল বিশ্লেষণ।',
      searchPlaceholder: 'সূরার নাম বা নম্বর লিখে খুঁজুন (যেমন: রাহমান, Rahman, 55)...',
      allSurahs: 'সকল ১১৪টি',
      makki: 'মাক্কী',
      madani: 'মাদানী',
      ayahsLabel: 'আয়াত',
      arabicSize: 'আরবি ফন্ট',
      showTranslit: 'উচ্চারণ',
      showBengali: 'বাংলা অনুবাদ',
      showEnglish: 'ইংরেজি অনুবাদ',
      wordByWord: 'শব্দ বিশ্লেষণ',
      rootLabel: 'মূল শব্দ',
      playAudio: 'তিলাওয়াত শুনুন',
      pauseAudio: 'বিরতি দিন',
      loadingSurah: 'আরবি, বাংলা ও ইংরেজি অনুবাদসহ সূরা লোড হচ্ছে...',
      fetchError: 'অনলাইন কুরআন আর্কাইভে সংযোগ করা যায়নি। সংরক্ষিত সূরাগুলো অফলাইনেই পড়া যাবে।',
      retry: 'আবার চেষ্টা করুন',
      bookmark: 'সংরক্ষণ',
      bookmarked: 'সংরক্ষিত',
      copy: 'কপি',
      copied: 'কপি হয়েছে',
      bismillahNote: 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।',
      tafsirLabel: 'সংক্ষিপ্ত তাফসীর',
    },
    hadith: {
      title: 'সহীহ হাদীস আর্কাইভ',
      subtitle: 'মূল আরবি পাঠ, রাবির বর্ণনা এবং বাংলা ও ইংরেজি অনুবাদসহ নির্বাচিত সহীহ হাদীস সংকলন।',
      searchPlaceholder: 'বাংলা, ইংরেজি বা রাবির নামে হাদীস খুঁজুন...',
      allCategories: 'সকল বিষয়',
      categories: {
        intention: 'নিয়ত ও ইখলাস',
        character: 'চরিত্র ও আখলাক',
        worship: 'ইবাদত',
        knowledge: 'জ্ঞান অর্জন',
        charity: 'দান ও সদকা',
        mercy: 'দয়া ও অনুগ্রহ',
      },
      narratedBy: 'বর্ণনাকারী',
      source: 'গ্রন্থ',
      grade: 'মান',
      noResults: 'আপনার অনুসন্ধানের সাথে কোনো হাদীস পাওয়া যায়নি।',
    },
    lexicon: {
      title: 'দ্বিভাষিক ইসলামিক শব্দকোষ',
      subtitle: 'কুরআন ও হাদীসের গুরুত্বপূর্ণ আরবি পরিভাষাসমূহের ত্রি-অক্ষর মূল, বাংলা উচ্চারণ ও ইংরেজি-বাংলা ব্যাখ্যা।',
      searchPlaceholder: 'আরবি, বাংলা বা ইংরেজি শব্দ খুঁজুন (যেমন: তাকওয়া, Taqwa, সবর)...',
      allCategories: 'সকল পরিভাষা',
      categories: {
        faith: 'ঈমান ও অন্তর',
        worship: 'ইবাদত',
        ethics: 'নৈতিকতা ও আখলাক',
        community: 'সমাজ ও বিধান',
      },
      rootLabel: 'আরবি মূল',
      pronunciationLabel: 'বাংলা উচ্চারণ',
      bengaliMeaning: 'বাংলা অর্থ',
      englishMeaning: 'ইংরেজি অর্থ',
      scholarlyNuance: 'তাৎপর্য ও বিশ্লেষণ',
      referenceLabel: 'তথ্যসূত্র',
      noResults: 'কোনো মিল খুঁজে পাওয়া যায়নি।',
    },
    duas: {
      title: 'মাসনূন দুআ ও দৈনন্দিন যিকির',
      subtitle: 'হিসনুল মুসলিম থেকে প্রামাণ্য দুআ—আরবি পাঠ, বাংলা উচ্চারণ, ইংরেজি অনুবাদ এবং গণনা কাউন্টার।',
      allCategories: 'সকল বিভাগ',
      categories: {
        morning_evening: 'সকাল ও সন্ধ্যার যিকির',
        salah: 'নামাজ ও মসজিদ',
        knowledge: 'জ্ঞান ও হিদায়াত',
        forgiveness: 'ক্ষমা ও তাওবাহ',
        protection: 'নিরাপত্তা ও প্রশান্তি',
        family: 'মাতা-পিতা ও পরিবার',
      },
      pronunciationBnLabel: 'বাংলা উচ্চারণ',
      transliterationEnLabel: 'ইংরেজি উচ্চারণ',
      countProgress: 'পাঠ সংখ্যা',
      resetCount: 'রিসেট',
      completed: 'সম্পন্ন',
    },
    prayer: {
      title: 'নামাজের সময়সূচী ও কিবলা কম্পাস',
      subtitle: 'সূর্যের অবস্থান ও ভৌগোলিক স্থানাঙ্কের ভিত্তিতে নিখুঁতভাবে গণনাকৃত দৈনিক নামাজের সময়সূচী।',
      cityLabel: 'শহর নির্বাচন',
      methodLabel: 'হিসাব পদ্ধতি',
      asrLabel: 'আসরের মাজহাব',
      asrHanafi: 'হানাফী (দ্বিগুণ ছায়া)',
      asrShafi: 'শাফেয়ী / স্ট্যান্ডার্ড (একগুণ ছায়া)',
      methods: {
        karachi: 'ইসলামিক ইউনিভার্সিটি, করাচি (বাংলাদেশ ও দক্ষিণ এশিয়া)',
        isna: 'ইসলামিক সোসাইটি অব নর্থ আমেরিকা (ISNA)',
        mwl: 'মুসলিম ওয়ার্ল্ড লিগ (MWL)',
        makkah: 'উম্মুল কুরা বিশ্ববিদ্যালয়, মক্কা',
      },
      suhoorEnds: 'সাহরির শেষ সময় (ফজর)',
      tahajjudStarts: 'রাতের শেষ তৃতীয়াংশ (তাহাজ্জুদ)',
      qiblaTitle: 'নিখুঁত কিবলা অ্যাস্ট্রোল্যাব',
      qiblaSubtitle: 'মক্কা আল-মুকাররমার পবিত্র কাবা শরীফের প্রকৃত ভৌগোলিক দিক ও দূরত্ব।',
      bearingLabel: 'কিবলার কোণ',
      distanceLabel: 'কাবার দূরত্ব',
      kaabaLabel: 'কাবা শরীফ',
      enableCompass: 'লাইভ কম্পাস চালু করুন',
      compassActive: 'লাইভ কম্পাস সক্রিয়',
      compassUnsupported: 'ডেস্কটপে কম্পাস সেন্সর নেই; ডায়ালটি উত্তর দিক (০°) থেকে প্রকৃত কিবলা কোণ দেখাচ্ছে।',
      astrolabeCaption: 'চিত্র ৩ — জ্যোতির্বৈজ্ঞানিক দিক নির্ণয়ের ঐতিহ্যবাহী পিতলের অ্যাস্ট্রোল্যাব',
    },
    tools: {
      title: 'প্রয়োজনীয় ইসলামিক টুলস',
      subtitle: 'দৈনন্দিন যিকির, যাকাত হিসাব, হিজরি বর্ষপঞ্জি ও আল্লাহর ৯৯ নামের অর্থ জানার আধুনিক মাধ্যম।',
      tabs: {
        tasbih: 'ডিজিটাল তাসবীহ',
        names: '৯৯ নাম',
        zakat: 'যাকাত হিসাব',
        calendar: 'হিজরি ক্যালেন্ডার',
        bookmarks: 'সংরক্ষিত',
      },
      tasbih: {
        selectDhikr: 'যিকির নির্বাচন করুন',
        targetLabel: 'লক্ষ্য সংখ্যা',
        unlimited: 'অসীম',
        tapToCount: 'গণনা করুন',
        reset: 'পুনরায় শুরু',
        totalSession: 'মোট গণনা',
        soundOn: 'শব্দ চালু',
        soundOff: 'শব্দ বন্ধ',
      },
      names: {
        title: 'আল-আসমাউল হুসনা — আল্লাহর ৯৯টি গুণবাচক নাম',
        searchPlaceholder: 'নম্বর, বাংলা বা ইংরেজি অর্থ দিয়ে খুঁজুন...',
        noResults: 'কোনো নাম খুঁজে পাওয়া যায়নি।',
      },
      zakat: {
        title: 'বার্ষিক যাকাত ক্যালকুলেটর (২.৫%)',
        subtitle: 'নিসাবের বর্তমান মানদণ্ড অনুযায়ী টাকা, ডলার, পাউন্ড বা ইউরোতে আপনার যাকাত হিসাব করুন।',
        currencyLabel: 'মুদ্রা',
        nisabStandard: 'নিসাবের মানদণ্ড',
        silverNisab: 'রূপা (৬১২.৩৬ গ্রাম / ৫২.৫ ভরি — অগ্রাধিকারযোগ্য)',
        goldNisab: 'স্বর্ণ (৮৭.৪৮ গ্রাম / ৭.৫ ভরি)',
        cashLabel: 'নগদ অর্থ ও ব্যাংক জমা',
        goldValueLabel: 'স্বর্ণের বর্তমান মূল্য',
        silverValueLabel: 'রূপার বর্তমান মূল্য',
        investmentsLabel: 'শেয়ার, বিনিয়োগ ও পাওনা টাকা',
        businessLabel: 'ব্যবসায়িক পণ্যের মূল্য',
        debtsLabel: 'স্বল্পমেয়াদী ঋণ ও দেনা (বিয়োগযোগ্য)',
        netZakatable: 'নিট যাকাতযোগ্য সম্পদ',
        nisabThreshold: 'নিসাবের সীমা',
        statusEligible: 'নিসাব পূর্ণ হয়েছে — যাকাত ফরজ (২.৫%)',
        statusBelow: 'নিসাবের নিচে — যাকাত ফরজ নয়',
        zakatPayable: 'মোট প্রদেয় যাকাত',
        resetForm: 'তথ্য মুছুন',
      },
      calendar: {
        title: 'হিজরি ক্যালেন্ডার ও পবিত্র দিবসসমূহ',
        subtitle: 'আজকের হিজরি তারিখ, বারোটি আরবি মাসের পরিচিতি এবং ইসলামিক গুরুত্বপূর্ণ দিবসসমূহ।',
        todayHijri: 'হিজরি তারিখ',
        todayGregorian: 'ইংরেজি তারিখ',
        sacredDatesTitle: 'ইসলামিক বছরের গুরুত্বপূর্ণ দিবসসমূহ',
        hijriMonthsTitle: 'বারোটি হিজরি মাস',
      },
      bookmarks: {
        title: 'সংরক্ষিত আয়াত ও হাদীস',
        empty: 'এখনো কোনো আয়াত বা হাদীস সংরক্ষণ করা হয়নি। যেকোনো আয়াত বা হাদীসে "সংরক্ষণ" বোতামে ক্লিক করুন।',
        remove: 'মুছুন',
      },
    },
    footer: {
      tagline: 'আল-মীযান — বাংলা ও ইংরেজি ভাষায় পবিত্র কুরআন, হাদীস, শব্দকোষ এবং ইবাদত সহায়ক পোর্টাল।',
      copyright: 'নির্মল পাঠ ও সহীহ ইবাদতের জন্য নিবেদিত।',
      quickLinks: 'বিভাগসমূহ',
    },
  },
};
