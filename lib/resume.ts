export type ProjectVisualKind =
  | "deployment"
  | "charging"
  | "telecom"
  | "billing"
  | "ordering"
  | "media"
  | "pipeline"
  | "monetization"
  | "system";

type SkillCategory = {
  title: string;
  /** Short label for compact UIs (e.g. the Activity app's tab strip). */
  short?: string;
  summary: string;
  items: string[];
};

type ExperienceProject = {
  title: string;
  description: string;
};

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  projects: ExperienceProject[];
};

type ProjectItem = {
  title: string;
  source: string;
  impact: string;
  description: string;
  category: string;
  tags: string[];
  labHref: string;
  labLabel: string;
  visualKind: ProjectVisualKind;
};

type ProjectDefinition = Omit<ProjectItem, "description"> & {
  sourceTitle: string;
};

type ProofPoint = {
  label: string;
  value: string;
};

type Availability = {
  /** When true, the "open to roles" banner is shown across the OS. Flip to hide it. */
  open: boolean;
  /** Short status line, e.g. "Open to new roles". */
  label: string;
  /** Supporting detail: the kind of role and where, e.g. "Backend · Remote or Pune". */
  detail: string;
};

type TelemetryReading = {
  label: string;
  value: string;
  note: string;
};

type EducationItem = {
  degree: string;
  school: string;
  schoolHref: string;
  period: string;
  location: string;
};

type ContactInfo = {
  location: string;
  locationHref?: string;
  email?: string;
  phone?: string;
  socials?: { label: string; href: string }[];
  socialsFromEnv?: { label: string; envKey: string; hrefTemplate?: string }[];
  emailFromEnv?: "CONTACT_EMAIL" | string;
  phoneFromEnv?: "CONTACT_PHONE" | string;
};

export type ResolvedContactInfo = ContactInfo;

const experience: ExperienceItem[] = [
  {
    role: "Experienced Software Developer",
    company: "Amdocs",
    period: "07/2025 - Current",
    location: "Pune, MH, India",
    projects: [
      {
        title: "Production Deployment Tool",
        description:
          "Developed internal dashboard tool using Java Spring Boot, Fabric8, GitLab REST API, React.js, and Vault to streamline feature testing. Enabled environment comparisons, changes, and caching for ~500 concurrent API calls—saving developers and testers 20% of testing/delivery time.",
      },
      {
        title: "AT&T Openet",
        description:
          "Developed Openet CHF-CGF microservices using Java Spring Boot, Redis, Cassandra DB, Kubernetes, and Kafka to process accounting events from AT&T Network Access Servers. Enabled real-time charging for 100M+ subscribers' data/talk time usage—scaling to 1M+ events/sec with 99.99% accuracy.",
      },
      {
        title: "Metro By T-Mobile",
        description:
          "Built microservices web apps using Java Spring Boot, Kafka, Angular.js, Git, Jenkins, and Kubernetes to deliver existing services to 20M+ Metro brand users post-acquisition. Orchestrated seamless, user-friendly access—boosting adoption by 15% and cutting service integration time by 40%.",
      },
    ],
  },
  {
    role: "Software Developer",
    company: "Amdocs",
    period: "07/2023 - 06/2025",
    location: "Pune, MH, India",
    projects: [
      {
        title: "TMO DGB",
        description:
          "Built Digital Billing aggregation microservices for T-Mobile using Java Spring Boot, Kafka, Redis, Vault, Git, GitLab CI/CD, and Kubernetes. Bridged legacy SOA to new billing systems for 40M+ subscribers—aggregating 5M+ daily records with 99.9% reliability and 50% faster data sync.",
      },
      {
        title: "NorthStar",
        description:
          "T-Mobile modernization project replaced legacy SOA with Java Spring Boot, Kafka, Camunda, Couchbase, PostgreSQL, Git, Jenkins, and Kubernetes microservices—adding high-volume ordering for 5M+ enterprise subscribers. Delivered 99.99% uptime, rolling updates, and async processing; contributed to 100+ features/fixes, cutting deployment time 30% and boosting order throughput 4x.",
      },
    ],
  },
  {
    role: "Backend Intern",
    company: "Dubdub.ai",
    period: "10/2021 - 01/2022",
    location: "Remote",
    projects: [
      {
        title: "Multiprocessing",
        description:
          "Optimized core platform service with Python multiprocessing in Flask/FFmpeg—strategically partitioning tasks across threads. Accelerated processing proportional to compute resources enabling approx. 300% higher throughput for 10K+ daily media tasks.",
      },
      {
        title: "Training Pipeline",
        description:
          "Built data processing pipeline microservice using Python Flask, Google API client, and AWS S3/EC2, Docker for ML algorithm training. Automated ingestion from Google Sheets—processing 1000+ records daily, cutting prep time 70% and accelerating model training cycles by 50%.",
      },
      {
        title: "Gamify",
        description:
          "Designed and launched inaugural monetization microservice using Python Flask on AWS Docker. Created ER/UML diagrams; enabled usage-based billing for early adopters—driving $200K initial revenue and 35% faster go-to-market.",
      },
    ],
  },
];

