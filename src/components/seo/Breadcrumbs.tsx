import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

export function Breadcrumbs({ 
  items, 
  className = "" 
}: { 
  items: BreadcrumbItem[];
  className?: string;
}) {
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className={`breadcrumb ${className}`}>
      <ol className="breadcrumb-list">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={`${item.name}-${index}`} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.href || "/"} className="breadcrumb-link">
                  {item.name}
                </Link>
              )}
              {!isLast && <span className="breadcrumb-separator">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function useBreadcrumbs(items: BreadcrumbItem[]) {
  return {
    breadcrumbs: [{ name: "Home", href: "/" }, ...items],
    schemaBreadcrumbs: [{ name: "Home", item: "/" }, ...items.map(i => ({
      name: i.name,
      item: typeof window !== "undefined" ? `${window.location.origin}${i.href || "/"}` : "",
    }))],
  };
}