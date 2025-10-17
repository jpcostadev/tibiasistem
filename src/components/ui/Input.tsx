import React, { useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  size?: "small" | "medium" | "large";
  variant?: "default" | "filled" | "outlined";
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  step?: number;
  min?: number;
  max?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  disabled = false,
  required = false,
  error,
  success,
  helperText,
  icon,
  iconPosition = "left",
  size = "medium",
  variant = "default",
  fullWidth = false,
  className = "",
  inputClassName = "",
  labelClassName = "",
  name,
  id,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  readOnly = false,
  step,
  min,
  max,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputId =
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputType = () => {
    if (type === "password" && showPassword) {
      return "text";
    }
    return type;
  };

  const containerClasses = [
    styles.inputContainer,
    fullWidth ? styles.fullWidth : "",
    disabled ? styles.disabled : "",
    error ? styles.error : "",
    success ? styles.success : "",
    isFocused ? styles.focused : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    styles.input,
    styles[variant],
    styles[size],
    icon && iconPosition === "left" ? styles.withLeftIcon : "",
    icon && iconPosition === "right" ? styles.withRightIcon : "",
    type === "password" ? styles.withPasswordToggle : "",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClasses = [
    styles.label,
    required ? styles.required : "",
    disabled ? styles.disabled : "",
    labelClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className={styles.requiredAsterisk}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {icon && iconPosition === "left" && (
          <div className={styles.iconLeft}>{icon}</div>
        )}

        <input
          id={inputId}
          name={name}
          type={getInputType()}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          readOnly={readOnly}
          step={step}
          min={min}
          max={max}
          className={inputClasses}
        />

        {type === "password" && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        )}

        {icon && iconPosition === "right" && type !== "password" && (
          <div className={styles.iconRight}>{icon}</div>
        )}
      </div>

      {(error || success || helperText) && (
        <div className={styles.messageContainer}>
          {error && <span className={styles.errorMessage}>{error}</span>}
          {success && <span className={styles.successMessage}>{success}</span>}
          {helperText && !error && !success && (
            <span className={styles.helperText}>{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
