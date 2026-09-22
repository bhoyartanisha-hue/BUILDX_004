import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Role } from "@/data/types";
const DemoRoleContext=createContext<{role:Role;setRole:(role:Role)=>void}|undefined>(undefined);
// Demo-only role switching intentionally avoids impersonating production authentication.
export function DemoRoleProvider({children}:{children:ReactNode}){const [role,setRole]=useState<Role>("citizen");const value=useMemo(()=>({role,setRole}),[role]);return <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>}
export function useDemoRole(){const value=useContext(DemoRoleContext);if(!value)throw new Error("useDemoRole must be used within DemoRoleProvider");return value}
