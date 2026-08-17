export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center" id={id}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
