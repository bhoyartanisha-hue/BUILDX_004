import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "@/data/types";

interface LanguageValue { language: Language; setLanguage: (language: Language) => void }
const LanguageContext = createContext<LanguageValue | undefined>(undefined);
export function LanguageProvider({children}:{children:ReactNode}) {
  const [language,setLanguageState] = useState<Language>("en");
  const { i18n } = useTranslation();
  useEffect(()=>{ const saved=window.localStorage.getItem("anvaya-language") as Language | null; if(saved && ["en","hi","mr"].includes(saved)) setLanguageState(saved); },[]);
  useEffect(()=>{ void i18n.changeLanguage(language); document.documentElement.lang=language; document.documentElement.dataset.script=language === "en" ? "latin" : "devanagari"; window.localStorage.setItem("anvaya-language",language); },[language,i18n]);
  const value=useMemo(()=>({language,setLanguage:setLanguageState}),[language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){ const value=useContext(LanguageContext); if(!value) throw new Error("useLanguage must be used within LanguageProvider"); return value; }
