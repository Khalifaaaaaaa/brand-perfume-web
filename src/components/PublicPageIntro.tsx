import React from "react";

interface PublicPageIntroProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function PublicPageIntro({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: PublicPageIntroProps) {
  const alignmentClassName = align === "center" ? "mx-auto text-center" : "text-left";
  const dividerClassName = align === "center" ? "mx-auto" : "";

  return (
    <header className={`${alignmentClassName} max-w-4xl ${className}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">{eyebrow}</p>

      <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] text-neutral-950 sm:text-5xl md:text-6xl">
        {title}
      </h1>

      {description ? (
        <div className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
          {description}
        </div>
      ) : null}

      <div className={`${dividerClassName} mt-12 h-px w-20 bg-neutral-950`} />
    </header>
  );
}