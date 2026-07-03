import {
  siAngular,
  siApachecassandra,
  siApachekafka,
  siApachespark,
  siCamunda,
  siCouchbase,
  siDocker,
  siFfmpeg,
  siFlask,
  siGitlab,
  siGoogle,
  siGrafana,
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

type FallbackIcon =
  | "api-key"
  | "api-route"
  | "aws-smile"
  | "azure-a"
  | "binary-tree"
  | "chat"
  | "chip"
  | "cloud"
  | "cloud-bolt"
  | "code"
  | "compass"
  | "cycle"
  | "database"
  | "flag"
  | "globe"
  | "layers"
  | "lightbulb"
  | "network"
  | "nodes"
  | "objects"
  | "people"
  | "s3-bucket"
  | "service-mesh"
  | "shield"
  | "test-check"
  | "test-tube"
  | "workflow";

type FallbackBrand = {
  background: string;
  color: string;
  icon: FallbackIcon;
  title: string;
};

const brandIcons: Record<string, SimpleIconShape> = {
  angularjs: siAngular,
  apachespark: siApachespark,
  camunda: siCamunda,
  cassandra: siApachecassandra,
  cassandradb: siApachecassandra,
  couchbase: siCouchbase,
  docker: siDocker,
  ffmpeg: siFfmpeg,
  flask: siFlask,
  gitlab: siGitlab,
  gitlabci: siGitlab,
  grafana: siGrafana,
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

const fallbackBrands: Record<string, FallbackBrand> = {
  agile: { background: "#0D9488", color: "#FFFFFF", icon: "cycle", title: "Agile" },
  aws: { background: "#232F3E", color: "#FF9900", icon: "aws-smile", title: "AWS" },
  awsec2: { background: "#ED7100", color: "#FFFFFF", icon: "chip", title: "AWS EC2" },
  awss3: { background: "#569A31", color: "#FFFFFF", icon: "s3-bucket", title: "AWS S3" },
  azure: { background: "#0078D4", color: "#FFFFFF", icon: "azure-a", title: "Azure" },
  cdn: { background: "#2563EB", color: "#FFFFFF", icon: "globe", title: "CDN" },
  collaboration: { background: "#0891B2", color: "#FFFFFF", icon: "people", title: "Collaboration" },
  communication: { background: "#0EA5E9", color: "#0F172A", icon: "chat", title: "Communication" },
  computerarchitecture: {
    background: "#B45309",
    color: "#FFFFFF",
    icon: "layers",
    title: "Computer Architecture",
  },
  computernetworks: {
    background: "#0EA5E9",
    color: "#0F172A",
    icon: "network",
    title: "Computer Networks",
  },
  dbms: { background: "#0891B2", color: "#FFFFFF", icon: "database", title: "DBMS" },
  "design&analysisofalgorithms": {
    background: "#BE185D",
    color: "#FFFFFF",
    icon: "binary-tree",
    title: "Design & Analysis of Algorithms",
  },
  distributedsystems: {
    background: "#6366F1",
    color: "#FFFFFF",
    icon: "nodes",
    title: "Distributed Systems",
  },
  dns: { background: "#10B981", color: "#0F172A", icon: "network", title: "DNS" },
  dsa: { background: "#7C3AED", color: "#FFFFFF", icon: "binary-tree", title: "DSA" },
  edge: { background: "#F59E0B", color: "#0F172A", icon: "cloud-bolt", title: "Edge" },
  eruml: { background: "#8B5CF6", color: "#FFFFFF", icon: "objects", title: "ER/UML" },
  googleapi: {
    background: `#${siGoogle.hex}`,
    color: "#FFFFFF",
    icon: "api-key",
    title: "Google API",
  },
  javascript: { background: "#F7DF1E", color: "#111827", icon: "code", title: "JavaScript" },
  mentoring: { background: "#7C3AED", color: "#FFFFFF", icon: "compass", title: "Mentoring" },
  microservices: {
    background: "#14B8A6",
    color: "#0F172A",
    icon: "service-mesh",
    title: "Microservices",
  },
  mockito: { background: "#5BAF3A", color: "#0F172A", icon: "test-tube", title: "Mockito" },
  multiprocessing: {
    background: "#6366F1",
    color: "#FFFFFF",
    icon: "chip",
    title: "Multiprocessing",
  },
  oop: { background: "#F97316", color: "#111827", icon: "objects", title: "OOP" },
  operatingsystems: {
    background: "#64748B",
    color: "#FFFFFF",
    icon: "chip",
    title: "Operating Systems",
  },
  ownership: { background: "#B45309", color: "#FFFFFF", icon: "shield", title: "Ownership" },
  problemsolving: { background: "#BE185D", color: "#FFFFFF", icon: "lightbulb", title: "Problem-solving" },
  restapis: { background: "#06B6D4", color: "#0F172A", icon: "api-route", title: "REST APIs" },
  scrum: { background: "#6366F1", color: "#FFFFFF", icon: "flag", title: "Scrum" },
  softwareengineering: {
    background: "#0D9488",
    color: "#FFFFFF",
    icon: "workflow",
    title: "Software Engineering",
  },
  sparksql: { background: "#E25A1C", color: "#FFFFFF", icon: "database", title: "Spark SQL" },
  "sql&nosqldbs": {
    background: "#336791",
    color: "#FFFFFF",
    icon: "database",
    title: "SQL & NoSQL DBs",
  },
  testng: { background: "#DC2626", color: "#FFFFFF", icon: "test-check", title: "TestNG" },
  theoryofcomputation: {
    background: "#9333EA",
    color: "#FFFFFF",
    icon: "service-mesh",
    title: "Theory of Computation",
  },
};

const normalizeTechnologyName = (name: string) => name.toLowerCase().replace(/[^a-z0-9&]/g, "");

const createDefaultFallbackBrand = (name: string): FallbackBrand => ({
  background: "#334155",
  color: "#FFFFFF",
  icon: "code",
  title: name,
});

function FallbackTechnologyIcon({ icon }: { icon: FallbackIcon }) {
  switch (icon) {
    case "api-key":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="7" cy="12" r="3" />
          <path d="M10 12h8" />
          <path d="M15 12v3" />
          <path d="M18 12v-2" />
        </svg>
      );
    case "api-route":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 7h8" />
          <path d="m10 4 3 3-3 3" />
          <path d="M19 17h-8" />
          <path d="m14 14-3 3 3 3" />
          <path d="M7 12h10" />
        </svg>
      );
    case "aws-smile":
      // AWS "smile" swoosh with an arrowhead at its right tip.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 13c4.2 3.2 11.8 3.2 16 0" />
          <path d="m14.6 15.1 3.5-1.1-.8 3.6" />
        </svg>
      );
    case "azure-a":
      // Azure "A" lettermark.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 19 12 5l6 14" />
          <path d="M8.7 14.2h6.6" />
        </svg>
      );
    case "s3-bucket":
      // S3 storage bucket: tapered body with a rim.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5.5 7.5h13l-1.3 11.6a1.3 1.3 0 0 1-1.3 1.1H8.1a1.3 1.3 0 0 1-1.3-1.1L5.5 7.5Z" />
          <path d="M4 7.5c0-1.4 3.6-2.4 8-2.4s8 1 8 2.4" />
        </svg>
      );
    case "binary-tree":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M11.2 6.8 7.8 15.2" />
          <path d="m12.8 6.8 3.4 8.4" />
        </svg>
      );
    case "chip":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3" />
        </svg>
      );
    case "cloud":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 18h10a4 4 0 0 0 .6-8A6.4 6.4 0 0 0 5.2 8.7 4.7 4.7 0 0 0 7 18Z" />
          <path d="M12 13v5" />
          <path d="m9.5 15.5 2.5-2.5 2.5 2.5" />
        </svg>
      );
    case "cloud-bolt":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 18h10a4 4 0 0 0 .6-8A6.4 6.4 0 0 0 5.2 8.7 4.7 4.7 0 0 0 7 18Z" />
          <path d="m13 9-3 5h4l-2 4 5-7h-4l1-2" />
        </svg>
      );
    case "code":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m8 9-3 3 3 3" />
          <path d="m16 9 3 3-3 3" />
          <path d="m14 5-4 14" />
        </svg>
      );
    case "database":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <ellipse cx="12" cy="6" rx="6" ry="3" />
          <path d="M6 6v6c0 1.7 2.7 3 6 3s6-1.3 6-3V6" />
          <path d="M6 12v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
        </svg>
      );
    case "globe":
      // Globe with an equator and one meridian — edge/CDN reach.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17" />
          <path d="M12 3.5c2.5 2.4 3.8 5.4 3.8 8.5S14.5 18.1 12 20.5c-2.5-2.4-3.8-5.4-3.8-8.5S9.5 5.9 12 3.5Z" />
        </svg>
      );
    case "layers":
      // Stacked plates — architectural layers.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
          <path d="m3.5 12 8.5 4.5 8.5-4.5" />
          <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
        </svg>
      );
    case "network":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="19" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="m7 11 3.3-3.5M13.7 7.5 17 11M17 13l-3.3 3.5M10.3 16.5 7 13" />
        </svg>
      );
    case "nodes":
      // Three peer nodes joined in a ring — distributed systems.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="5" cy="6.5" r="2.2" />
          <circle cx="19" cy="6.5" r="2.2" />
          <circle cx="12" cy="18" r="2.2" />
          <path d="M7.2 6.5h9.6M6.4 8.4 10.5 16M17.6 8.4 13.5 16" />
        </svg>
      );
    case "objects":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="5" y="5" width="9" height="9" rx="2" />
          <rect x="10" y="10" width="9" height="9" rx="2" />
          <path d="M8 9h3M13 14h3" />
        </svg>
      );
    case "service-mesh":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="9" y="14" width="6" height="6" rx="1.5" />
          <path d="M10 7h4M8.5 10l2 4M15.5 10l-2 4" />
        </svg>
      );
    case "test-check":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <path d="M9 4h6" />
          <path d="m9 13 2 2 4-5" />
        </svg>
      );
    case "test-tube":
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 2h4" />
          <path d="M11 2v6.5L6.5 17a3.5 3.5 0 0 0 3.1 5h4.8a3.5 3.5 0 0 0 3.1-5L13 8.5V2" />
          <path d="M8.5 15h7" />
        </svg>
      );
    case "chat":
      // Speech bubble with a tail — communication.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v7a1.5 1.5 0 0 1-1.5 1.5h-8L7 19.5v-3H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5Z" />
          <path d="M7.5 9.5h9M7.5 12.5h5" />
        </svg>
      );
    case "compass":
      // Compass with a needle — guidance / mentoring.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z" />
        </svg>
      );
    case "cycle":
      // Two curved arrows in a loop — iterative / Agile cadence.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.8 10.5a7 7 0 0 1 12-4" />
          <path d="M17 3v3.8h-3.8" />
          <path d="M19.2 13.5a7 7 0 0 1-12 4" />
          <path d="M7 21v-3.8h3.8" />
        </svg>
      );
    case "flag":
      // Pennant on a pole — a sprint marker / goal.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 21V4" />
          <path d="M6 4.5h11l-2.4 3.5L17 11.5H6" />
        </svg>
      );
    case "lightbulb":
      // Bulb with a screw base — an idea / problem solved.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9.2 16.5a6 6 0 1 1 5.6 0" />
          <path d="M9.5 16.5h5" />
          <path d="M10 19.5h4" />
        </svg>
      );
    case "people":
      // Two figures — collaboration.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.2 19a5.8 5.8 0 0 1 11.6 0" />
          <path d="M16.2 5.4a3.2 3.2 0 0 1 0 5.9" />
          <path d="M17.5 13.4a5.8 5.8 0 0 1 3.3 5.6" />
        </svg>
      );
    case "shield":
      // Shield with a check — ownership / accountability.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3.5 19 6v5.2c0 4.3-3 7.4-7 8.8-4-1.4-7-4.5-7-8.8V6Z" />
          <path d="m9.2 12 2 2 3.6-4" />
        </svg>
      );
    case "workflow":
      // Two stages joined by an elbow connector — software process/lifecycle.
      return (
        <svg
          viewBox="0 0 24 24"
          className="size-[1.05rem]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="7" height="5.5" rx="1.5" />
          <rect x="13.5" y="15" width="7" height="5.5" rx="1.5" />
          <path d="M7 9v4a3 3 0 0 0 3 3h3.5" />
        </svg>
      );
  }
}

export default function BrandTechnologyIcon({ name }: BrandTechnologyIconProps) {
  const normalizedName = normalizeTechnologyName(name);
  const icon = brandIcons[normalizedName];

  if (icon) {
    return (
      <span
        className="grid size-6 shrink-0 place-items-center bg-white shadow-sm ring-1 ring-border/70"
        title={icon.title}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-[1.125rem]"
          fill={`#${icon.hex}`}
          aria-hidden="true"
        >
          <path d={icon.path} />
        </svg>
      </span>
    );
  }

  const fallback = fallbackBrands[normalizedName] ?? createDefaultFallbackBrand(name);

  return (
    <span
      className="grid size-6 shrink-0 place-items-center shadow-sm ring-1 ring-border/70"
      style={{ backgroundColor: fallback.background, color: fallback.color }}
      title={fallback.title}
      aria-hidden="true"
    >
      <FallbackTechnologyIcon icon={fallback.icon} />
    </span>
  );
}
