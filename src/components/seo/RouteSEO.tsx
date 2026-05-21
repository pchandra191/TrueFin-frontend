import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteSEO({ 
  title, 
  description, 
  canonical,
  noindex = false,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; item: string }>;
}) {
  const location = useLocation();
  
  useEffect(() => {
    document.title = title.includes("TrueFin") ? title : `${title} | TrueFin`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description || "TrueFin helps manage installments, borrowers, collections, financial tracking and reports efficiently.");
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonical || window.location.href);
    
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", noindex ? "noindex, nofollow" : "index, follow");
    
    updateOpenGraph(title, description);
    
    if (breadcrumbs && breadcrumbs.length > 0) {
      updateBreadcrumbSchema(breadcrumbs);
    }
  }, [title, description, canonical, noindex, breadcrumbs, location.pathname]);

  return null;
}

function updateOpenGraph(title: string, description?: string) {
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", description || "");
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", window.location.href);
}

function updateBreadcrumbSchema(breadcrumbs: Array<{ name: string; item: string }>) {
  const existing = document.getElementById("breadcrumb-schema");
  if (existing) existing.remove();
  
  const script = document.createElement("script");
  script.id = "breadcrumb-schema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.name,
      "item": b.item,
    })),
  });
  document.head.appendChild(script);
}