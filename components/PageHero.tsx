import Link from "next/link";

type Crumb = { href?: string; label: string };

// Shared page header used by the inner pages (cart, favorites, tracking,
// checkout, policies…): breadcrumb, small label, serif title, subtitle.
export default function PageHero({
  title,
  label,
  subtitle,
  crumbs = [],
  children,
}: {
  title: string;
  label?: string;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <nav className="text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-custom-accent">
            Home
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.label}>
              <span className="mx-2">/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-custom-accent">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-ink">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            {label ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-custom-accent">
                {label}
              </p>
            ) : null}

            <h1
              className={`font-display text-5xl font-semibold leading-none text-ink md:text-6xl ${
                label ? "mt-3" : ""
              }`}
            >
              {title}
            </h1>

            {subtitle ? <p className="mt-3 text-sm text-muted">{subtitle}</p> : null}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
