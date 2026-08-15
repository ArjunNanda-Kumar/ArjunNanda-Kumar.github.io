import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

interface ModelViewerProps {
  /** Path to a .glb or .gltf file, e.g. "/models/point-cloud-scan.glb" */
  src: string;
  height?: number;
}

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#5eead4" wireframe />
    </mesh>
  );
}

export default function ModelViewer({ src, height = 480 }: ModelViewerProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          color: "var(--text-dim)",
        }}
      >
        Could not load model at {src}
      </div>
    );
  }

  return (
    <div style={{ height, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 45 }}
        onError={() => setFailed(true)}
      >
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.6}>
            <Model src={src} />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.6} enableZoom enablePan />
      </Canvas>
    </div>
  );
}
