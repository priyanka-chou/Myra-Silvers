import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const damp = THREE.MathUtils.damp;

/**
 * A studio painted into a canvas instead of loaded from an HDR file: no
 * network request, no drei, about 90 kB less to download. The bright band
 * across the middle is what the band actually reflects.
 */
function useStudioEnvironment() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const base = ctx.createLinearGradient(0, 0, 0, 512);
    base.addColorStop(0, "#070a12");
    base.addColorStop(0.34, "#1b2338");
    base.addColorStop(0.52, "#c6d1e6");
    base.addColorStop(0.66, "#7e8799");
    base.addColorStop(0.84, "#161b29");
    base.addColorStop(1, "#05070c");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 1024, 512);

    const key = ctx.createRadialGradient(280, 190, 10, 280, 190, 240);
    key.addColorStop(0, "rgba(255,255,255,0.95)");
    key.addColorStop(0.3, "rgba(232,240,255,0.5)");
    key.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = key;
    ctx.fillRect(0, 0, 1024, 512);

    const warm = ctx.createRadialGradient(800, 250, 8, 800, 250, 190);
    warm.addColorStop(0, "rgba(255,226,180,0.75)");
    warm.addColorStop(1, "rgba(255,226,180,0)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, 1024, 512);

    const floor = ctx.createLinearGradient(0, 360, 0, 512);
    floor.addColorStop(0, "rgba(60,70,96,0)");
    floor.addColorStop(1, "rgba(9,12,20,0.9)");
    ctx.fillStyle = floor;
    ctx.fillRect(0, 360, 1024, 152);

    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

function SilverRing({ pointer }) {
  const group = useRef(null);
  const spinner = useRef(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current;
    g.rotation.x = damp(g.rotation.x, -0.36 + p.y * 0.26, 3.2, dt);
    g.rotation.y = damp(g.rotation.y, p.x * 0.72, 3.2, dt);
    g.rotation.z = damp(g.rotation.z, p.x * -0.1, 2.4, dt);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.055;
    if (spinner.current) spinner.current.rotation.z += dt * 0.05;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[1, 0.26, 48, 180]} />
        <meshPhysicalMaterial
          color="#d9dfe8"
          metalness={1}
          roughness={0.15}
          envMapIntensity={2.1}
          clearcoat={0.6}
          clearcoatRoughness={0.22}
        />
      </mesh>

      <mesh ref={spinner} scale={0.9}>
        <torusGeometry args={[1, 0.24, 32, 140]} />
        <meshStandardMaterial color="#8b929d" metalness={0.9} roughness={0.52} envMapIntensity={0.7} />
      </mesh>

      <group position={[0, 1.05, 0]} rotation={[0.14, 0.42, 0]}>
        <mesh>
          <octahedronGeometry args={[0.33, 0]} />
          <meshPhysicalMaterial
            color="#e8efff"
            metalness={0}
            roughness={0.03}
            transmission={0.92}
            thickness={0.7}
            ior={2.3}
            envMapIntensity={3}
            clearcoat={1}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.35, 0.045, 14, 40]} />
          <meshPhysicalMaterial color="#eef2f8" metalness={1} roughness={0.08} envMapIntensity={2.2} />
        </mesh>
      </group>
    </group>
  );
}

function KeyLight({ pointer }) {
  const light = useRef(null);
  useFrame((_, dt) => {
    if (!light.current) return;
    const p = pointer.current;
    light.current.position.x = damp(light.current.position.x, p.x * 4.2, 4, dt);
    light.current.position.y = damp(light.current.position.y, 2.2 - p.y * 3, 4, dt);
  });
  return <pointLight ref={light} position={[2.2, 2.2, 3]} intensity={22} distance={16} decay={1.9} color="#eef3ff" />;
}

function Scene({ pointer }) {
  const env = useStudioEnvironment();
  return (
    <>
      {env ? <primitive object={env} attach="environment" /> : null}
      <ambientLight intensity={0.3} />
      <KeyLight pointer={pointer} />
      <directionalLight position={[-4, 1, 2]} intensity={1.4} color="#9fb0d4" />
      <SilverRing pointer={pointer} />
    </>
  );
}

export default function Ring3D({ pointer }) {
  const fallback = useMemo(() => ({ current: { x: 0, y: 0 } }), []);
  const ref = pointer || fallback;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, 4.1], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Scene pointer={ref} />
      </Suspense>
    </Canvas>
  );
}
