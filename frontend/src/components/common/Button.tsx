type ButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

function Button({
  text,
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      className="btn"
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text}
    </button>
  );
}

export default Button;