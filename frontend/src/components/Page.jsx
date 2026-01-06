export default function Page({ title, description, children }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
        <div className="mt-8 grid gap-6">{children}</div>
      </div>
    </div>
  );
}