import styles from './Card.module.css';

export default function Card({ 
  children, 
  variant = 'default',
  interactive = false,
  onClick,
  className = '',
  ...props 
}) {
  const baseClass = `${styles.card} ${styles[variant]} ${interactive ? styles.interactive : ''}`;
  const finalClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <div 
      className={finalClass}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
