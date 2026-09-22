import { useMemo } from "react";
import { complaints } from "@/data/seed";
export function useComplaints(){return useMemo(()=>complaints,[])}
