import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SKIN = "#b87b53";
const SKIN_SHADE = "#99633f";
const HAIR = "#211f26";
const BEARD = "#2b2022";
const SWEATER = "#2b3a63";
const SWEATER_TRIM = "#3b4d80";

const HEAD_SCALE: [number, number, number] = [0.9, 1.06, 0.92];

/** Shared stylised shading: 4 flat light bands, gives the cartoon look. */
function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([70, 125, 190, 255]);
    const tex = new THREE.DataTexture(data, data.length, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function Toon({
  color,
  gradient,
  side,
}: {
  color: string;
  gradient: THREE.Texture;
  side?: THREE.Side;
}) {
  return <meshToonMaterial color={color} gradientMap={gradient} side={side} />;
}

/** Long wavy hair silhouette that sits behind the head and falls past the shoulders. */
function HairBack({ gradient }: { gradient: THREE.Texture }) {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.12);
    s.bezierCurveTo(0.7, 1.16, 1.02, 0.8, 1.0, 0.25);
    s.bezierCurveTo(1.06, -0.05, 0.9, -0.3, 0.98, -0.55);
    s.bezierCurveTo(1.0, -0.75, 0.8, -0.95, 0.6, -0.85);
    s.bezierCurveTo(0.45, -0.8, 0.3, -1.0, 0.1, -0.9);
    s.lineTo(-0.1, -0.9);
    s.bezierCurveTo(-0.3, -1.0, -0.45, -0.8, -0.6, -0.85);
    s.bezierCurveTo(-0.8, -0.95, -1.0, -0.75, -0.98, -0.55);
    s.bezierCurveTo(-0.9, -0.3, -1.06, -0.05, -1.0, 0.25);
    s.bezierCurveTo(-1.02, 0.8, -0.7, 1.16, 0, 1.12);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.1,
      bevelSegments: 6,
      curveSegments: 48,
    });
    g.translate(0, 0, -0.5);
    return g;
  }, []);

  return (
    <mesh geometry={geometry}>
      <Toon color={HAIR} gradient={gradient} />
    </mesh>
  );
}

