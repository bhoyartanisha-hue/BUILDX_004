import { createContext, useContext } from 'react';
import type { Lang, Screen } from './types';

export interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  screen: Screen;
  focus: string | undefined;
  go: (s: Screen, focus?: string) => void;
  receiptId: string | undefined;
  openReceipt: (id: string) => void;
}

export const AppCtx = createContext<AppState | undefined>(undefined);

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error('App context missing');
  return v;
}
