import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Characters: binary, hex, and cyber symbols
    const chars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ$%#@&*-+=[]{}<>_/';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    
    // Drops tracking y position
    const drops = Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black background to create trail effect
      ctx.fillStyle = 'rgba(6, 6, 10, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Low contrast neon cyan / green for trailing lines
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)'; // Primary drop trail is Cyan
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw character
        // Occasional bright green highlights to mimic code flow
        if (Math.random() > 0.97) {
          ctx.fillStyle = '#00ff66'; // Glowing Green
        } else if (Math.random() > 0.95) {
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
      
      animationFrameId = requestAnimationFrame(draw);
    };

    // Start rendering loop
    draw();

    // Clean up event listener and animation frame
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
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
