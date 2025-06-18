import React, { useEffect, useState } from 'react';

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Array<{ id: number; left: string; delay: string; size: string; opacity: string }>>([]);

  useEffect(() => {
    const heartArray = [];
    for (let i = 0; i < 20; i++) {
      heartArray.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 15}s`,
        size: `${10 + Math.random() * 20}px`,
        opacity: `${0.2 + Math.random() * 0.3}`
      });
    }
    setHearts(heartArray);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float text-pink-400 dark:text-pink-300"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            fontSize: heart.size,
            opacity: heart.opacity
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;