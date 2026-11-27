export function SkillLine({ skills, technique }: { skills: string[]; technique?: string }) {
  const labels = skills.length ? skills : technique?.split(/\s*&\s*/) ?? [];
  return labels.length ? <p className="dish-skills">{labels.join(' · ')}</p> : null;
}
