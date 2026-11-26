/**
 * Hero 3D Scene - sculptural Tracxi centerpiece.
 * Visible immediately, no intro delay. Ref-based animation only.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface HeroSceneProps {
  reducedMotion?: boolean;
}

export function HeroScene({ reducedMotion = false }: HeroSceneProps) {
  const group = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  const mats = useMemo(() => {
    const silver = new THREE.MeshPhysicalMaterial({ color: '#c6ccd3', metalness: 0.92, roughness: 0.22, clearcoat: 0.45, clearcoatRoughness: 0.2 });
    const dark = new THREE.MeshPhysicalMaterial({ color: '#5a616b', metalness: 0.85, roughness: 0.28, clearcoat: 0.25 });
    const graphite = new THREE.MeshPhysicalMaterial({ color: '#2b3037', metalness: 0.35, roughness: 0.5 });
    const champagne = new THREE.MeshPhysicalMaterial({ color: '#c8b05e', metalness: 0.78, roughness: 0.25, clearcoat: 0.5, emissive: new THREE.Color('#2a2412'), emissiveIntensity: 0.08 });
    return { silver, dark, graphite, champagne };
  }, []);

  const geo = useMemo(() => ({
    core: new THREE.BoxGeometry(0.95, 2.8, 0.95),
    slab: new THREE.BoxGeometry(2.4, 0.16, 0.75),
    slab2: new THREE.BoxGeometry(1.9, 0.14, 0.62),
    blade: new THREE.BoxGeometry(0.12, 2.2, 0.55),
    pillar: new THREE.BoxGeometry(0.22, 1.6, 0.22),
    ring: new THREE.TorusGeometry(1.25, 0.035, 24, 120),
    arc: new THREE.TorusGeometry(1.65, 0.03, 20, 100, Math.PI * 0.72),
    disc: new THREE.CylinderGeometry(0.08, 0.08, 0.04, 24),
  }), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.x = ny * 0.08;
      target.current.y = nx * 0.12;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
    };
  }, [geo, mats]);

  useFrame((_, delta) => {
    if (group.current && !reducedMotion) {
      group.current.rotation.y += delta * 0.12;
    }
    if (tilt.current) {
      const d = reducedMotion ? 0.04 : 0.06;
      pointer.current.x += (target.current.x - pointer.current.x) * d;
      pointer.current.y += (target.current.y - pointer.current.y) * d;
      tilt.current.rotation.x = -0.08 + pointer.current.x;
      tilt.current.rotation.z = pointer.current.y * 0.35;
    }
  });

  return (
    <group position={[1.35, -0.15, 0]}>
      <ambientLight intensity={0.55} color="#fff8ee" />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#fff4e2" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-5, 2, -3]} intensity={0.75} color="#dfe8f2" />
      <directionalLight position={[0, -2, 5]} intensity={0.35} color="#ffe9c7" />
      <Environment preset="city" environmentIntensity={0.45} />

      <group ref={tilt}>
        <group ref={group}>
          {/* Central core */}
          <mesh geometry={geo.core} material={mats.silver} castShadow receiveShadow position={[0, 0.1, 0]} />
          <mesh geometry={geo.pillar} material={mats.dark} castShadow position={[-0.62, 0.1, 0.35]} rotation={[0, 0.2, 0]} />
          <mesh geometry={geo.pillar} material={mats.dark} castShadow position={[0.62, -0.05, -0.35]} rotation={[0, -0.15, 0]} />

          {/* Slabs - architectural layers */}
          <mesh geometry={geo.slab} material={mats.graphite} castShadow receiveShadow position={[0, 0.72, 0]} rotation={[0, 0.32, 0]} />
          <mesh geometry={geo.slab2} material={mats.silver} castShadow receiveShadow position={[0.1, -0.15, 0.05]} rotation={[0, -0.42, 0]} />
          <mesh geometry={geo.slab2} material={mats.dark} castShadow receiveShadow position={[-0.05, -0.95, 0]} rotation={[0, 0.48, 0]} />

          {/* Blades */}
          <mesh geometry={geo.blade} material={mats.silver} castShadow position={[0.92, 0.15, 0.12]} rotation={[0.08, 0.25, 0.12]} />
          <mesh geometry={geo.blade} material={mats.dark} castShadow position={[-0.95, -0.1, -0.1]} rotation={[-0.06, -0.3, -0.1]} />

          {/* Rings/arcs */}
          <mesh geometry={geo.ring} material={mats.champagne} position={[0, -1.35, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={geo.arc} material={mats.silver} position={[0, 0.25, 0]} rotation={[Math.PI / 2.2, 0.4, 0.2]} />

          {/* Accent discs */}
          <mesh geometry={geo.disc} material={mats.champagne} position={[0.55, 1.15, 0.45]} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={geo.disc} material={mats.champagne} position={[-0.45, -0.55, 0.52]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      </group>

      <ContactShadows position={[0, -1.85, 0]} opacity={0.28} scale={8} blur={2.4} far={4} color="#3a342b" />
    </group>
  );
}

export default HeroScene;
