import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    cat: "lab",
    tag: "HORC Lab",
    title: "Perception on Agility Digit",
    desc: "Working on the perception and sensing layer for the lab's Agility Digit humanoid — the sensing a bipedal robot needs to understand and move through its environment.",
    meta: ["Agility Digit", "Perception", "ROS2"],
  },
  {
    cat: "lab",
    tag: "HORC Lab",
    title: "Diagnosing a lidar streaming bottleneck",
    desc: "Traced why a ROS2 node streaming lidar and camera data over TCP/WebSockets was frame-rate capped. Found the state machine only advanced one step per timer tick, flagged a small receive buffer and ack-based flow-control risk, and proposed a restructured drain-loop fix, catching two bugs along the way.",
    meta: ["ROS2", "Networking"],
  },
  {
    cat: "lab",
    tag: "HORC Lab",
    title: "Soft robotic hand exoskeleton — summary",
    desc: "Condensed a full academic report on soft robotic hand exoskeletons for stroke rehabilitation into a two-page brief for the team.",
    meta: ["Rehab robotics", "Technical writing"],
  },
  {
    cat: "robotics",
    tag: "Robotics course",
    title: "IMU data pipeline on a Raspberry Pi",
    desc: "Full sensor-to-analysis pipeline on an assigned Pi Zero 2W with an IMU, over SSH. Wrote tilt_calculator.py, a ROS2 node processing live IMU data, and collected 6-channel IMU data to CSV, plotted with matplotlib and pandas.",
    meta: ["ROS2 Jazzy", "Python"],
  },
  {
    cat: "robotics",
    tag: "Robotics course",
    title: "ROS2 foundations, from zero",
    desc: "Started with no terminal or Linux experience and worked through nodes, topics, pub/sub, and DDS hands-on in Ubuntu, then drove Turtlesim live via ros2 topic pub through a Docker + WSL2 setup.",
    meta: ["ROS2 Humble", "Linux"],
  },
  {
    cat: "making",
    tag: "Making",
    title: "3D printing workflow",
    desc: "Print planning and slicing in Bambu Studio on a dual-GPU laptop. Traced a blank 3D viewport back to the wrong GPU being used and fixed it via Windows graphics settings.",
    meta: ["Bambu Studio", "Hardware"],
  },
];

const filters = [
  { key: "all", label: "All" },
  { key: "lab", label: "Lab / Digit" },
  { key: "robotics", label: "Robotics" },
  { key: "making", label: "Making" },
];

export default function WorkGrid() {
  const [active, setActive] = useState("all");
  const visible = items.filter((i) => active === "all" || i.cat === active);

  return (
    <div>
      <div className="filters">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${active === f.key ? "active" : ""}`}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="work-grid">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => (
            <motion.div
              key={item.title}
              className="wcard"
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <span className="cat-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="meta">
                {item.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
        .filter-btn {
          font-family: monospace;
          font-size: 12px;
          padding: 9px 16px;
          border-radius: 100px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }
        .filter-btn:hover:not(.active) { border-color: var(--accent); color: var(--text); }
        .work-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 760px) { .work-grid { grid-template-columns: 1fr; } }
        .wcard { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
        .wcard .cat-tag {
          font-family: monospace;
          font-size: 11px;
          color: var(--accent);
          background: rgba(94, 234, 212, 0.08);
          display: inline-block;
          padding: 4px 10px;
          border-radius: 100px;
          margin-bottom: 16px;
        }
        .wcard h3 { font-size: 19px; margin-bottom: 10px; color: var(--text); }
        .wcard p { font-size: 14px; }
        .wcard .meta { margin-top: 18px; display: flex; gap: 8px; flex-wrap: wrap; }
        .wcard .meta span {
          font-size: 11px;
          font-family: monospace;
          color: var(--text-dim);
          border: 1px solid var(--border);
          padding: 3px 9px;
          border-radius: 100px;
        }
      `}</style>
    </div>
  );
}
