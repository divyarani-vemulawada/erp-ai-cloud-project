type ButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'danger';
};

function Button({
  text,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
}: ButtonProps) {
  return (
    <button
      className={variant === 'danger' ? 'btn btn-danger' : 'btn'}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
}

export default Button;