const projectDefinitions: ProjectDefinition[] = [
  {
    title: "Production Deployment Tool",
    sourceTitle: "Production Deployment Tool",
    source: "Amdocs / Experienced Software Developer",
    category: "Internal Tooling",
    tags: ["Java", "Spring Boot", "React.js", "Vault", "GitLab"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact:
      "Reduced developer and tester delivery friction by 20% through faster environment comparison and validation.",
    visualKind: "deployment",
  },
  {
    title: "AT&T Openet Microservices",
    sourceTitle: "AT&T Openet",
    source: "Amdocs / Experienced Software Developer",
    category: "Charging",
    tags: ["Java", "Kafka", "Kubernetes", "Cassandra", "Redis"],
    labHref: "/labs?lab=distributed",
    labLabel: "Distributed Consensus Lab",
    impact:
      "Processed charging/accounting events for 100M+ subscribers with 1M+ events/sec throughput targets.",
    visualKind: "charging",
  },
  {
    title: "Metro By T-Mobile Platform",
    sourceTitle: "Metro By T-Mobile",
    source: "Amdocs / Experienced Software Developer",
    category: "Telecom Enterprise",
    tags: ["Java", "Angular.js", "Kafka", "Jenkins", "Kubernetes"],
    labHref: "/labs?lab=telecom",
    labLabel: "Telecom Core Simulator",
    impact:
      "Improved service adoption and integration speed during a post-acquisition platform migration.",
    visualKind: "telecom",
  },
  {
    title: "TMO Digital Billing Aggregation",
    sourceTitle: "TMO DGB",
    source: "Amdocs / Software Developer",
    category: "Telecom Enterprise",
    tags: ["Java", "Spring Boot", "Kafka", "Redis", "GitLab CI", "Kubernetes"],
    labHref: "/labs?lab=patterns",
    labLabel: "Design Patterns Machine",
    impact:
      "Aggregated 5M+ daily billing records for 40M+ subscribers while improving data sync speed by 50%.",
    visualKind: "billing",
  },
  {
    title: "NorthStar Ordering Modernization",
    sourceTitle: "NorthStar",
    source: "Amdocs / Software Developer",
    category: "Performance Engineering",
    tags: ["Java", "Spring Boot", "Kafka", "Camunda", "Couchbase", "PostgreSQL"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact:
      "Supported high-volume enterprise ordering, 99.99% uptime goals, and 4x order throughput improvement.",
    visualKind: "ordering",
  },
  {
    title: "Media Multiprocessing Service",
    sourceTitle: "Multiprocessing",
    source: "Dubdub.ai / Backend Intern",
    category: "Performance Engineering",
    tags: ["Python", "Flask", "FFmpeg", "Multiprocessing"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact:
      "Increased throughput by approx. 300% for high-volume daily media processing workloads.",
    visualKind: "media",
  },
  {
    title: "ML Training Data Pipeline",
    sourceTitle: "Training Pipeline",
    source: "Dubdub.ai / Backend Intern",
    category: "Internal Tooling",
    tags: ["Python", "Flask", "Google API", "AWS S3", "AWS EC2", "Docker"],
    labHref: "/labs?lab=database",
    labLabel: "Database Systems Lab",
    impact: "Automated ingestion for 1000+ daily records and cut model preparation time by 70%.",
    visualKind: "pipeline",
  },
  {
    title: "Usage-Based Monetization Service",
    sourceTitle: "Gamify",
    source: "Dubdub.ai / Backend Intern",
    category: "Charging",
    tags: ["Python", "Flask", "AWS", "Docker", "ER/UML"],
    labHref: "/labs?lab=database",
    labLabel: "Database Systems Lab",
    impact:
      "Launched an early monetization service that helped drive $200K initial revenue and faster go-to-market.",
    visualKind: "monetization",
  },
];

const getExperienceProjectDescription = (title: string) => {
  const project = experience.flatMap((item) => item.projects).find((item) => item.title === title);

  if (!project) {
    throw new Error(`Project source not found: ${title}`);
  }

  return project.description;
};

const projects: ProjectItem[] = projectDefinitions.map(({ sourceTitle, ...project }) => ({
  ...project,
  description: getExperienceProjectDescription(sourceTitle),
}));

export const resume = {
  name: "Amandeep Yadav",
  title: "Software Developer",
  focus: "Backend, Frontend, and platform tooling for distributed systems",
  // Recruiter-facing signal of intent. Edit `open` to false to hide the banner everywhere.
  availability: {
    open: true,
    label: "Open to new roles",
    detail: "Backend & platform engineering · Remote or Pune, India",
  } satisfies Availability,
  proofPoints: [
    {
      label: "current",
      value: "Amdocs, India",
    },
    {
      label: "scale",
      value: "100M+ subscribers",
    },
    {
      label: "stack",
      value: "Java + React + Kafka + Kubernetes",
    },
  ] satisfies ProofPoint[],
  // Honest career-peak readouts for the operations console telemetry board (not live data).
  telemetry: [
    { label: "subscribers served", value: "100M+", note: "carrier-scale charging" },
    { label: "peak throughput", value: "1M+/s", note: "rated events" },
    { label: "uptime target", value: "99.99%", note: "ordering + charging" },
    { label: "records / day", value: "5M+", note: "billing aggregation" },
  ] satisfies TelemetryReading[],
  skills: [
    {
      title: "Backend & testing",
      short: "Backend",
      summary: "Service code, API edges, and confidence checks.",
      items: ["Java", "Spring Boot", "Python", "Flask", "JUnit", "Mockito", "Test NG", "Postman"],
    },
    {
      title: "Data & systems",
      short: "Data",
      summary: "Event flows, storage tradeoffs, and fundamentals.",
      items: [
        "Kafka",
        "Redis",
        "Cassandra DB",
        "Couchbase",
        "PostgreSQL",
        "SQL & NoSQL DBs",
        "DSA",
        "OOP",
        "Operating Systems",
        "Computer Networks",
      ],
    },
    {
      title: "Cloud & delivery",
      short: "Cloud",
      summary: "Containers, pipelines, secrets, and release paths.",
      items: ["Kubernetes", "Docker", "GitLab CI", "Jenkins", "Vault", "AWS", "Azure"],
    },
    {
      title: "Frontend",
      short: "Frontend",
      summary: "Readable interfaces for operational systems.",
      items: ["React.js", "Angular.js", "JavaScript", "TypeScript", "Three.js"],
    },
  ] satisfies SkillCategory[],
  experience,
  education: [
    {
      degree: "Master of Computer Applications",
      school: "NIT Trichy",
      schoolHref: "https://en.wikipedia.org/wiki/NIT_Trichy",
      period: "07/2020 - 06/2023",
      location: "Tiruchirappalli, India",
    },
    {
      degree: "Bachelor of Computer Applications",
      school: "University of Rajasthan",
      schoolHref: "https://en.wikipedia.org/wiki/University_of_Rajasthan",
      period: "07/2017 - 06/2020",
      location: "Jaipur, India",
    },
    {
      degree: "Schooling",
      school: "Rashtriya Military School",
      schoolHref: "https://en.wikipedia.org/wiki/Ajmer_Military_School",
      period: "04/2010 - 03/2017",
      location: "Ajmer, India",
    },
  ] satisfies EducationItem[],
  projects,
  contact: {
    location: "Pune, MH, India",
    locationHref: "https://www.google.com/maps/search/?api=1&query=Amdocs%20DVCI%20India",
    socialsFromEnv: [
      { label: "GitHub", envKey: "SOCIAL_GITHUB", hrefTemplate: "https://github.com/{value}" },
      {
        label: "LinkedIn",
        envKey: "SOCIAL_LINKEDIN",
        hrefTemplate: "https://www.linkedin.com/in/{value}",
      },
      {
        label: "LeetCode",
        envKey: "SOCIAL_LEETCODE",
        hrefTemplate: "https://leetcode.com/u/{value}",
      },
    ],
    emailFromEnv: "CONTACT_EMAIL",
    phoneFromEnv: "CONTACT_PHONE",
  } satisfies ContactInfo,
};
