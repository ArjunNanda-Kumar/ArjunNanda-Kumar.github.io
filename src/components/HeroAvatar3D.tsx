import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
interface ScanMeshProps {
  imageUrl: string;
  mode: "scan" | "hybrid";
}
function DepthPortrait({ imageUrl, mode }: ScanMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);
  const [scanData, setScanData] = useState<{
    positions: Float32Array;
    colors: Float32Array;
  } | null>(null);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const cols = 130;
      const rows = 160;
      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, cols, rows);
      const imgData = ctx.getImageData(0, 0, cols, rows).data;
      const posList: number[] = [];
      const colList: number[] = [];
      const widthWorld = 2.5;
      const heightWorld = 3.08;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = (y * cols + x) * 4;
          const r = imgData[idx] / 255;
          const g = imgData[idx + 1] / 255;
          const b = imgData[idx + 2] / 255;
          const a = imgData[idx + 3] / 255;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          // Skip transparent or near-black background pixels
          if (a < 0.2 || lum < 0.04) continue;
          const px = (x / cols - 0.5) * widthWorld;
          const py = (0.5 - y / rows) * heightWorld;
          // Extrude depth in 3D based on pixel luminance + subtle spherical curvature
          const distFromCenter = Math.hypot(px * 0.6, py * 0.5);
          const dome = Math.max(0, 0.28 - distFromCenter * 0.18);
          const pz = lum * 0.42 + dome;
          posList.push(px, py, pz);
          if (mode === "scan") {
            // Precision LiDAR teal/cyan palette weighted by luminance
            colList.push(
              0.15 + lum * 0.45,
              0.55 + lum * 0.42,
              0.62 + lum * 0.35,
            );
          } else {
            // Hybrid natural + subtle cyan highlight
            colList.push(r * 0.85 + 0.08, g * 0.9 + 0.1, b * 0.9 + 0.12);
          }
        }
      }
      setScanData({
        positions: new Float32Array(posList),
        colors: new Float32Array(colList),
      });
    };
  }, [imageUrl, mode]);
  const geometry = useMemo(() => {
    if (!scanData) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(scanData.positions, 3),
    );
    geo.setAttribute("color", new THREE.BufferAttribute(scanData.colors, 3));
    return geo;
  }, [scanData]);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.28;
      const targetY = state.pointer.y * 0.18;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetX + Math.sin(t * 0.55) * 0.08,
        0.06,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -targetY * 0.5,
        0.06,
      );
    }
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(t * 0.9) * 1.35;
    }
  });
  return (
    <group ref={groupRef}>
      {/* Reference Coordinate Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.48, 0]}>
        <ringGeometry args={[1.05, 1.07, 64]} />
        <meshBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Moving Laser Scan Plane */}
      <mesh ref={scanLineRef} position={[0, 0, 0.22]}>
        <planeGeometry args={[2.55, 0.015]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.45} />
      </mesh>
      {/* 3D Point Cloud Portrait */}
      {geometry && (
        <points ref={pointsRef} geometry={geometry}>
          <pointsMaterial
            size={0.024}
            vertexColors
            transparent
            opacity={0.95}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
}
export default function HeroAvatar3D({
  imageSrc = "/images/profile.png",
}: {
  imageSrc?: string;
}) {
  const [viewMode, setViewMode] = useState<"scan" | "hybrid" | "optical">(
    "scan",
  );
  return (
    <div className="avatar-shell">
      <div className="avatar-hud-top">
        <span className="hud-dot" />
        <span className="hud-label">SENSOR // 3D DEPTH RECONSTRUCTION</span>
        <span className="hud-coords">Z-EXTRUSION: ACTIVE</span>
      </div>
      <div className="avatar-stage">
        {viewMode === "optical" ? (
          <div className="avatar-optical-wrap">
            <img
              src={imageSrc}
              alt="Arjun Nanda Kumar"
              className="avatar-optical-img"
            />
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 0, 3.35], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1} />
            <DepthPortrait imageUrl={imageSrc} mode={viewMode} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2 - 0.35}
              maxPolarAngle={Math.PI / 2 + 0.35}
              minAzimuthAngle={-0.5}
              maxAzimuthAngle={0.5}
            />
          </Canvas>
        )}
      </div>
      <div className="avatar-hud-bottom">
        <div className="hud-hint">
          {viewMode === "optical"
            ? "Optical Portrait"
            : "Drag or move cursor to inspect 3D depth"}
        </div>
        <div
          className="hud-switcher"
          role="group"
          aria-label="Portrait display mode"
        >
          <button
            type="button"
            className={`hud-btn ${viewMode === "scan" ? "active" : ""}`}
            onClick={() => setViewMode("scan")}
          >
            LiDAR 3D
          </button>
          <button
            type="button"
            className={`hud-btn ${viewMode === "hybrid" ? "active" : ""}`}
            onClick={() => setViewMode("hybrid")}
          >
            RGB-D 3D
          </button>
          <button
            type="button"
            className={`hud-btn ${viewMode === "optical" ? "active" : ""}`}
            onClick={() => setViewMode("optical")}
          >
            Photo
          </button>
        </div>
      </div>
    </div>
  );
}
