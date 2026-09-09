import React, { useEffect, useRef } from 'react';

// Characters: binary, hex, and cyber symbols
const CHARS = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ$%#@&*-+=[]{}<>_/'.split('');
const FONT_SIZE = 14;
const FRAME_MS = 1000 / 24; // Throttled: rain reads the same but costs a third of the frames

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Users who ask the OS to reduce motion get a still canvas
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let resizeTimer;
    let lastFrame = 0;
    let drops = [];

    // Size the canvas and rebuild the column tracker to match the new width
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const columns = Math.floor(canvas.width / FONT_SIZE) + 1;
      const next = Array(columns);
      for (let i = 0; i < columns; i++) {
        // Preserve in-flight drops so a resize does not restart the rain
        next[i] = drops[i] ?? Math.floor((Math.random() * canvas.height) / FONT_SIZE);
      }
      drops = next;

      ctx.font = `${FONT_SIZE}px monospace`;
    };
    resizeCanvas();

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener('resize', handleResize);

    const draw = (timestamp) => {
      animationFrameId = requestAnimationFrame(draw);

      if (timestamp - lastFrame < FRAME_MS) return;
      lastFrame = timestamp;

      // Semi-transparent background to create the trail effect
      ctx.fillStyle = 'rgba(6, 6, 10, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = CHARS[(Math.random() * CHARS.length) | 0];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // Occasional bright highlights to mimic code flow
        const roll = Math.random();
        if (roll > 0.97) {
          ctx.fillStyle = '#00ff66'; // Glowing Green
        } else if (roll > 0.95) {
          ctx.fillStyle = '#ff007f'; // Glowing Magenta
        } else {
          ctx.fillStyle = 'rgba(0, 240, 255, 0.25)'; // Glowing Cyan
        }

        ctx.fillText(text, x, y);

        // Reset drop to top once it hits bottom, or randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Stop burning frames while the tab is in the background
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastFrame = 0;
        animationFrameId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        pointerEvents: 'none',
        opacity: 0.15, // Keep it subtle and professional, avoiding distraction
      }}
    />
  );
};

export default MatrixBackground;
