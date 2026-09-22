import { useMemo } from "react";
import { clusters } from "@/data/seed";
export function useClusters(){return useMemo(()=>clusters,[])}
