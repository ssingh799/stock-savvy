import { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return;

    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, [role="button"], .card-hover, .cursor-pointer')) {
        isHovering.current = true;
      }
    };

    const handleOut = () => {
      isHovering.current = false;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    let raf: number;
    const TRAIL_COUNT = 5;

    const animate = () => {
      // Dot follows instantly
      pos.current.x += (mouse.current.x - pos.current.x) * 0.5;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.5;

      // Ring follows with delay
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }

      if (ringRef.current) {
        const scale = isHovering.current ? 1.8 : 1;
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${scale})`;
        ringRef.current.style.borderColor = isHovering.current
          ? 'hsl(152, 69%, 42%)'
          : 'hsl(43, 96%, 56%)';
      }

      // Trails
      trailsRef.current.forEach((trail, i) => {
        if (!trail) return;
        const delay = (i + 1) * 0.06;
        const tx = pos.current.x + (mouse.current.x - pos.current.x) * delay;
        const ty = pos.current.y + (mouse.current.y - pos.current.y) * delay;
        trail.style.transform = `translate(${tx - 3}px, ${ty - 3}px)`;
        trail.style.opacity = `${0.3 - i * 0.05}`;
      });

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Trail particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailsRef.current[i] = el; }}
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary/30"
          style={{ transition: 'opacity 0.3s' }}
        />
      ))}
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(152,69%,42%,0.6)]"
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-gold/60"
        style={{ transition: 'border-color 0.3s, transform 0.15s ease-out' }}
      />
    </div>
  );
};
