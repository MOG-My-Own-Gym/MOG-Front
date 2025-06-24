export default function Toast({ content }) {
  return (
    <div
      style={{
        width: '500px',
        height: '500px',
        backgroundColor: 'black',
        position: 'fixed',
        color: 'white',
      }}
    >
      {content}
    </div>
  );
}
