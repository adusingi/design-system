export function SectionHeader({
  namespace,
  title,
  caption,
}: {
  /** The package or token namespace this section documents, e.g. "@mobayilo/themes". */
  namespace: string;
  title: string;
  caption?: string;
}) {
  return (
    <div className="mo-section-header">
      <span className="mo-section-namespace">{namespace}</span>
      <h2 className="mo-section-title">{title}</h2>
      {caption ? <span className="mo-section-caption">{caption}</span> : null}
    </div>
  );
}
