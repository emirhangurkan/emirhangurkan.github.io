// Each section arrives from the bottom; its world is in place before the title
// reaches the upper part of the viewport. The position also works in reverse.
export function journeyPosition(sectionTops, viewportHeight) {
  const start = viewportHeight * .78;
  const end = viewportHeight * .2;
  let position = 0;
  for (let index = 1; index < sectionTops.length; index++) {
    const top = sectionTops[index];
    if (top <= end) position = index;
    else if (top < start) {
      const t = (start - top) / (start - end);
      position = index - 1 + t * t * (3 - 2 * t);
      break;
    } else break;
  }
  return position;
}
