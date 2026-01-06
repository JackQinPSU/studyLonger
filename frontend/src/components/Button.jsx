export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="h-10 rounded-md bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="h-10 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
    >
      {children}
    </button>
  );
}