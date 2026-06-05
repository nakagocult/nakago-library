'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface GradientButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline';
}

export default function GradientButton({
  children,
  href,
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  variant = 'primary',
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  const baseClasses = `
    relative overflow-hidden
    font-handwritten font-bold
    rounded-full cursor-pointer
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${className}
  `;

  const primaryClasses = `
    bg-gradient-to-r from-[#FF4D00] to-[#FF0000]
    text-white
    shadow-[0_0_20px_rgba(255,77,0,0.6)]
    hover:shadow-[0_0_30px_rgba(255,77,0,0.8)]
  `;

  const outlineClasses = `
    bg-transparent
    border-2 border-[#FF4D00]
    text-[#FF4D00]
    hover:bg-[#FF4D00] hover:text-white
  `;

  const classes = `${baseClasses} ${variant === 'primary' ? primaryClasses : outlineClasses}`;

  const content = (
    <motion.span
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={classes}
      onClick={disabled ? undefined : onClick}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.span
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
