import { useId } from 'react';

/** Label + control + error message, wired together for screen readers. */
export default function FormField({ label, required, error, hint, children }) {
  const id = useId();
  const errorId = `${id}-error`;
  const child = children({
    id,
    required,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? errorId : undefined,
  });
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {child}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </div>
  );
}
