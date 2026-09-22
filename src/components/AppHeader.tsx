import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useDemoRole } from "@/context/DemoRoleContext";
import type { Language, Role } from "@/data/types";

const nav=[{to:"/",key:"home"},{to:"/file",key:"file"},{to:"/track",key:"track"},{to:"/infrastructure",key:"infra"},{to:"/official",key:"official"},{to:"/assets",key:"assets"}] as const;
export function AppHeader(){
  const {t}=useTranslation(); const {language,setLanguage}=useLanguage(); const {role,setRole}=useDemoRole(); const [open,setOpen]=useState(false); const pathname=useRouterState({select:s=>s.location.pathname});
  return <header className="sticky top-0 z-50 border-b border-header-line bg-ink/95 text-line backdrop-blur">
    <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chamber">
        <span className="relative grid size-8 place-items-center border border-chamber font-mono text-xs font-semibold"><span className="absolute -right-1 top-1/2 h-px w-2 bg-chamber"/>अ</span>
        <span className="font-semibold tracking-normal">ANVAYA</span>
      </Link>
      <nav className="ml-4 hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
        {nav.map(item=><Link key={item.to} to={item.to} className={`px-3 py-2 text-sm transition-colors hover:text-chamber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chamber ${pathname===item.to?"text-chamber":"text-line/75"}`}>{t(`nav.${item.key}`)}</Link>)}
      </nav>
      <div className="ml-auto hidden items-center gap-3 sm:flex">
        <div className="flex border border-header-line" aria-label="Language selector">{(["en","hi","mr"] as Language[]).map(lang=><Button key={lang} variant="ghost" size="sm" onClick={()=>setLanguage(lang)} aria-pressed={language===lang} className={`rounded-none px-2 ${language===lang?"bg-chamber text-ink hover:bg-chamber/90":"text-line hover:bg-line/10 hover:text-line"}`}>{lang==="en"?"EN":lang==="hi"?"हिं": "मर"}</Button>)}</div>
        <label className="sr-only" htmlFor="role-select">{t("role")}</label>
        <select id="role-select" value={role} onChange={event=>setRole(event.target.value as Role)} className="h-8 border border-header-line bg-ink px-2 text-xs text-line focus:outline-none focus:ring-2 focus:ring-chamber" aria-label={`${t("role")}: ${t(role)}`}>
          <option value="citizen">{t("citizen")}</option><option value="official">{t("official")}</option><option value="contractor">{t("contractor")}</option>
        </select>
      </div>
      <Button variant="ghost" size="icon" onClick={()=>setOpen(value=>!value)} className="ml-auto text-line hover:bg-line/10 hover:text-line xl:hidden" aria-label="Toggle navigation">{open?<X/>:<Menu/>}</Button>
    </div>
    {open&&<div className="border-t border-header-line px-4 py-4 xl:hidden"><nav className="grid gap-1">{nav.map(item=><Link key={item.to} to={item.to} onClick={()=>setOpen(false)} className="border-l border-header-line px-3 py-2 text-sm text-line/80">{t(`nav.${item.key}`)}</Link>)}</nav><div className="mt-4 flex flex-wrap items-center gap-3 sm:hidden"><div className="flex border border-header-line">{(["en","hi","mr"] as Language[]).map(lang=><Button key={lang} variant="ghost" size="sm" onClick={()=>setLanguage(lang)} className="rounded-none text-line">{lang.toUpperCase()}</Button>)}</div><select value={role} onChange={event=>setRole(event.target.value as Role)} className="h-8 bg-ink text-xs text-line"><option value="citizen">{t("citizen")}</option><option value="official">{t("official")}</option><option value="contractor">{t("contractor")}</option></select></div></div>}
  </header>
}
