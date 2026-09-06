// Centralized Multilingual Translation Service for PART 15

export type SupportedLanguage = 'en' | 'hi' | 'bn';

export interface TranslationDictionary {
  // Navigation & Modules
  'nav.dashboard': string;
  'nav.projects': string;
  'nav.gis': string;
  'nav.workflow': string;
  'nav.documents': string;
  'nav.field_verification': string;
  'nav.compensation_rr': string;
  'nav.alerts': string;
  'nav.ai_intelligence': string;
  'nav.reports_mis': string;
  'nav.executive_dashboard': string;
  'nav.administration': string;

  // Citizen Portal Navigation
  'citizen.dashboard': string;
  'citizen.myland': string;
  'citizen.acquisition': string;
  'citizen.compensation': string;
  'citizen.rnr': string;
  'citizen.documents': string;
  'citizen.notifications': string;
  'citizen.gis': string;
  'citizen.grievance': string;
  'citizen.profile': string;

  // Header & Tools
  'header.portal_title': string;
  'header.citizen_title': string;
  'header.search_placeholder': string;
  'header.digital_twin_quick': string;
  'header.role': string;
  'header.state': string;
  'header.district': string;
  'header.logout': string;
  'header.notifications': string;
  'header.language': string;

  // Executive Dashboard Macro KPIs
  'kpi.active_projects': string;
  'kpi.land_proposed': string;
  'kpi.land_acquired': string;
  'kpi.compensation': string;
  'kpi.rr_progress': string;
  'kpi.possession': string;
  'kpi.high_risk': string;

  // Common Actions
  'action.view': string;
  'action.edit': string;
  'action.approve': string;
  'action.submit': string;
  'action.generate': string;
  'action.export_csv': string;
  'action.print': string;
  'action.filter': string;
  'action.search': string;
  'action.back': string;
  'action.cancel': string;
  'action.save': string;

  // Administration & Scalability
  'admin.config_title': string;
  'admin.states_districts': string;
  'admin.workflow_stages': string;
  'admin.notification_templates': string;
  'admin.validation_rules': string;
}

