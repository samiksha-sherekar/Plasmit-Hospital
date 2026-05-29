"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

function formatSegment(segment: string) {
  return decodeURIComponent(segment)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildBreadcrumbs(pathname: string, title: string) {
  const segments = pathname.split("/").filter(Boolean);
  const visibleSegments = segments.length > 1 ? segments.slice(1) : segments;

  return visibleSegments.map((segment, index) => {
    const realIndex = segments.length > 1 ? index + 1 : index;
    const previousPath = `/${segments.slice(0, realIndex).join("/")}`;
    const realHref = `/${segments.slice(0, realIndex + 1).join("/")}`;
    const previousNavItem = navigationItems.find((item) => item.route === previousPath);
    const navItem = navigationItems.find((item) => item.route === realHref);
    const isLast = index === visibleSegments.length - 1;

    return {
      href: realHref,
      label: isLast ? title : navItem?.label ?? (index === 0 ? previousNavItem?.label : undefined) ?? formatSegment(segment),
      isLast,
    };
  });
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  metrics,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  metrics?: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname, title);
  const breadcrumbNav = (
    <nav className="flex min-w-0 items-center justify-end gap-1 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
      <Link className="inline-flex items-center gap-1 rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring" href="/dashboard">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {breadcrumbs.map((breadcrumb) => (
        <span className="flex min-w-0 items-center gap-1" key={breadcrumb.href}>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          {breadcrumb.isLast ? (
            <span className="truncate text-foreground" aria-current="page">
              {breadcrumb.label}
            </span>
          ) : (
            <Link className="truncate rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring" href={breadcrumb.href}>
              {breadcrumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );

  return (
    <div className={cn("-mx-4 border-b border-border bg-background px-4 py-3 md:-mx-6 md:px-6", className)}>
      {actions ? <div className="mb-2">{breadcrumbNav}</div> : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          {eyebrow ? <div className="mb-1 text-xs font-medium text-muted-foreground">{eyebrow}</div> : null}
          <div className={cn("min-w-0", !actions && "flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between")}>
            <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            {!actions ? <div className="min-w-0 lg:ml-auto">{breadcrumbNav}</div> : null}
          </div>
          {/* <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p> */}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {metrics ? <div className="mt-3">{metrics}</div> : null}
    </div>
  );
}
