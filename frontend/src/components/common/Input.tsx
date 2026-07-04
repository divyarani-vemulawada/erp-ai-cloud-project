type InputProps = {
  type?: string;
  placeholder: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
};

function Input({
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  disabled = false,
  className = '',
  min,
  max,
}: InputProps) {
  const baseClass = 'input';
  const finalClassName = className ? `${baseClass} ${className}` : baseClass;

  return (
    <input
      className={finalClassName}
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
}

export default Input;
