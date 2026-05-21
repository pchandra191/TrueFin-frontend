import { useEffect } from "react";
import { useSEO, type SEOConfig } from "./SEOProvider";

export interface SEOProps extends SEOConfig {
  children?: never;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  canonical, 
  robots,
  og,
  twitter,
  schema 
}: SEOProps) {
  const { setSEO } = useSEO();

  useEffect(() => {
    setSEO({
      title,
      description,
      keywords,
      canonical,
      robots,
      og,
      twitter,
      schema,
    });
  }, [title, description, keywords, canonical, robots, og, twitter, schema, setSEO]);

  return null;
}

export function PageSEO({
  title,
  description,
  keywords,
  canonical,
  robots,
  breadcrumbs,
  image,
}: {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
  image?: string;
}) {
  const { setSEO } = useSEO();

  useEffect(() => {
    const schema: Record<string, unknown>[] = [];

    if (breadcrumbs && breadcrumbs.length > 0) {
      schema.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.item,
        })),
      });
    }

    setSEO({
      title,
      description,
      keywords,
      canonical,
      robots,
      og: {
        title,
        description,
        image,
      },
      twitter: {
        title,
        description,
        image,
      },
      schema,
    });
  }, [title, description, keywords, canonical, robots, breadcrumbs, image, setSEO]);

  return null;
}