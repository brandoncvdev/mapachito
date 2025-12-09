export async function animateElement(
  el: HTMLElement,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions
): Promise<void> {
  try {
    await new Promise((r) => requestAnimationFrame(r));
    const animation = el.animate(keyframes, { fill: 'forwards', ...options });
    await animation.finished;
  } catch {}
}
