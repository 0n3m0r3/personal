import { TECHNOLOGIES } from "@/lib/technology";

import TechnologyIcon from "./TechnologyIcon";

export default function TechnologyTiles({
  ids,
  labels,
}: {
  ids?: readonly string[];
  labels?: readonly string[];
}) {
  const items = labels
    ? labels.map((label) => ({ label, id: undefined as string | undefined }))
    : (ids || []).flatMap((id) => {
        const tech = TECHNOLOGIES.find((item) => item[0] === id);
        return tech ? [{ id, label: tech[1] }] : [];
      });
  return (
    <ul className="technology-tiles">
      {items.map(({ id, label }) => (
        <li key={label}>
          <TechnologyIcon label={label} id={id} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
