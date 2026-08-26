function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sceneTravel(scene: HTMLElement) {
  return Math.max(0, scene.offsetHeight - window.innerHeight);
}

export function sceneProgress(scene: HTMLElement, scrollY: number) {
  const travel = Math.max(1, sceneTravel(scene));
  return clamp((scrollY - scene.offsetTop) / travel, 0, 1);
}

export function sceneScrollY(scene: HTMLElement, progress: number) {
  return scene.offsetTop + sceneTravel(scene) * progress;
}
