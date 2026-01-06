export default function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <p className="text-sm font-medium text-neutral-900">{title}</p>}
          {subtitle && <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}