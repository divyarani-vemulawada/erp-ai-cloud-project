type ButtonProps = {
  text: string;
};
function Button({
  text
}: ButtonProps) {

  const onClick = () => {
    alert("Button clicked");
  };

  return (
    <button className='btn' onClick={onClick}>
      {text}
    </button>
  );
}
export default Button;