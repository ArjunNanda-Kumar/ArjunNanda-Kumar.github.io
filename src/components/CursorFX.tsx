import { useEffect, useRef } from "react";

export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const isCoarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isCoarse) return;

    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const loop = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.18;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + "px";
        ringRef.current.style.top = pos.current.ry + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      ringRef.current?.classList.add("active");
      const label = el.dataset.cursor || "";
      const labelEl = ringRef.current?.querySelector(".label");
      if (labelEl) labelEl.textContent = label;
    };
    const onLeave = () => ringRef.current?.classList.remove("active");

    const targets = document.querySelectorAll("a, button, .tilt, [data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      if (progressRef.current) progressRef.current.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={progressRef} id="progress" />
      <div ref={dotRef} id="cursor-dot" />
      <div ref={ringRef} id="cursor-ring">
        <span className="label"></span>
      </div>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          body { cursor: none; }
        }
        #progress {
          position: fixed; top: 0; left: 0; height: 3px;
          background: var(--accent); width: 0%; z-index: 9998;
        }
        #cursor-dot, #cursor-ring {
          position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
          border-radius: 50%; transform: translate(-50%, -50%);
        }
        #cursor-dot { width: 6px; height: 6px; background: var(--accent); z-index: 10000; }
        #cursor-ring {
          width: 32px; height: 32px; border: 1px solid var(--accent); opacity: 0.4;
          transition: width .25s cubic-bezier(.2,.8,.2,1), height .25s cubic-bezier(.2,.8,.2,1), opacity .2s, background .2s;
          display: flex; align-items: center; justify-content: center;
        }
        #cursor-ring .label {
          font-size: 10px; color: var(--bg); opacity: 0; transform: scale(0.6);
          transition: opacity .2s, transform .2s; white-space: nowrap;
        }
        #cursor-ring.active {
          width: 64px; height: 64px; opacity: 0.95; background: var(--accent);
        }
        #cursor-ring.active .label { opacity: 1; transform: scale(1); }
        @media (hover: none), (pointer: coarse) {
          #cursor-dot, #cursor-ring, #progress { display: none; }
        }
      `}</style>
    </>
  );
}