/** Hair that sits on the head: crown volume plus a swept fringe with a centre parting. */
function HairFront({ gradient }: { gradient: THREE.Texture }) {
  return (
    <group>
      {/* skull cap, tilted so the hairline sits above the eyebrows */}
      <group scale={HEAD_SCALE}>
        <mesh rotation={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.835, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
          <Toon color={HAIR} gradient={gradient} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* crown volume */}
      <mesh position={[0, 0.78, -0.05]} scale={[1.08, 0.66, 1.0]}>
        <sphereGeometry args={[0.66, 40, 28]} />
        <Toon color={HAIR} gradient={gradient} />
      </mesh>

      {/* fringe swept to each side of the parting */}
      {[-1, 1].map((x) => (
        <group key={x}>
          <mesh
            position={[x * 0.3, 0.6, 0.44]}
            rotation={[0.25, 0, x * -0.55]}
            scale={[1.5, 0.72, 0.95]}
          >
            <sphereGeometry args={[0.2, 28, 20]} />
            <Toon color={HAIR} gradient={gradient} />
          </mesh>
          {/* soft lock falling beside the face */}
          <mesh position={[x * 0.74, 0.18, 0.12]} scale={[0.75, 1.5, 0.9]}>
            <sphereGeometry args={[0.16, 24, 18]} />
            <Toon color={HAIR} gradient={gradient} />
          </mesh>
          <mesh position={[x * 0.8, -0.18, 0.02]} scale={[0.75, 1.5, 0.9]}>
            <sphereGeometry args={[0.15, 24, 18]} />
            <Toon color={HAIR} gradient={gradient} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Face({
  eyes,
  gradient,
}: {
  eyes: MutableRefObject<THREE.Group | null>;
  gradient: THREE.Texture;
}) {
  return (
    <group>
      {/* head */}
      <mesh scale={HEAD_SCALE}>
        <sphereGeometry args={[0.8, 56, 40]} />
        <Toon color={SKIN} gradient={gradient} />
      </mesh>

      {/* ears */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 0.72, -0.04, 0]} scale={[0.5, 1, 0.8]}>
          <sphereGeometry args={[0.14, 16, 12]} />
          <Toon color={SKIN_SHADE} gradient={gradient} />
        </mesh>
      ))}

      {/* eyebrows */}
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          position={[x * 0.27, 0.38, 0.66]}
          rotation={[0.1, 0, -x * (Math.PI / 2 + 0.16)]}
        >
          <capsuleGeometry args={[0.032, 0.22, 6, 12]} />
          <meshStandardMaterial color={HAIR} roughness={0.5} />
        </mesh>
      ))}

      {/* eyes */}
      <group ref={eyes}>
        {[-1, 1].map((x) => (
          <group key={x} position={[x * 0.27, 0.12, 0.64]}>
            <mesh scale={[1, 1.12, 0.55]}>
              <sphereGeometry args={[0.135, 24, 18]} />
              <meshStandardMaterial color="#fbf8f3" roughness={0.25} />
            </mesh>
            {/* iris + pupil, glancing a little to the side */}
            <mesh position={[-0.03, -0.005, 0.055]} scale={[1, 1, 0.6]}>
              <sphereGeometry args={[0.082, 20, 16]} />
              <meshStandardMaterial color="#4a2a1c" roughness={0.3} />
            </mesh>
            <mesh position={[-0.032, -0.005, 0.085]}>
              <sphereGeometry args={[0.045, 16, 12]} />
              <meshStandardMaterial color="#0b0807" roughness={0.2} />
            </mesh>
            <mesh position={[-0.055, 0.03, 0.115]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* upper lid line */}
            <mesh position={[0, 0.015, 0.045]} rotation={[0.15, 0, 0]}>
              <torusGeometry args={[0.135, 0.012, 8, 28, Math.PI]} />
              <meshStandardMaterial color="#17110f" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* nose */}
      <mesh position={[0, -0.1, 0.75]} scale={[0.95, 1.15, 0.85]}>
        <sphereGeometry args={[0.095, 24, 18]} />
        <Toon color={SKIN_SHADE} gradient={gradient} />
      </mesh>

      {/* cheeks */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 0.42, -0.14, 0.58]} scale={[1, 0.7, 0.3]}>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshBasicMaterial color="#e0836a" transparent opacity={0.28} />
        </mesh>
      ))}

      {/* mustache */}
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          position={[x * 0.105, -0.225, 0.71]}
          rotation={[0.2, 0, -x * (Math.PI / 2 + 0.3)]}
        >
          <capsuleGeometry args={[0.042, 0.18, 6, 12]} />
          <meshStandardMaterial color={HAIR} roughness={0.55} />
        </mesh>
      ))}

      {/* open smile with teeth */}
      <group position={[0, -0.3, 0.69]} rotation={[0.12, 0, 0]}>
        <mesh>
          <circleGeometry args={[0.1, 28, Math.PI, Math.PI]} />
          <meshBasicMaterial color="#6e2a2c" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.014, 0.003]}>
          <planeGeometry args={[0.15, 0.028]} />
          <meshBasicMaterial color="#fbf8f3" />
        </mesh>
      </group>

      {/* beard: jaw and chin, mouth stays clear */}
      <mesh scale={[0.915, 1.08, 0.945]}>
        <sphereGeometry args={[0.8, 56, 36, 0, Math.PI * 2, Math.PI * 0.73, Math.PI * 0.27]} />
        <Toon color={BEARD} gradient={gradient} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Character({ pointer }: { pointer: MutableRefObject<{ x: number; y: number }> }) {
  const gradient = useToonGradient();
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = 0.35 + Math.sin(t * 1.1) * 0.03;
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        -0.28 + pointer.current.x * 0.18,
        0.05,
      );
    }
    if (head.current) {
      const tx = pointer.current.x * 0.45 + Math.sin(t * 0.5) * 0.05;
      const ty = -pointer.current.y * 0.22;
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, tx, 0.07);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, ty, 0.07);
    }
    if (eyes.current) {
      const blinking = t % 4.2 > 4.05;
      eyes.current.scale.y = THREE.MathUtils.lerp(eyes.current.scale.y, blinking ? 0.1 : 1, 0.5);
    }
  });

  return (
    <group ref={root} position={[0.5, 0.35, 0]}>
      {/* shoulders and sweater */}
      <mesh position={[0, -2.05, 0]} scale={[1.8, 1.05, 1.0]}>
        <sphereGeometry args={[0.95, 48, 32]} />
        <Toon color={SWEATER} gradient={gradient} />
      </mesh>
      {/* neckline */}
      <mesh position={[0, -1.28, 0.12]} rotation={[Math.PI / 2 - 0.25, 0, 0]}>
        <torusGeometry args={[0.38, 0.08, 16, 40]} />
        <Toon color={SWEATER_TRIM} gradient={gradient} />
      </mesh>
      {/* neck */}
      <mesh position={[0, -1.02, 0]}>
        <cylinderGeometry args={[0.27, 0.32, 0.65, 28]} />
        <Toon color={SKIN_SHADE} gradient={gradient} />
      </mesh>

      <HairBack gradient={gradient} />
      <group ref={head}>
        <Face eyes={eyes} gradient={gradient} />
        <HairFront gradient={gradient} />
      </group>
    </group>
  );
}

/** Big 3D cartoon bust meant to sit behind the hero text. No frame, no captions. */
export default function CartoonAvatar() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, -0.5, 9.6], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} />
      <pointLight position={[-4, 3, -1]} intensity={40} color="#5eead4" />
      <pointLight position={[4, 4, -3]} intensity={30} color="#a5f3fc" />
      <pointLight position={[4, -1, 3]} intensity={8} color="#38bdf8" />
      <Character pointer={pointer} />
    </Canvas>
  );
}
