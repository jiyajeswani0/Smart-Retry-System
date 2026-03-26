import './GlassCard.css';

export default function GlassCard({ children, className = '', noHover = false, title }) {
  const baseClass = noHover ? 'glass-panel-no-hover' : 'glass-panel';
  return (
    <div className={`${baseClass} glass-card-wrapper ${className}`}>
      {title && <h3 className="glass-card-title">{title}</h3>}
      {children}
    </div>
  );
}
