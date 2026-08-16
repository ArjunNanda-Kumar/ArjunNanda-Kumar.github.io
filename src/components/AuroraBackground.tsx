import { useEffect, useRef } from "react";

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf: number;
    let t = 0;

    const waves = [
      { amp: 60, freq: 0.0018, speed: 0.6, color: "94,234,212", offset: 0.25 },
      { amp: 80, freq: 0.0012, speed: 0.4, color: "56,189,248", offset: 0.55 },
      { amp: 50, freq: 0.0024, speed: 0.8, color: "167,139,250", offset: 0.8 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 1;
      const scrollShift = scrollRef.current * 0.5;

      waves.forEach((w) => {
        ctx.beginPath();
        const baseY = height * w.offset;
        for (let x = 0; x <= width; x += 8) {
          const y =
            baseY +
            Math.sin(x * w.freq + t * 0.008 * w.speed + scrollShift * 0.01) * w.amp +
            Math.sin(x * w.freq * 2.3 - t * 0.005 * w.speed) * (w.amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, baseY - w.amp, 0, height);
        grad.addColorStop(0, `rgba(${w.color}, 0.10)`);
        grad.addColorStop(1, `rgba(${w.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
