import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SKIN = "#c08a60";
const SKIN_DARK = "#a9744d";
const HAIR = "#17141b";
const BEARD = "#2a2020";
const SWEATER = "#27324f";
const SWEATER_LIGHT = "#33406a";

const HEAD_SCALE: [number, number, number] = [0.92, 1.08, 0.95];

function Hair() {
  return (
    <group>
      {/* top cap, tilted back so the hairline sits above the eyebrows */}
      <group scale={HEAD_SCALE}>
        <mesh rotation={[-0.55, 0, 0]}>
          <sphereGeometry args={[0.845, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
          <meshStandardMaterial color={HAIR} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* hair volume above the forehead */}
      <mesh position={[0, 0.8, -0.05]} scale={[1.05, 0.62, 1.0]}>
        <sphereGeometry args={[0.66, 40, 28]} />
        <meshStandardMaterial color={HAIR} roughness={0.4} />
      </mesh>

      {/* long hair mass behind the head */}
      <mesh position={[0, -0.2, -0.38]} scale={[1.02, 1.3, 0.8]}>
        <sphereGeometry args={[0.8, 32, 24]} />
        <meshStandardMaterial color={HAIR} roughness={0.4} />
      </mesh>

      {/* wavy side locks framing the face, ears stay visible */}
      {[-1, 1].map((x) => (
        <group key={x}>
          <mesh position={[x * 0.8, 0.28, -0.12]} scale={[0.9, 1.1, 1]}>
            <sphereGeometry args={[0.2, 20, 16]} />
            <meshStandardMaterial color={HAIR} roughness={0.4} />
          </mesh>
          <mesh position={[x * 0.84, -0.08, -0.22]}>
            <sphereGeometry args={[0.2, 20, 16]} />
            <meshStandardMaterial color={HAIR} roughness={0.4} />
          </mesh>
          <mesh position={[x * 0.76, -0.4, -0.2]} scale={[0.9, 1.2, 1]}>
            <sphereGeometry args={[0.18, 20, 16]} />
            <meshStandardMaterial color={HAIR} roughness={0.4} />
          </mesh>
          {/* fringe lump, swept to each side of a centre parting */}
          <mesh
            position={[x * 0.3, 0.66, 0.4]}
            rotation={[0.2, 0, x * -0.5]}
            scale={[1.35, 0.7, 0.9]}
          >
            <sphereGeometry args={[0.2, 24, 18]} />
            <meshStandardMaterial color={HAIR} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Face({ eyes }: { eyes: React.MutableRefObject<THREE.Group | null> }) {
  return (
    <group>
      {/* head */}
      <mesh scale={HEAD_SCALE}>
        <sphereGeometry args={[0.8, 48, 36]} />
        <meshStandardMaterial color={SKIN} roughness={0.65} />
      </mesh>

      {/* ears */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 0.73, -0.03, 0]} scale={[0.5, 1, 0.8]}>
          <sphereGeometry args={[0.14, 16, 12]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
        </mesh>
      ))}

      {/* eyebrows: horizontal, slightly raised */}
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          position={[x * 0.27, 0.36, 0.66]}
          rotation={[0.1, 0, -x * (Math.PI / 2 + 0.1)]}
        >
          <capsuleGeometry args={[0.035, 0.24, 6, 12]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>
      ))}

      {/* eyes, pupils glance slightly to the side */}
      <group ref={eyes}>
        {[-1, 1].map((x) => (
          <group key={x} position={[x * 0.27, 0.12, 0.64]}>
            <mesh scale={[1, 1.1, 0.55]}>
              <sphereGeometry args={[0.13, 20, 16]} />
              <meshStandardMaterial color="#f6f2ec" roughness={0.3} />
            </mesh>
            <mesh position={[-0.035, -0.005, 0.06]}>
              <sphereGeometry args={[0.07, 16, 12]} />
              <meshStandardMaterial color="#1b1210" roughness={0.2} />
            </mesh>
            <mesh position={[-0.055, 0.025, 0.11]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* nose */}
      <mesh position={[0, -0.1, 0.77]} scale={[0.95, 1.2, 0.85]}>
        <sphereGeometry args={[0.09, 20, 16]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
      </mesh>

      {/* mustache */}
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          position={[x * 0.1, -0.23, 0.72]}
          rotation={[0.15, 0, -x * (Math.PI / 2 + 0.28)]}
        >
          <capsuleGeometry args={[0.04, 0.17, 6, 12]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>
      ))}

      {/* smile */}
      <mesh position={[0, -0.31, 0.7]} rotation={[0.1, 0, Math.PI]}>
        <torusGeometry args={[0.09, 0.015, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#6b2f2a" roughness={0.5} />
      </mesh>

      {/* beard: jaw and chin only, mouth stays clear */}
      <mesh scale={[0.935, 1.1, 0.965]}>
        <sphereGeometry
          args={[0.8, 48, 32, 0, Math.PI * 2, Math.PI * 0.68, Math.PI * 0.32]}
        />
        <meshStandardMaterial color={BEARD} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Character() {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.2) * 0.03;
    }
    if (head.current) {
      const tx = state.pointer.x * 0.5 + Math.sin(t * 0.5) * 0.06;
      const ty = -state.pointer.y * 0.22;
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, tx, 0.07);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, ty, 0.07);
    }
    if (eyes.current) {
      const blinking = (t % 4.2) > 4.05;
      eyes.current.scale.y = THREE.MathUtils.lerp(
        eyes.current.scale.y,
        blinking ? 0.1 : 1,
        0.5,
      );
    }
  });

  return (
    <group ref={root} position={[0, -0.05, 0]}>
      {/* shoulders and sweater */}
      <mesh position={[0, -1.95, 0]} scale={[1.75, 1.05, 1.0]}>
        <sphereGeometry args={[0.95, 40, 28]} />
        <meshStandardMaterial color={SWEATER} roughness={0.9} />
      </mesh>
      {/* neckline */}
      <mesh position={[0, -1.22, 0.1]} rotation={[Math.PI / 2 - 0.25, 0, 0]}>
        <torusGeometry args={[0.36, 0.07, 14, 36]} />
        <meshStandardMaterial color={SWEATER_LIGHT} roughness={0.9} />
      </mesh>
      {/* neck */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[0.27, 0.31, 0.6, 24]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
      </mesh>

      <group ref={head}>
        <Face eyes={eyes} />
        <Hair />
      </group>

      {/* ground ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.75, 0]}>
        <ringGeometry args={[1.5, 1.53, 80]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function CartoonAvatar() {
  return (
    <div className="avatar-shell">
      <div className="avatar-hud-top">
        <span className="hud-dot" />
        <span className="hud-label">AVATAR // INTERACTIVE 3D</span>
        <span className="hud-coords">LIVE</span>
      </div>
      <div className="avatar-stage">
        <Canvas camera={{ position: [0, -0.35, 4.7], fov: 36 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.0} />
          <directionalLight position={[2.5, 3.5, 5]} intensity={1.8} />
          <pointLight position={[-3, 2, -2]} intensity={14} color="#5eead4" />
          <pointLight position={[3, -1, 3]} intensity={6} color="#38bdf8" />
          <Character />
        </Canvas>
      </div>
      <div className="avatar-hud-bottom">
        <div className="hud-hint">Move your cursor to make me look around</div>
      </div>
    </div>
  );
}
