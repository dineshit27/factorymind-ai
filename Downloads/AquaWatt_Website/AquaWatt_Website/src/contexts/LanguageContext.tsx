
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

// Available languages
export const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "hi", name: "हिन्दी" }
];

type LanguageContextType = {
  language: string;
  setLanguage: (code: string) => void;
  translate: (key: string) => string;
};

const translations: Record<string, Record<string, string>> = {
  en: {
    // Dashboard
    "dashboard": "Dashboard",
    "search": "Search",
    "search_initiated": "Search initiated",
    "searching_for": "Searching for",
    "language_changed": "Language changed",
    "interface_language_set_to": "Interface language set to",
    
    // Devices
    "devices": "Devices",
    "bedroom_electricity": "Bedroom Electricity",
    "bedroom_water": "Bedroom Water",
    "kitchen_electricity": "Kitchen Electricity",
    "kitchen_water": "Kitchen Water",
    "hall_electricity": "Hall Electricity",
    "hall_water": "Hall Water",
    "on": "On",
    "off": "Off",
    "device_activated": "Device Activated",
    "device_deactivated": "Device Deactivated",
    "is_now": "is now",
    
    // Common
    "apply_filters": "Apply Filters",
    "water_usage": "Water Usage",
    "electricity": "Electricity",
    "kitchen": "Kitchen",
    "bedroom": "Bedroom",
    "advanced_filters": "Advanced Filters",
    "filter_options": "Filter Options",
    
    // Sidebar
    "home": "Home",
    "billing": "Billing",
    "analytics": "Analytics",
    "about": "About"
  },
  es: {
    // Dashboard
    "dashboard": "Panel Principal",
    "search": "Buscar",
    "search_initiated": "Búsqueda iniciada",
    "searching_for": "Buscando por",
    "language_changed": "Idioma cambiado",
    "interface_language_set_to": "Idioma de interfaz establecido a",
    
    // Devices
    "devices": "Dispositivos",
    "bedroom_electricity": "Electricidad del Dormitorio",
    "bedroom_water": "Agua del Dormitorio",
    "kitchen_electricity": "Electricidad de la Cocina",
    "kitchen_water": "Agua de la Cocina",
    "hall_electricity": "Electricidad de la Sala",
    "hall_water": "Agua de la Sala",
    "on": "Encendido",
    "off": "Apagado",
    "device_activated": "Dispositivo Activado",
    "device_deactivated": "Dispositivo Desactivado",
    "is_now": "está ahora",
    
    // Common
    "apply_filters": "Aplicar Filtros",
    "water_usage": "Uso de Agua",
    "electricity": "Electricidad",
    "kitchen": "Cocina",
    "bedroom": "Dormitorio",
    "advanced_filters": "Filtros Avanzados",
    "filter_options": "Opciones de Filtro",
    
    // Sidebar
    "home": "Inicio",
    "billing": "Facturación",
    "analytics": "Análisis",
    "about": "Acerca de"
  },
  hi: {
    // Dashboard
    "dashboard": "डैशबोर्ड",
    "search": "खोज",
    "search_initiated": "खोज शुरू की गई",
    "searching_for": "के लिए खोज रहे हैं",
    "language_changed": "भाषा बदली गई",
    "interface_language_set_to": "इंटरफेस भाषा सेट है",
    
    // Devices
    "devices": "उपकरण",
    "bedroom_electricity": "बेडरूम बिजली",
    "bedroom_water": "बेडरूम पानी",
    "kitchen_electricity": "रसोई बिजली",
    "kitchen_water": "रसोई पानी",
    "hall_electricity": "हॉल बिजली",
    "hall_water": "हॉल पानी",
    "on": "चालू",
    "off": "बंद",
    "device_activated": "उपकरण सक्रिय",
    "device_deactivated": "उपकरण निष्क्रिय",
    "is_now": "अब है",
    
    // Common
    "apply_filters": "फिल्टर लागू करें",
    "water_usage": "पानी का उपयोग",
    "electricity": "बिजली",
    "kitchen": "रसोई",
    "bedroom": "बेडरूम",
    "advanced_filters": "उन्नत फिल्टर",
    "filter_options": "फिल्टर विकल्प",
    
    // Sidebar
    "home": "होम",
    "billing": "बिलिंग",
    "analytics": "विश्लेषण",
    "about": "के बारे में"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  translate: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (code: string) => {
    setLanguageState(code);
    
    // Get language name for toast
    const langName = languages.find(lang => lang.code === code)?.name || code;
    
    toast({
      title: translations[code]?.language_changed || "Language changed",
      description: `${translations[code]?.interface_language_set_to || "Interface language set to"} ${langName}`,
    });
  };

  const translate = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
