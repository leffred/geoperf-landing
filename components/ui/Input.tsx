import { ComponentProps, ReactNode, forwardRef } from "react";

type Props = ComponentProps<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, leadingIcon, className = "", ...rest },
  ref
) {
  const hasError = Boolean(error);
  const inputCls = [
    "w-full bg-white border rounded-md px-3.5 py-2.5 text-sm text-ink placeholder-ink-subtle",
    "transition-colors duration-150 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white",
    hasError
      ? "border-danger focus:ring-danger"
      : "border-DEFAULT hover:border-strong focus:border-brand-500 focus:ring-brand-500/30",
    leadingIcon ? "pl-9" : "",
    className,
  ].join(" ");

  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <span className="relative block">
        {leadingIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none">
            {leadingIcon}
          </span>
        )}
        <input ref={ref} className={inputCls} {...rest} />
      </span>
      {hint && !hasError && <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span>}
      {hasError && <span className="mt-1.5 block text-xs text-danger">{error}</span>}
    </label>
  );
});
