import { useMemo } from "react";
import { roadSegments } from "@/data/seed";
export function useRoadSegments(){return useMemo(()=>roadSegments,[])}
