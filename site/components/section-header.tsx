export function SectionHeader({ index, title, caption }: { index: string; title: string; caption: string }) {
  return (
    <div className="mo-section-header">
      <span className="mo-section-index">{index}</span>
      <h2 className="mo-section-title">{title}</h2>
      <span className="mo-section-caption">{caption}</span>
    </div>
  );
}
