export function getSubjectColor(subjectId: number): string {
  const hue = Math.round((subjectId * 137.508) % 360);
  return `hsl(${hue}, 65%, 55%)`;
}
