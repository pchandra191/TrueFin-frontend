import { useLocation } from "react-router-dom";

export function useCanonical(basePath?: string) {
  const location = useLocation();
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const path = basePath || location.pathname + location.search;
  
  return `${baseUrl}${path}`;
}

export function getCanonicalUrl(path: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}${path}`;
}

export function generateKeywords(primary: string, secondary: string[]): string {
  const base = ["TrueFin", "finance", "installment", "loan"];
  return [...base, primary, ...secondary].join(", ");
}