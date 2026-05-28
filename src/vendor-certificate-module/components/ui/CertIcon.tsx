interface CertIconProps {
  name: string;
  className?: string;
  size?: string;
}

export function CertIcon({ name, className, size = '2rem' }: CertIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ''}`.trim()}
      style={{ fontSize: size }}
      aria-hidden
    >
      {name}
    </span>
  );
}
