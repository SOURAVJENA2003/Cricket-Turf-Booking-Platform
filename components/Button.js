import styles from './Button.module.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props 
}) {
  const baseClass = `${styles.button} ${styles[variant]} ${styles[size]}`;
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={finalClass}
      {...props}
    >
      {children}
    </button>
  );
}
