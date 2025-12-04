export default function Card({
  children,
  className = '',
  padding = 'md',
  border = true,
  shadow = true,
  rounded = 'lg',
  hoverable = false,
  ...props
}) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
  };

  const shadowClasses = shadow ? 'shadow-md hover:shadow-lg' : '';
  const borderClasses = border ? 'border border-gray-200' : '';
  const hoverClasses = hoverable ? 'hover:scale-105 cursor-pointer' : '';

  const finalClassName = `
    bg-white
    ${paddingClasses[padding]}
    ${roundedClasses[rounded]}
    ${shadowClasses}
    ${borderClasses}
    transition-all duration-200
    ${hoverClasses}
    ${className}
  `;

  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  );
}

