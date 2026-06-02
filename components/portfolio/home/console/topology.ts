import { resume } from "@/lib/resume";

type Project = (typeof resume.projects)[number];

/** Fixed coordinate space the desktop schematic is authored in (scaled responsively). */
export const TOPO_CANVAS = { width: 1000, height: 470 } as const;

export type PipelineStage = {
  id: string;
  label: string;
  kicker: string;
  /** Lane center x in TOPO_CANVAS space. */
  x: number;
};

export type ServiceNode = {
  id: string;
  /** Exact title in resume.projects to resolve the full record. */
  projectTitle: string;
  /** Short label shown on the node. */
  label: string;
  /** Short headline figure for the node chip. */
  metric: string;
  stageId: string;
  x: number;
  y: number;
};

export type TopoEdge = [string, string];

// A request/data path through the kinds of systems represented here: it enters at the edge,
// is processed, persisted, and delivered. Each node is a real project exemplifying that stage;
// the edges show the canonical pipeline, not literal integrations between separate employers.
export const STAGES: PipelineStage[] = [
  { id: "ingest", label: "Ingest", kicker: "edge // intake", x: 130 },
  { id: "process", label: "Process", kicker: "compute core", x: 390 },
  { id: "store", label: "Store", kicker: "data // ledger", x: 645 },
  { id: "deliver", label: "Deliver", kicker: "delivery // tooling", x: 895 },
];

const ROW_TOP = 165;
const ROW_BOTTOM = 330;

export const SERVICE_NODES: ServiceNode[] = [
  {
    id: "openet",
    projectTitle: "AT&T Openet Microservices",
    label: "Openet",
    metric: "1M+/s",
    stageId: "ingest",
    x: 130,
    y: ROW_TOP,
  },
  {
    id: "ml-pipeline",
    projectTitle: "ML Training Data Pipeline",
    label: "ML Pipeline",
    metric: "-70% prep",
    stageId: "ingest",
    x: 130,
    y: ROW_BOTTOM,
  },
  {
    id: "northstar",
    projectTitle: "NorthStar Ordering Modernization",
    label: "NorthStar",
    metric: "4x",
    stageId: "process",
    x: 390,
    y: ROW_TOP,
  },
  {
    id: "media",
    projectTitle: "Media Multiprocessing Service",
    label: "Media",
    metric: "+300%",
    stageId: "process",
    x: 390,
    y: ROW_BOTTOM,
  },
  {
    id: "billing",
    projectTitle: "TMO Digital Billing Aggregation",
    label: "Billing",
    metric: "5M+/day",
    stageId: "store",
    x: 645,
    y: ROW_TOP,
  },
  {
    id: "monetization",
    projectTitle: "Usage-Based Monetization Service",
    label: "Monetization",
    metric: "$200K",
    stageId: "store",
    x: 645,
    y: ROW_BOTTOM,
  },
  {
    id: "metro",
    projectTitle: "Metro By T-Mobile Platform",
    label: "Metro",
    metric: "100M+ scale",
    stageId: "deliver",
    x: 895,
    y: ROW_TOP,
  },
  {
    id: "deploy",
    projectTitle: "Production Deployment Tool",
    label: "Deploy Tool",
    metric: "-20% friction",
    stageId: "deliver",
    x: 895,
    y: ROW_BOTTOM,
  },
];

// Left-to-right DAG forming a readable pipeline without implying false cross-system links.
export const TOPO_EDGES: TopoEdge[] = [
  ["openet", "northstar"],
  ["openet", "media"],
  ["ml-pipeline", "northstar"],
  ["northstar", "billing"],
  ["media", "monetization"],
  ["northstar", "monetization"],
  ["billing", "metro"],
  ["monetization", "deploy"],
  ["billing", "deploy"],
];

const projectByTitle = new Map(resume.projects.map((project) => [project.title, project]));

export function getServiceProject(node: ServiceNode): Project {
  const project = projectByTitle.get(node.projectTitle);
  if (!project) {
    throw new Error(`Topology node references unknown project: ${node.projectTitle}`);
  }
  return project;
}

export const nodeById = new Map(SERVICE_NODES.map((node) => [node.id, node]));
export const stageById = new Map(STAGES.map((stage) => [stage.id, stage]));
