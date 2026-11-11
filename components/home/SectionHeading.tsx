// Shared homepage section heading: a small uppercase label between thin
// lines, a serif title and an optional intro line.

export default function SectionHeading({
  label,
  title,
  intro,
  align = "center",
  light = false,
}: {
  label: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <div
        className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}
      >
        <span
          className={`h-px w-10 ${light ? "bg-white/50" : "bg-custom-accent/40"} ${
            centered ? "" : "hidden"
          }`}
        />
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
            light ? "text-white/80" : "text-custom-accent"
          }`}
        >
          {label}
        </p>
        <span
          className={`h-px w-10 ${light ? "bg-white/50" : "bg-custom-accent/40"}`}
        />
      </div>

      <h2
        className={`mt-4 font-display text-4xl font-semibold leading-[1.1] md:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>

      {intro ? (
        <p
          className={`mt-4 text-base leading-7 ${
            light ? "text-white/80" : "text-muted"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
