import './Badge.css';

export default function Badge({ status, text, className = '' }) {
  // status: 'success', 'warning', 'error', or custom string to map
  let styleType = 'default';
  
  const textLower = (text || status).toLowerCase();
  if (textLower.includes('success') || status === 'success') styleType = 'success';
  if (textLower.includes('retry') || status === 'warning') styleType = 'warning';
  if (textLower.includes('fail') || status === 'error') {
    styleType = 'error';
  }

  return (
    <span className={`badge badge-${styleType} ${className}`}>
      {text || status}
    </span>
  );
}
