import { motion } from "framer-motion";
import { useRef, type MouseEvent } from "react";

const stages = [
  {
    num: "STAGE 01",
    title: "Mechanical engineering",
    desc: "Built a foundation in mechanical engineering — design, mechanisms, and how physical systems actually behave.",
  },
  {
    num: "STAGE 02",
    title: "Innovating & building",
    desc: "Moved from coursework into building — taking on innovation-driven projects rather than staying purely academic.",
  },
  {
    num: "STAGE 03",
    title: "EIR, IIT Palakkad",
    desc: "Worked as an Entrepreneur in Residence on assistive robotic tech, applying mechanical design thinking to real robotics problems.",
  },
  {
    num: "STAGE 04",
    title: "Robotics MS + HORC Lab",
    desc: "Now doing a robotics MS at UD, working on perception and sensing for the Agility Digit humanoid.",
  },
];

function onTilt(e: MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(600px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg) translateY(-6px)`;
}
function onTiltLeave(e: MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = "";
}

export default function Journey() {
  return (
    <div className="journey-scroller">
      {stages.map((s, i) => (
        <motion.div
          key={s.num}
          className="jcard tilt"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          onMouseMove={onTilt}
          onMouseLeave={onTiltLeave}
          data-cursor="drag"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="stage-num">{s.num}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          <div className="arrow">&rarr;</div>
        </motion.div>
      ))}

      <style>{`
        .journey-scroller {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 30px 4px 24px;
          margin-top: 8px;
          scroll-snap-type: x proximity;
        }
        .journey-scroller::-webkit-scrollbar { height: 5px; }
        .journey-scroller::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .jcard {
          flex: 0 0 300px;
          scroll-snap-align: start;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 26px;
          position: relative;
        }
        .jcard .stage-num {
          font-family: monospace;
          font-size: 13px;
          color: var(--accent);
          font-weight: 600;
        }
        .jcard h3 { font-size: 19px; margin: 12px 0 8px; }
        .jcard p { font-size: 14px; margin: 0; }
        .jcard .arrow { position: absolute; right: 22px; bottom: 22px; opacity: 0.3; font-size: 20px; }
      `}</style>
    </div>
  );
}
