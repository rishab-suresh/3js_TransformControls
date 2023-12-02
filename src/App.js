import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  TransformControls,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import { Suspense, useState } from "react";

const modes = ["translate", "rotate", "scale"];
const state = proxy({ current: null, mode: 0 });

function Model({ name, ...props }) {
  const snap = useSnapshot(state);
  const { nodes } = useGLTF("./compressed.glb");
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <mesh
      onClick={(e) => [e.stopPropagation(), (state.current = name)]}
      onPointerMissed={(e) => e.type === "click" && (state.current = null)}
      onContextMenu={(e) => [
        snap.current === name && e.stopPropagation(),
        (state.mode = (snap.mode + 1) % modes.length),
      ]}
      onPointerOver={(e) => [e.stopPropagation(), setHovered(true)]}
      onPointerOut={(e) => setHovered(false)}
      name={name}
      geometry={nodes[name].geometry}
      material={nodes[name].material}
      material-color={snap.current === name ? "hotpink" : "white"}
      {...props}
      dispose={null}
    ></mesh>
  );
}

function Controls() {
  const snap = useSnapshot(state);
  const scene = useThree((state) => state.scene);
  return (
    <>
      {snap.current && (
        <TransformControls
          object={scene.getObjectByName(snap.current)}
          mode={modes[snap.mode]}
        />
      )}
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

function App() {
  return (
    <Canvas camera={{ position: [0, -10, 80], fov: 50 }} dpr={[1, 2]}>
      <pointLight position={[100, 100, 100]} intensity={0.8} />
      <hemisphereLight
        color="white"
        groundColor="black"
        position={[-7, 25, 23]}
        intensity={1}
      />
      <Suspense fallback={null}>
        <group position={[0, 10, 0]}>
          <Model name="Curly" position={[1, -11, -20]} rotation={[2, 0, -0]} />
          <Model name="DNA" position={[20, 0, -17]} rotation={[1, 1, -2]} />
          <Model
            name="Headphones"
            position={[20, 2, 4]}
            rotation={[1, 0, -1]}
          />
          <Model
            name="Notebook"
            position={[-21, -15, -13]}
            rotation={[2, 0, 1]}
          />
          <Model
            name="Rocket003"
            position={[18, 15, -25]}
            rotation={[1, 1, 0]}
          />
          <Model
            name="Roundcube001"
            position={[-25, -4, 5]}
            rotation={[1, 0, 0]}
            scale={0.5}
          />
          <Model
            name="Table"
            position={[1, -4, -28]}
            rotation={[1, 0, -1]}
            scale={0.5}
          />
          <Model
            name="VR_Headset"
            position={[7, -15, 28]}
            rotation={[1, 0, -1]}
            scale={5}
          />
          <Model
            name="Zeppelin"
            position={[-20, 10, 10]}
            rotation={[3, -1, 3]}
            scale={0.005}
          />
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -35, 0]}
            opacity={0.25}
            width={200}
            height={200}
            blur={1}
            far={50}
          />
        </group>
      </Suspense>
      <Controls />
    </Canvas>
  );
}
export default App;
