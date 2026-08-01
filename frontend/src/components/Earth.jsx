import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";

function Model({ children }) {
  const gltf = useLoader(GLTFLoader, "/earth/earth.gltf");
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.004 // Rotates around Y-axis
    }
  });

  return (
    <group ref={modelRef} scale={1.5}>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
}

const LocationPin = ({ lat, lon, radius = 1.5, url }) => {
  const gltf = useLoader(GLTFLoader, "/map_pin_/scene.gltf");

  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return (
    <primitive
      object={gltf.scene}
      position={[x, y, z]}
      scale={0.05}
      onClick={(e) => {
        e.stopPropagation(); // prevent camera controls
        window.open(url, "_blank");
      }}
    />
  );
};

function Earth() {
  return (
    <Canvas>
      <ambientLight intensity={2} />
      <OrbitControls enableZoom={false} />
      <spotLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model>
          <LocationPin
            lat={21.251352070102293}
            lon={81.60418151868645}
            url="https://maps.app.goo.gl/wa2cvWaU5fUMzX8T6"
          />
        </Model>
      </Suspense>
    </Canvas>
  );
}

export default Earth;
