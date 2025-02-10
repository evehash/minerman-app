import type { ValidationResult } from "@/utils/validation";
import { useEffect, useState } from "react";

type FieldError = { error: false } | { error: true; message: string };

interface FieldState {
  value: string;
  error: FieldError;
  submittedValue?: string;
  assistiveText?: string;
}

interface R extends FieldState {
  handleBlur(): void;
  handleChange(newValue: string): void;
  setValue(value: string): void;
  handleSubmit(): void;
  handleFocus(): void;
}

type Validator = (value: string) => ValidationResult;

interface Params {
  initialValue?: string | (() => Promise<string | null | undefined>);
  autoSubmit?: boolean;
  onFocus?(value: string): void;
  onBlur?(value: string): void;
  onSubmit?(value: string): void;
  onValidate?: Validator | Validator[];
}

const noError: FieldError = { error: false };

function useFormField({ initialValue, autoSubmit = false, onBlur, onFocus, onSubmit, onValidate }: Params): R {
  const [defaultValue, setDefaultValue] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState<FieldError>(noError);
  const [submittedValue, setSubmittedValue] = useState<string>();

  useEffect(() => {
    if (initialValue === undefined) return;
    const resolveInitialValue = async (): Promise<void> => {
      if (typeof initialValue === "function") {
        const result = (initialValue as () => Promise<string | null | undefined>)();
        const resolved = await result;
        setDefaultValue(resolved ?? "");
        setValue(resolved ?? "");
      } else {
        setDefaultValue(initialValue);
        setValue(initialValue);
      }
    };
    resolveInitialValue();
  }, []);

  const handleFocus = (): void => {
    onFocus?.(value);
  };

  const validate = (): ValidationResult => {
    if (onValidate === undefined) {
      return { valid: true };
    }

    if (typeof onValidate === "function") {
      const f = onValidate as (value: string) => ValidationResult;
      return f(value);
    }

    const m = onValidate as ((value: string) => ValidationResult)[];
    for (const n of m) {
      const result = n(value);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
    //return m.find((v) => !v(value).valid) ?? { valid: true };
  };

  const handleBlur = (): void => {
    console.log(value, submittedValue, initialValue);
    if (value === submittedValue || value === defaultValue) {
      onBlur?.(value);
      return;
    }

    const validationResult = validate();
    if (autoSubmit && validationResult.valid) {
      handleSubmit();
      onBlur?.(value);
      return;
    }

    if (!validationResult.valid) {
      //setValue(submittedValue ?? defaultValue);
      setError({ error: true, message: validationResult.reason });
    }
    onBlur?.(value);
  };

  const handleSubmit = (): void => {
    if (value === submittedValue || value === defaultValue) return;
    const validationResult = validate();
    if (!validationResult.valid) {
      setError({ error: true, message: validationResult.reason });
      return;
    }
    onSubmit?.(value);
    setSubmittedValue(value);
  };

  const handleChange = (newValue: string): void => {
    setError(noError);
    setValue(newValue);
  };

  return {
    value,
    error,
    submittedValue,
    handleBlur,
    handleChange,
    setValue,
    handleSubmit,
    handleFocus,
  };
}

export default useFormField;
