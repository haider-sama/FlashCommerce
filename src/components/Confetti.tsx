import React, { useState, useEffect, useRef } from 'react';

const SHAPES = ['square', 'triangle'];
const COLOR_DIGIT = 'ABCDEF1234567890';

const Confetti = () => {
  const [isConfettiActive, setConfettiActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isConfettiActive) {
      generateConfetti();
    }
  }, [isConfettiActive]);

  useEffect(() => {
    // Trigger confetti on component mount
    setConfettiActive(true);
    return () => {
      // Clean up
      setConfettiActive(false);
    };
  }, []);

  const generateRandomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += COLOR_DIGIT[Math.floor(Math.random() * COLOR_DIGIT.length)];
    }
    return color;
  };

  const generateConfetti = () => {
    const container = containerRef.current;
    if (container) {
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const positionX = Math.random() * window.innerWidth;
        const positionY = Math.random() * window.innerHeight;
        const rotation = Math.random() * 360;
        const size = Math.floor(Math.random() * (20 - 5 + 1)) + 5;

        confetti.style.left = `${positionX}px`;
        confetti.style.top = `${positionY}px`;
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.className = 'confetti ' + SHAPES[Math.floor(Math.random() * SHAPES.length)];
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = generateRandomColor();

        container.appendChild(confetti);

        setTimeout(() => {
          container.removeChild(confetti);
        }, 4000);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none" ref={containerRef} id="confetti-container"></div>
  );
};

export default Confetti;
