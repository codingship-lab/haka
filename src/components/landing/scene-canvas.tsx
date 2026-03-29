"use client";

import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import { SECTION_THEMES, SECTIONS, type SectionId } from "@/components/landing/site-data";

type SceneCanvasProps = {
  activeSection: number;
  hoveredSection: SectionId | null;
  reducedMotion: boolean;
};

const SCENE_POSITIONS: Array<[number, number, number]> = [
  [0.1, 0.15, 0],
  [0.72, 0.12, 0],
  [-0.6, -0.18, 0],
  [0.18, -0.5, 0],
];

const BLOB_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uHover;
  uniform float uSection;

  varying vec3 vWorldPosition;
  varying vec3 vNormalDirection;
  varying float vWave;

  void main() {
    vec3 transformed = position;

    float waveA = sin(position.y * 3.4 + uTime * 1.05) * 0.08;
    float waveB = cos(position.x * 3.0 - uTime * 0.72 + position.z * 2.4) * 0.075;
    float waveC = sin((position.x + position.y + position.z) * 2.5 + uTime * 1.3) * 0.05;
    float hoverBoost = mix(1.0, 1.35, uHover);
    float sectionBoost = 0.84 + uSection * 0.18;
    float displacement = (waveA + waveB + waveC) * hoverBoost * sectionBoost;

    transformed += normal * displacement;

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormalDirection = normalize(mat3(modelMatrix) * normal);
    vWave = displacement;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const BLOB_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uGlow;

  varying vec3 vWorldPosition;
  varying vec3 vNormalDirection;
  varying float vWave;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormalDirection, viewDir), 0.0), 2.0);
    float band = 0.5 + 0.5 * sin(vWorldPosition.y * 2.8 - uTime * 0.55 + vWave * 9.0);
    float shimmer = 0.5 + 0.5 * cos(vWorldPosition.x * 1.8 + uTime * 0.35);

    vec3 base = mix(uColorA, uColorB, band);
    vec3 glow = mix(base, uGlow, fresnel * (0.75 + uHover * 0.3));
    vec3 finalColor = mix(glow, vec3(1.0), shimmer * 0.08);

    float alpha = 0.82 + fresnel * 0.16;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function SceneExperience({
  activeSection,
  hoveredSection,
  reducedMotion,
}: SceneCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport, pointer } = useThree();

  const uniforms = useMemo(() => {
    const initialTheme = SECTION_THEMES[SECTIONS[0].tone];

    return {
      uTime: { value: 0 },
      uHover: { value: 0 },
      uSection: { value: 0 },
      uColorA: { value: new THREE.Color(initialTheme["--mesh-a"]) },
      uColorB: { value: new THREE.Color(initialTheme["--mesh-b"]) },
      uGlow: { value: new THREE.Color(initialTheme["--mesh-glow"]) },
    };
  }, []);

  const currentColorA = useMemo(
    () => new THREE.Color(SECTION_THEMES[SECTIONS[0].tone]["--mesh-a"]),
    [],
  );
  const currentColorB = useMemo(
    () => new THREE.Color(SECTION_THEMES[SECTIONS[0].tone]["--mesh-b"]),
    [],
  );
  const currentGlow = useMemo(
    () => new THREE.Color(SECTION_THEMES[SECTIONS[0].tone]["--mesh-glow"]),
    [],
  );
  const targetColor = useMemo(() => new THREE.Color(), []);

  const isMobile = size.width < 820;

  useFrame((state, delta) => {
    const material = materialRef.current;
    const theme = SECTION_THEMES[SECTIONS[activeSection].tone];
    const hoverTarget = hoveredSection ? 1 : 0;
    const sectionTarget = activeSection / (SECTIONS.length - 1);

    if (!material) {
      return;
    }

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uHover.value = THREE.MathUtils.damp(
      material.uniforms.uHover.value,
      hoverTarget,
      4,
      delta,
    );
    material.uniforms.uSection.value = THREE.MathUtils.damp(
      material.uniforms.uSection.value,
      sectionTarget,
      3.6,
      delta,
    );

    targetColor.set(theme["--mesh-a"]);
    currentColorA.lerp(targetColor, 0.08);
    material.uniforms.uColorA.value.copy(currentColorA);

    targetColor.set(theme["--mesh-b"]);
    currentColorB.lerp(targetColor, 0.08);
    material.uniforms.uColorB.value.copy(currentColorB);

    targetColor.set(theme["--mesh-glow"]);
    currentGlow.lerp(targetColor, 0.08);
    material.uniforms.uGlow.value.copy(currentGlow);

    if (groupRef.current) {
      const [targetX, targetY, targetZ] = SCENE_POSITIONS[activeSection];
      const pointerShiftX = reducedMotion ? 0 : pointer.x * 0.18;
      const pointerShiftY = reducedMotion ? 0 : pointer.y * 0.14;
      const intensity = hoverTarget > 0 ? 1.1 : 0.72;

      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetX + pointerShiftX,
        3,
        delta,
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY + pointerShiftY,
        3,
        delta,
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetZ + (activeSection === 1 ? 0.12 : activeSection === 3 ? -0.18 : 0),
        3,
        delta,
      );

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        activeSection * 0.34 + pointer.x * 0.16,
        2.8,
        delta,
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        -0.12 + pointer.y * 0.12,
        2.8,
        delta,
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        hoverTarget * 0.08,
        3.4,
        delta,
      );

      const mobileScale = viewport.width < 6 ? 0.62 : 0.9;
      const desktopScale = hoverTarget > 0 ? 1.02 : 0.94;
      groupRef.current.scale.setScalar(isMobile ? mobileScale : desktopScale * intensity);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.14;
      ringRef.current.rotation.x = THREE.MathUtils.damp(
        ringRef.current.rotation.x,
        Math.PI / 2 + hoverTarget * 0.1,
        3.2,
        delta,
      );
    }

    if (auraRef.current) {
      auraRef.current.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime * 1.2) * 0.06);
    }
  });

  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight color="#f4fbff" intensity={1.6} position={[4, 5, 4]} />
      <pointLight color="#6ed4ff" intensity={25} position={[-2, 1, 4]} />
      <pointLight color="#99e5ff" intensity={18} position={[3, -2, 2]} />

      <group ref={groupRef}>
        <mesh ref={auraRef} scale={1.4}>
          <sphereGeometry args={[2.05, 48, 48]} />
          <meshBasicMaterial
            color="#85d8ff"
            transparent
            opacity={isMobile ? 0.08 : 0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh>
          <icosahedronGeometry args={[1.45, 32]} />
          <shaderMaterial
            ref={materialRef}
            fragmentShader={BLOB_FRAGMENT_SHADER}
            transparent
            uniforms={uniforms}
            vertexShader={BLOB_VERTEX_SHADER}
          />
        </mesh>

        <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.18} floatIntensity={0.34}>
          <RoundedBox args={[1.95, 1.95, 0.24]} radius={0.34} smoothness={6}>
            <meshPhysicalMaterial
              color="#f7fbff"
              roughness={0.08}
              metalness={0.06}
              transmission={0.72}
              thickness={0.82}
              transparent
              opacity={0.24}
            />
          </RoundedBox>
        </Float>

        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.24, 0.04, 18, 200]} />
          <meshStandardMaterial
            color="#dff6ff"
            emissive="#7fd5ff"
            emissiveIntensity={1.1}
            transparent
            opacity={0.34}
          />
        </mesh>

        <Sparkles
          color="#d6f5ff"
          count={isMobile ? 34 : 62}
          opacity={0.45}
          scale={[6, 6, 6]}
          size={4}
          speed={0.2}
        />
      </group>

      {!reducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.84}
            luminanceSmoothing={0.34}
            luminanceThreshold={0.18}
            mipmapBlur
          />
          <Noise opacity={0.04} premultiply />
          <Vignette darkness={0.18} eskil={false} offset={0.18} />
        </EffectComposer>
      )}
    </>
  );
}

export function SceneCanvas(props: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 5.3], fov: 38 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <SceneExperience {...props} />
      </Suspense>
    </Canvas>
  );
}
