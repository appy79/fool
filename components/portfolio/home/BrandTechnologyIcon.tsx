import {
  siAngular,
  siApachecassandra,
  siApachekafka,
  siCamunda,
  siCouchbase,
  siDocker,
  siFfmpeg,
  siFlask,
  siGitlab,
  siGoogle,
  siJenkins,
  siJunit5,
  siKubernetes,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siRedis,
  siSpringboot,
  siThreedotjs,
  siTypescript,
  siVault,
} from "simple-icons";

type SimpleIconShape = {
  hex: string;
  path: string;
  title: string;
};

type BrandTechnologyIconProps = {
  name: string;
};

const brandIcons: Record<string, SimpleIconShape> = {
  angularjs: siAngular,
  camunda: siCamunda,
  cassandradb: siApachecassandra,
  couchbase: siCouchbase,
  docker: siDocker,
  ffmpeg: siFfmpeg,
  flask: siFlask,
  gitlabci: siGitlab,
  java: siOpenjdk,
  jenkins: siJenkins,
  junit: siJunit5,
  kafka: siApachekafka,
  kubernetes: siKubernetes,
  postgresql: siPostgresql,
  postman: siPostman,
  python: siPython,
  reactjs: siReact,
  redis: siRedis,
  springboot: siSpringboot,
  threejs: siThreedotjs,
  typescript: siTypescript,
  vault: siVault,
};

const fallbackBrands: Record<string, { background: string; color: string; label: string }> = {
  aws: { background: "#232F3E", color: "#FF9900", label: "AWS" },
  azure: { background: "#0078D4", color: "#FFFFFF", label: "AZ" },
  computernetworks: { background: "#0EA5E9", color: "#FFFFFF", label: "NET" },
  dsa: { background: "#7C3AED", color: "#FFFFFF", label: "DS" },
  googleapi: { background: `#${siGoogle.hex}`, color: "#FFFFFF", label: "G" },
  microservices: { background: "#14B8A6", color: "#FFFFFF", label: "MS" },
  mockito: { background: "#5BAF3A", color: "#FFFFFF", label: "MO" },
  oop: { background: "#F97316", color: "#FFFFFF", label: "OO" },
  operatingsystems: { background: "#64748B", color: "#FFFFFF", label: "OS" },
  restapis: { background: "#06B6D4", color: "#FFFFFF", label: "API" },
  "sql&nosqldbs": { background: "#336791", color: "#FFFFFF", label: "DB" },
  testng: { background: "#DC2626", color: "#FFFFFF", label: "TN" },
};

const normalizeTechnologyName = (name: string) => name.toLowerCase().replace(/[^a-z0-9&]/g, "");

export default function BrandTechnologyIcon({ name }: BrandTechnologyIconProps) {
  const normalizedName = normalizeTechnologyName(name);
  const icon = brandIcons[normalizedName];

  if (icon) {
    return (
      <span
        className="grid size-6 shrink-0 place-items-center bg-white shadow-sm ring-1 ring-border/70"
        title={icon.title}
      >
        <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill={`#${icon.hex}`} aria-hidden="true">
          <path d={icon.path} />
        </svg>
      </span>
    );
  }

  const fallback = fallbackBrands[normalizedName] ?? { background: "#334155", color: "#FFFFFF", label: name.slice(0, 2).toUpperCase() };

  return (
    <span
      className="grid size-6 shrink-0 place-items-center font-mono text-[0.58rem] font-bold leading-none shadow-sm ring-1 ring-border/70"
      style={{ backgroundColor: fallback.background, color: fallback.color }}
      aria-hidden="true"
    >
      {fallback.label}
    </span>
  );
}
