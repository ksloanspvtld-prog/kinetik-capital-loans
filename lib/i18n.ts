// lib/i18n.ts – Multi-language Support

type Translations = {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
};

export const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", hi: "होम", mr: "मुख्यपृष्ठ" },
  "nav.products": { en: "Products & Offers", hi: "उत्पाद और ऑफर", mr: "उत्पादने आणि ऑफर" },
  "nav.tools": { en: "Tools & Calculators", hi: "टूल्स और कैलकुलेटर", mr: "साधने आणि कॅल्क्युलेटर" },
  "nav.cibil": { en: "CIBIL Score", hi: "CIBIL स्कोर", mr: "CIBIL स्कोर" },
  "nav.credit": { en: "Credit Cards", hi: "क्रेडिट कार्ड", mr: "क्रेडिट कार्ड" },
  "nav.partner": { en: "Become a Partner", hi: "पार्टनर बनें", mr: "पार्टनर व्हा" },
  "nav.login": { en: "Login", hi: "लॉगिन", mr: "लॉगिन" },
  "nav.logout": { en: "Logout", hi: "लॉगआउट", mr: "लॉगआउट" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },

  // Hero Section
  "hero.title": { en: "Compare Loan Offers from Top Banks & NBFCs", hi: "टॉप बैंकों और NBFCs से लोन ऑफर की तुलना करें", mr: "टॉप बँक आणि NBFC कडून कर्जाच्या ऑफरची तुलना करा" },
  "hero.subtitle": { en: "Get the best Personal, Home, Business and Car Loan offers", hi: "सर्वोत्तम व्यक्तिगत, होम, बिजनेस और कार लोन ऑफर प्राप्त करें", mr: "सर्वोत्तम वैयक्तिक, गृह, व्यवसाय आणि कार कर्ज ऑफर मिळवा" },
  "hero.apply": { en: "Apply Now", hi: "अभी आवेदन करें", mr: "आता अर्ज करा" },
  "hero.eligibility": { en: "Check Eligibility", hi: "पात्रता जांचें", mr: "पात्रता तपासा" },

  // Forms
  "form.fullName": { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  "form.mobile": { en: "Mobile Number", hi: "मोबाइल नंबर", mr: "मोबाइल क्रमांक" },
  "form.email": { en: "Email Address", hi: "ईमेल पता", mr: "ईमेल पत्ता" },
  "form.city": { en: "City", hi: "शहर", mr: "शहर" },
  "form.state": { en: "State", hi: "राज्य", mr: "राज्य" },
  "form.pincode": { en: "Pincode", hi: "पिनकोड", mr: "पिनकोड" },
  "form.loanType": { en: "Select Loan Type", hi: "लोन प्रकार चुनें", mr: "कर्ज प्रकार निवडा" },
  "form.income": { en: "Monthly Income", hi: "मासिक आय", mr: "मासिक उत्पन्न" },
  "form.submit": { en: "Get Loan Offers", hi: "लोन ऑफर पाएं", mr: "कर्ज ऑफर मिळवा" },

  // Status
  "status.new": { en: "New", hi: "नया", mr: "नवीन" },
  "status.contacted": { en: "Contacted", hi: "संपर्क किया", mr: "संपर्क केला" },
  "status.processing": { en: "Processing", hi: "प्रोसेसिंग", mr: "प्रक्रिया" },
  "status.approved": { en: "Approved", hi: "स्वीकृत", mr: "मंजूर" },
  "status.rejected": { en: "Rejected", hi: "अस्वीकृत", mr: "नाकारले" },

  // Common
  "common.hello": { en: "Hello", hi: "नमस्ते", mr: "नमस्कार" },
  "common.welcome": { en: "Welcome", hi: "स्वागत है", mr: "स्वागत आहे" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है...", mr: "लोड होत आहे..." },
  "common.error": { en: "Something went wrong", hi: "कुछ गलत हो गया", mr: "काहीतरी चुकले" },
};

export type Language = "en" | "hi" | "mr";

export function t(key: string, lang: Language = "en"): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return key;
}