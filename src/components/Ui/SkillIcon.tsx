import {
  WindowIcon,
  ServerStackIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
const icons = [
  WindowIcon,
  ServerStackIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  AcademicCapIcon,
];
export default function SkillIcon({ index }: { index: number }) {
  const Icon = icons[index] ?? AcademicCapIcon;
  return (
    <span className="skill-icon" aria-hidden="true">
      <Icon strokeWidth={1.4} />
    </span>
  );
}
