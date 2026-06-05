import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🐕</div>
        <h1
          className="text-6xl text-white mb-4"
          style={{ fontFamily: 'var(--font-permanent-marker)' }}
        >
          404
        </h1>
        <p
          className="text-2xl mb-2"
          style={{
            fontFamily: 'var(--font-permanent-marker)',
            background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Page Not Found
        </p>
        <p className="text-white/50 mb-8">Even Naka Go couldn&apos;t find this one.</p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 rounded-full text-white font-bold"
          style={{
            fontFamily: 'var(--font-permanent-marker)',
            background: 'linear-gradient(135deg, #FF4D00, #FF0000)',
            boxShadow: '0 0 20px rgba(255,77,0,0.5)',
          }}
        >
          Go Home 🏠
        </Link>
      </div>
    </div>
  );
}