const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    // Navigation & Modules
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.gis': 'GIS Intelligence',
    'nav.workflow': 'Acquisition Workflow',
    'nav.documents': 'Documents',
    'nav.field_verification': 'Field Verification',
    'nav.compensation_rr': 'Compensation & R&R',
    'nav.alerts': 'Alerts',
    'nav.ai_intelligence': 'AI Intelligence',
    'nav.reports_mis': 'Reports & MIS',
    'nav.executive_dashboard': 'Executive Dashboard',
    'nav.administration': 'Administration',

    // Citizen Portal Navigation
    'citizen.dashboard': 'Dashboard',
    'citizen.myland': 'My Land',
    'citizen.acquisition': 'Acquisition Status',
    'citizen.compensation': 'Compensation',
    'citizen.rnr': 'Rehabilitation & Resettlement',
    'citizen.documents': 'Documents',
    'citizen.notifications': 'Notifications',
    'citizen.gis': 'GIS Map',
    'citizen.grievance': 'Help & Grievance',
    'citizen.profile': 'My Profile',

    // Header & Tools
    'header.portal_title': 'National Land Acquisition Monitoring',
    'header.citizen_title': 'Citizen / Landowner Portal',
    'header.search_placeholder': 'Search Khasra (e.g. 125/2, 412/1)...',
    'header.digital_twin_quick': 'Digital Twin: K-125/2',
    'header.role': 'Role',
    'header.state': 'State',
    'header.district': 'District',
    'header.logout': 'Logout',
    'header.notifications': 'Notifications',
    'header.language': 'Language',

    // Executive Dashboard Macro KPIs
    'kpi.active_projects': 'Active Projects',
    'kpi.land_proposed': 'Land Proposed',
    'kpi.land_acquired': 'Land Acquired',
    'kpi.compensation': 'Compensation',
    'kpi.rr_progress': 'R&R Progress',
    'kpi.possession': 'Possession',
    'kpi.high_risk': 'High Risk',

    // Common Actions
    'action.view': 'View',
    'action.edit': 'Edit',
    'action.approve': 'Approve',
    'action.submit': 'Submit',
    'action.generate': 'Generate Report',
    'action.export_csv': 'Export CSV',
    'action.print': 'Print',
    'action.filter': 'Filter',
    'action.search': 'Search',
    'action.back': 'Back',
    'action.cancel': 'Cancel',
    'action.save': 'Save Configuration',

    // Administration & Scalability
    'admin.config_title': 'Platform Configuration & Scalability',
    'admin.states_districts': 'States & Districts',
    'admin.workflow_stages': 'Workflow Stages (Data-Driven)',
    'admin.notification_templates': 'Notification Templates',
    'admin.validation_rules': 'Rules & Statuses'
  },
  hi: {
    // Navigation & Modules
    'nav.dashboard': 'डैशबोर्ड',
    'nav.projects': 'परियोजनाएं',
    'nav.gis': 'जीआईएस भू-स्थानिक',
    'nav.workflow': 'अधिग्रहण कार्यप्रवाह',
    'nav.documents': 'दस्तावेज़ भंडार',
    'nav.field_verification': 'क्षेत्रीय सत्यापन',
    'nav.compensation_rr': 'मुआवजा एवं पुनर्वास',
    'nav.alerts': 'सूचनाएं एवं अलर्ट',
    'nav.ai_intelligence': 'एआई जोखिम रडार',
    'nav.reports_mis': 'रिपोर्ट एवं एमआईएस',
    'nav.executive_dashboard': 'कार्यकारी डैशबोर्ड',
    'nav.administration': 'प्रशासन एवं विन्यास',

    // Citizen Portal Navigation
    'citizen.dashboard': 'डैशबोर्ड',
    'citizen.myland': 'मेरी भूमि',
    'citizen.acquisition': 'अधिग्रहण स्थिति',
    'citizen.compensation': 'मुआवजा',
    'citizen.rnr': 'पुनर्वास एवं पुनर्स्थापन',
    'citizen.documents': 'दस्तावेज़',
    'citizen.notifications': 'सूचनाएं',
    'citizen.gis': 'जीआईएस मानचित्र',
    'citizen.grievance': 'सहायता एवं शिकायत',
    'citizen.profile': 'मेरी प्रोफ़ाइल',

    // Header & Tools
    'header.portal_title': 'राष्ट्रीय भूमि अधिग्रहण निगरानी प्रणाली',
    'header.citizen_title': 'नागरिक / भूस्वामी पोर्टल',
    'header.search_placeholder': 'खसरा खोजें (उदा. 125/2, 412/1)...',
    'header.digital_twin_quick': 'डिजिटल ट्विन: K-125/2',
    'header.role': 'भूमिका',
    'header.state': 'राज्य',
    'header.district': 'जिला',
    'header.logout': 'लॉगआउट',
    'header.notifications': 'सूचनाएं',
    'header.language': 'भाषा',

    // Executive Dashboard Macro KPIs
    'kpi.active_projects': 'सक्रिय परियोजनाएं',
    'kpi.land_proposed': 'प्रस्तावित भूमि',
    'kpi.land_acquired': 'अधिग्रहीत भूमि',
    'kpi.compensation': 'मुआवजा वितरण',
    'kpi.rr_progress': 'पुनर्वास (R&R)',
    'kpi.possession': 'भौतिक कब्जा',
    'kpi.high_risk': 'उच्च जोखिम',

    // Common Actions
    'action.view': 'देखें',
    'action.edit': 'संपादित करें',
    'action.approve': 'स्वीकृत करें',
    'action.submit': 'जमा करें',
    'action.generate': 'रिपोर्ट बनाएं',
    'action.export_csv': 'सीएसवी निर्यात',
    'action.print': 'प्रिंट करें',
    'action.filter': 'फ़िल्टर',
    'action.search': 'खोजें',
    'action.back': 'वापस',
    'action.cancel': 'रद्द करें',
    'action.save': 'विन्यास सहेजें',

    // Administration & Scalability
    'admin.config_title': 'प्लेटफ़ॉर्म विन्यास एवं मापनीयता',
    'admin.states_districts': 'राज्य एवं जिले',
    'admin.workflow_stages': 'कार्यप्रवाह चरण (डेटा-संचालित)',
    'admin.notification_templates': 'अधिसूचना प्रारूप',
    'admin.validation_rules': 'नियम एवं स्थितियां'
  },
  bn: {
    // Navigation & Modules
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.projects': 'প্রকল্পসমূহ',
    'nav.gis': 'জিআইএস মানচিত্র',
    'nav.workflow': 'অধিগ্রহণ কার্যপ্রবাহ',
    'nav.documents': 'নথিপত্র ভান্ডার',
    'nav.field_verification': 'সরেজমিনে যাচাইকরণ',
    'nav.compensation_rr': 'ক্ষতিপূরণ ও পুনর্বাসন',
    'nav.alerts': 'সতর্কবার্তা ও বিজ্ঞপ্তি',
    'nav.ai_intelligence': 'এআই ঝুঁকি বিশ্লেষণ',
    'nav.reports_mis': 'প্রতিবেদন ও এমআইএস',
    'nav.executive_dashboard': 'কার্যনির্বাহী ড্যাশবোর্ড',
    'nav.administration': 'প্রশাসন ও সুরক্ষা',

    // Citizen Portal Navigation
    'citizen.dashboard': 'ড্যাশবোর্ড',
    'citizen.myland': 'আমার জমি',
    'citizen.acquisition': 'অধিগ্রহণ স্থিতি',
    'citizen.compensation': 'ক্ষতিপূরণ',
    'citizen.rnr': 'পুনর্বাসন ও পুনর্ব্যবস্থাপনা',
    'citizen.documents': 'নথিপত্র',
    'citizen.notifications': 'বিজ্ঞপ্তি',
    'citizen.gis': 'মানচিত্রে জমি দেখুন',
    'citizen.grievance': 'সাহায্য ও অভিযোগ',
    'citizen.profile': 'আমার প্রোফাইল',

    // Header & Tools
    'header.portal_title': 'জাতীয় ভূমি অধিগ্রহণ নজরদারি পোর্টাল',
    'header.citizen_title': 'নাগরিক ও জমির মালিক পোর্টাল',
    'header.search_placeholder': 'খতিয়ান / দাগ নং খুঁজুন (উদাঃ 125/2)...',
    'header.digital_twin_quick': 'ডিজিটাল টুইন: K-125/2',
    'header.role': 'পদবী / ভূমিকা',
    'header.state': 'রাজ্য',
    'header.district': 'জেলা',
    'header.logout': 'লগআউট',
    'header.notifications': 'বিজ্ঞপ্তিসমূহ',
    'header.language': 'ভাষা',

    // Executive Dashboard Macro KPIs
    'kpi.active_projects': 'চলতি প্রকল্প',
    'kpi.land_proposed': 'প্রস্তাবিত জমি',
    'kpi.land_acquired': 'অধিগৃহীত জমি',
    'kpi.compensation': 'ক্ষতিপূরণ বিতরণ',
    'kpi.rr_progress': 'পুনর্বাসন অগ্রগতি',
    'kpi.possession': 'দখল প্রাপ্তি',
    'kpi.high_risk': 'উচ্চ ঝুঁকিযুক্ত',

    // Common Actions
    'action.view': 'দেখুন',
    'action.edit': 'সম্পাদনা',
    'action.approve': 'অনুমোদন',
    'action.submit': 'জমা দিন',
    'action.generate': 'প্রতিবেদন তৈরি',
    'action.export_csv': 'সিএসভি ডাউনলোড',
    'action.print': 'প্রিন্ট',
    'action.filter': 'ফিল্টার',
    'action.search': 'অনুসন্ধান',
    'action.back': 'ফিরে যান',
    'action.cancel': 'বাতিল',
    'action.save': 'সংরক্ষণ করুন',

    // Administration & Scalability
    'admin.config_title': 'প্ল্যাটফর্ম কনফিগারেশন ও স্কেলাবিলিটি',
    'admin.states_districts': 'রাজ্য ও জেলাসমূহ',
    'admin.workflow_stages': 'অধিগ্রহণ ধাপসমূহ',
    'admin.notification_templates': 'বিজ্ঞপ্তি টেমপ্লেট',
    'admin.validation_rules': 'যাচাইকরণ নিয়মাবলী'
  }
};

const LANG_STORAGE_KEY = 'BHUNETRA_LANGUAGE';

class I18nService {
  private currentLanguage: SupportedLanguage = 'en';
  private listeners: ((lang: SupportedLanguage) => void)[] = [];

  constructor() {
    this.restoreLanguage();
  }

  private restoreLanguage() {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage | null;
      if (stored === 'en' || stored === 'hi' || stored === 'bn') {
        this.currentLanguage = stored;
      }
    } catch {
      this.currentLanguage = 'en';
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public setLanguage(lang: SupportedLanguage) {
    if (this.currentLanguage === lang) return;
    this.currentLanguage = lang;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save language to localStorage', e);
    }
    this.notifyListeners();
  }

  public subscribe(listener: (lang: SupportedLanguage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentLanguage));
  }

  public t(key: keyof TranslationDictionary, fallback?: string): string {
    const dict = translations[this.currentLanguage];
    return dict[key] || fallback || key;
  }

  public getSupportedLanguages(): { code: SupportedLanguage; label: string; nativeLabel: string }[] {
    return [
      { code: 'en', label: 'English', nativeLabel: 'English' },
      { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
      { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' }
    ];
  }
}

export const i18n = new I18nService();

