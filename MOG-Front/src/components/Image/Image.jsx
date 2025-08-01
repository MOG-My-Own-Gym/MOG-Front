export default function Image({ className, src }) {
  return <img className={className} src={`/img/${src}`} />;
}
