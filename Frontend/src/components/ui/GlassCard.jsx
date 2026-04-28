import './GlassCard.css'; // Import styles for glassmorphism effect

// Reusable GlassCard component
export default function GlassCard({
  children,        // Content inside the card
  className = '',  // अतिरिक्त custom CSS classes (optional)
  noHover = false, // Disable hover effect if true
  title            // Optional title for the card
}) {

  // Decide base class depending on hover behavior
  const baseClass = noHover ? 'glass-panel-no-hover' : 'glass-panel';

  return (
    // Combine base class + wrapper + custom classes
    <div className={`${baseClass} glass-card-wrapper ${className}`}>

      {/* Render title only if provided */}
      {title && <h3 className="glass-card-title">{title}</h3>}

      {/* Render child components/content inside the card */}
      {children}

    </div>
  );
}