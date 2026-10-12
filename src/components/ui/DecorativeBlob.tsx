interface DecorativeBlobProps {
  color?: 'teal' | 'lens';
  className?: string;
}

export function DecorativeBlob({ color = 'teal', className = '' }: DecorativeBlobProps) {
  // Използваме новите сини нюанси
  const fill = color === 'teal' ? '#235B9C' : '#3B82F6';

  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <svg width="400" height="400" viewBox="0 0 400 400" className="blur-3xl opacity-[0.15]">
        <circle cx="200" cy="200" r="200" fill={fill} />
      </svg>
    </div>
  );
}