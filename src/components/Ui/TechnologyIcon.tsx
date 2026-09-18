import { TECHNOLOGIES } from "@/lib/technology";
import {
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  GlobeAltIcon,
  FlagIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  PencilSquareIcon,
  BeakerIcon,
  LinkIcon,
  MicrophoneIcon,
  ScaleIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

const brands: Record<string, string> = {
  "Go / Gin": "go",
  "Next.js / React": "nextjs",
  "C# / ASP.NET": "csharp",
  "Azure / GCP": "azure",
  "Node.js / NestJS": "nestjs",
  "Cloud Run": "googlecloud",
  "Kubernetes / K3s": "kubernetes",
  LangGraph: "langgraph",
  Java: "java",
  JavaScript: "javascript",
  Chrome: "chrome",
};
const concepts = {
  RAG: DocumentMagnifyingGlassIcon,
  "3-D Secure": ShieldCheckIcon,
  Reporting: ChartBarIcon,
  Web: GlobeAltIcon,
  Scrum: ArrowPathIcon,
  "Product Ownership": UserGroupIcon,
  OKR: FlagIcon,
  "Factur-X": DocumentTextIcon,
  PDF: DocumentTextIcon,
  PWA: DevicePhoneMobileIcon,
  MIT: ScaleIcon,
  "Conception produit": PencilSquareIcon,
  "Product design": PencilSquareIcon,
  Produktkonzeption: PencilSquareIcon,
  Matching: LinkIcon,
  Prototypage: BeakerIcon,
  Prototyping: BeakerIcon,
  Voix: MicrophoneIcon,
  Voice: MicrophoneIcon,
  Sprache: MicrophoneIcon,
};
export default function TechnologyIcon({
  label,
  id,
}: {
  label: string;
  id?: string;
}) {
  const brand =
    id || brands[label] || TECHNOLOGIES.find((tech) => tech[1] === label)?.[0];
  if (brand)
    return (
      <img
        className="technology-icon"
        src={`/technology/${brand}.svg`}
        alt=""
        width={32}
        height={32}
        loading="lazy"
        draggable={false}
      />
    );
  const Icon = concepts[label as keyof typeof concepts] || CodeBracketIcon;
  return <Icon className="technology-icon" aria-hidden="true" />;
}
