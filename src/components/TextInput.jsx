export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  type = 'text',
  maxLength,
  className = '',
  ...props
}) {
  const inputClasses = `
    w-full
    px-4 py-2
    text-base
    border-2
    rounded-lg
    transition-colors duration-200
    focus:outline-none
    ${error 
      ? 'border-red-500 focus:border-red-600 focus:ring-red-500' 
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    disabled:opacity-60
    ${className}
  `;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={inputClasses}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  );
}

