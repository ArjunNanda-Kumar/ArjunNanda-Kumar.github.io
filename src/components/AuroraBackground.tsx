import React, { useEffect, useRef } from "react";
export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let scrollY = window.scrollY;
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    let t = 0;
    const render = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);
      // Subtle scroll-shifted technical grid
      const gridSize = 64;
      const offsetY = -(scrollY * 0.25) % gridSize;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // Soft ambient engineering glow that shifts gently with scroll
      const glowY = height * 0.28 + Math.sin(t + scrollY * 0.0015) * 90;
      const glowX = width * 0.72 + Math.cos(t * 0.7) * 70;
      const grad1 = ctx.createRadialGradient(
        glowX,
        glowY,
        20,
        glowX,
        glowY,
        540,
      );
      grad1.addColorStop(0, "rgba(94, 234, 212, 0.065)");
      grad1.addColorStop(0.5, "rgba(56, 189, 248, 0.025)");
      grad1.addColorStop(1, "rgba(8, 9, 11, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);
      const glow2Y = height * 0.75 - Math.cos(t * 0.8 + scrollY * 0.001) * 80;
      const glow2X = width * 0.22;
      const grad2 = ctx.createRadialGradient(
        glow2X,
        glow2Y,
        20,
        glow2X,
        glow2Y,
        460,
      );
      grad2.addColorStop(0, "rgba(56, 189, 248, 0.045)");
      grad2.addColorStop(1, "rgba(8, 9, 11, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);
      animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
