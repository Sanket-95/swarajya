import {
  Color,
  Fog,
  HemisphereLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
} from "three";
import type { QualityPreset } from "./quality";

const SKY = 0x9cc7e6;
const GROUND = 0x7a8a4a; // dry Sahyadri grass

export interface EmptyScene {
  scene: Scene;
  camera: PerspectiveCamera;
}

/** Session 0 placeholder world: sky colour + one ground plane, one light, no shadows. */
export function createEmptyScene(preset: QualityPreset, aspect: number): EmptyScene {
  const scene = new Scene();
  scene.background = new Color(SKY);
  scene.fog = new Fog(SKY, preset.viewDistance * 0.5, preset.viewDistance);

  scene.add(new HemisphereLight(0xffffff, 0x5a4a32, 2.2));

  const size = preset.viewDistance * 2;
  const ground = new Mesh(new PlaneGeometry(size, size), new MeshLambertMaterial({ color: GROUND }));
  ground.rotation.x = -Math.PI / 2;
  ground.matrixAutoUpdate = false;
  ground.updateMatrix();
  scene.add(ground);

  const camera = new PerspectiveCamera(60, aspect, 0.1, preset.viewDistance);
  camera.position.set(0, 1.7, 6);
  camera.lookAt(0, 1.2, 0);

  return { scene, camera };
}
