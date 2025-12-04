export default function Container({
  children,
  size = 'md',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`w-full mx-auto px-4 ${sizes[size]} ${className}`} {...props}>
      {children}
    </div>
  );
}

