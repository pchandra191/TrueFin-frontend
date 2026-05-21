import React, { createContext, useContext, useEffect } from "react";

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  noindex?: boolean;
  og?: {
    title?: string;
    description?: string;
    type?: string;
    image?: string;
    url?: string;
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  };
  schema?: Record<string, unknown>[];
}

interface SEOContextValue {
  setSEO: (config: SEOConfig) => void;
  seoData: SEOConfig;
}

const SEOContext = createContext<SEOContextValue>({
  setSEO: () => {},
  seoData: {},
});

const DEFAULTS = {
  title: "TrueFin",
  description: "TrueFin helps manage installments, borrowers, collections, financial tracking and reports efficiently.",
  keywords: "TrueFin, installment tracker, borrower management, microfinance, loan management, collections, financial tracking",
  siteName: "TrueFin",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
};

export function SEOProvider({ 
  children,
  initialConfig 
}: { 
  children: React.ReactNode;
  initialConfig?: SEOConfig;
}) {
  const [seoData, setSEOData] = React.useState<SEOContextValue["seoData"]>(initialConfig || {});

  useEffect(() => {
    const merged = { ...DEFAULTS, ...seoData };
    applySEO(merged);
  }, [seoData]);

  const setSEO = (config: SEOConfig) => {
    setSEOData(prev => ({ ...prev, ...config }));
  };

  return (
    <SEOContext.Provider value={{ setSEO, seoData }}>
      {children}
    </SEOContext.Provider>
  );
}

function applySEO(config: SEOConfig & typeof DEFAULTS) {
  const { title, description, keywords, canonical, robots, noindex, og, twitter, schema } = config;

  document.title = formatTitle(title || DEFAULTS.title);

  setMetaTag("description", description || DEFAULTS.description);
  setMetaTag("keywords", keywords || DEFAULTS.keywords);

  if (canonical) {
    setCanonical(canonical);
  } else {
    removeCanonical();
  }

  setMetaTag("robots", noindex ? "noindex, nofollow" : (robots || "index, follow"));

  const ogImage = og?.image || DEFAULTS.ogImage;
  setMetaTag("og:title", og?.title || title || DEFAULTS.title);
  setMetaTag("og:description", og?.description || description || DEFAULTS.description);
  setMetaTag("og:type", og?.type || "website");
  setMetaTag("og:image", ogImage);
  setMetaTag("og:url", og?.url || window.location.href);
  setMetaTag("og:site_name", og?.siteName || DEFAULTS.siteName);
  setMetaTag("og:locale", og?.locale || "en_US");

  setMetaTag("twitter:card", twitter?.card || DEFAULTS.twitterCard);
  setMetaTag("twitter:title", twitter?.title || title || DEFAULTS.title);
  setMetaTag("twitter:description", twitter?.description || description || DEFAULTS.description);
  setMetaTag("twitter:image", twitter?.image || ogImage);
  setMetaTag("twitter:creator", twitter?.creator || "@truefin");

  updateSchema(schema || getDefaultSchema(config));
}

function formatTitle(title: string | undefined): string {
  if (!title || title === DEFAULTS.title) return "TrueFin";
  return `${title} | TrueFin`;
}

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) || 
            document.querySelector(`meta[property="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      tag.setAttribute("property", name);
    } else {
      tag.setAttribute("name", name);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function removeCanonical() {
  const link = document.querySelector('link[rel="canonical"]');
  if (link) link.remove();
}

function updateSchema(schema: Record<string, unknown>[] | undefined) {
  const existing = document.getElementById("seo-schema");
  if (existing) existing.remove();

  if (!schema || schema.length === 0) return;

  const script = document.createElement("script");
  script.id = "seo-schema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema.length === 1 ? schema[0] : schema);
  document.head.appendChild(script);
}

function getDefaultSchema(config: SEOConfig & typeof DEFAULTS): Record<string, unknown>[] {
  const baseSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TrueFin",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": config.description || DEFAULTS.description,
  };

  const orgSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TrueFin",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
  };

  const websiteSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TrueFin",
    "url": window.location.origin,
  };

  return [orgSchema, websiteSchema, baseSchema];
}

export function useSEO() {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error("useSEO must be used within SEOProvider");
  }
  return context;
}