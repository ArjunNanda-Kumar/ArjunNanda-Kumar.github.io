import { motion } from "framer-motion";

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

export default function Journey() {
  return (
    <div className="journey-scroller">
      {stages.map((s, i) => (
        <motion.div
          key={s.num}
          className="jcard"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          whileHover={{ y: -6 }}
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
