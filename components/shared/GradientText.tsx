interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'naka' | 'gold' | 'neon-cyan' | 'neon-pink';
}

export default function GradientText({ children, className = '', variant = 'naka' }: GradientTextProps) {
  const gradients = {
    naka: 'linear-gradient(135deg, #FF4D00 0%, #FF0000 100%)',
    gold: 'linear-gradient(135deg, #FF4D00 0%, #FF0000 50%, #FFD700 100%)',
    'neon-cyan': 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
    'neon-pink': 'linear-gradient(135deg, #FF0066 0%, #FF00FF 100%)',
  };

  return (
    <span
      className={className}
      style={{
        background: gradients[variant],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  );
}
