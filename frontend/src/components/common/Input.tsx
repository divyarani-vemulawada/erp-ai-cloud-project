type InputProps = {
  type: string;
  placeholder: string;
};
function Input({type,placeholder}: InputProps) {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
    />
  );
}
export default Input;