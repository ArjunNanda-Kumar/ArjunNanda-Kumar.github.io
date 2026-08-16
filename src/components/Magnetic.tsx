import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  cursorLabel?: string;
}

export default function Magnetic({ href, children, className = "", target, rel, cursorLabel }: MagneticProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={className}
      data-cursor={cursorLabel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform .15s ease-out", display: "inline-block" }}
    >
      {children}
    </a>
  );
}
