type CardProps = {
  title: string;
};

function Card({
  title
}: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
    </div>
  );
}

export default Card;