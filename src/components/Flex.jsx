export default function Flex({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap = 'md',
  wrap = false,
  className = '',
  ...props
}) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';

  return (
    <div 
      className={`
        flex
        ${directionClasses[direction]}
        ${alignClasses[align]}
        ${justifyClasses[justify]}
        ${gapClasses[gap]}
        ${wrapClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

