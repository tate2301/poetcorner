export default function VerticalDivider(props: { height: number }) {
  return (
    <div
      className="w-px bg-[var(--gray-400)]"
      style={{
        height: props.height,
      }}
    />
  );
}
