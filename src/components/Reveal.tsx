import React from "react";
import { motion } from "framer-motion";
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
