export type ProjectVisualKind =
  | "deployment"
  | "charging"
  | "telecom"
  | "billing"
  | "ordering"
  | "media"
  | "pipeline"
  | "monetization"
  | "system"
  | "reporting";

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
    role: "Software Engineer II",
    company: "Amdocs",
    period: "07/2025 - Present",
    location: "Pune, MH, India",
    projects: [
      {
        title: "AT&T Openet",
        description:
          "Shipped & maintained charging microservices and REST APIs (Java, Spring Boot, Kafka, Cassandra, Redis) on Azure that meter and rate AT&T network usage in real time — part of a 5G charging platform (Openet CHF/CGF) that processes 600K+ records/sec for 100M+ subscribers.",
      },
      {
        title: "ADS Reporting",
        description:
          "Architected & implemented a config-driven Apache Spark job (scheduled on Kubernetes) that turns ~5TB/day of Cassandra data into read-ready Grafana reports, giving support and ops teams daily visibility into AT&T charging and usage.",
      },
      {
        title: "Metro By T-Mobile",
        description:
          "Maintained & enhanced web-app services (Angular.js, HTML, CSS, Jenkins) that kept 20M+ Metro users on full service through T-Mobile's post-acquisition platform migration.",
      },
      {
        title: "Production Deployment Tool",
        description:
          "Created an internal Spring Boot + React.js dashboard (Fabric8, GitLab API, Vault) that compares, upgrades and monitors the QA environments, cutting release time by ~20%.",
      },
    ],
  },
  {
    role: "Software Engineer",
    company: "Amdocs",
    period: "07/2023 - 06/2025",
    location: "Pune, MH, India",
    projects: [
      {
        title: "NorthStar",
        description:
          "Built async, event-driven ordering services (Spring Boot, Kafka, Camunda, Couchbase) with JUnit/Mockito test coverage as T-Mobile's 5G provisioning platform moved off legacy SOA — increasing throughput 4x for 5M+ enterprise subscribers.",
      },
      {
        title: "TMO DGB",
        description:
          "Developed integration services (Spring Boot, Kafka, Redis, GitLab CI/CD) that connect T-Mobile's legacy SOA to the new digital billing platform, helping aggregate 5M+ records a day for 40M+ subscribers.",
      },
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Dubdub.ai",
    period: "10/2021 - 01/2022",
    location: "Remote",
    projects: [
      {
        title: "Multiprocessing",
        description:
          "Parallelized the core media service (Python, Flask, FFmpeg) across processes with multiprocessing, speeding up real-time dubbing turnaround and clearing the job backlog that capped throughput.",
      },
      {
        title: "Training Pipeline",
        description:
          "Automated an ML data pipeline (Python, Flask, Google API, AWS, Docker) that pulls 1K+ records/day from Google Sheets and stages source content in an S3 bucket for model training, cutting data-prep time 70%.",
      },
      {
        title: "Gamify",
        description:
          "Launched the company's first usage-based monetization service (Python, Flask, AWS, Docker), designing the billing schema with ER/UML and charging early adopters to drive $200K in initial revenue.",
      },
    ],
  },
];

const projectDefinitions: ProjectDefinition[] = [
  {
    title: "ADS (Active Data Store) Reporting",
    sourceTitle: "ADS Reporting",
    source: "Amdocs / Software Engineer II",
    category: "Data & Analytics",
    tags: ["Java", "Apache Spark", "Spark SQL", "Cassandra", "Grafana"],
    labHref: "/labs?lab=database",
    labLabel: "Database Systems Lab",
    impact:
      "Turns a write-optimized charging store into analytics the business can actually query, without slowing the production write path.",
    visualKind: "reporting",
  },
  {
    title: "Production Deployment Tool",
    sourceTitle: "Production Deployment Tool",
    source: "Amdocs / Software Engineer II",
    category: "Internal Tooling",
    tags: ["Java", "Spring Boot", "React.js", "Vault", "GitLab"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact:
      "Gave developers and testers one place to compare environments and validate features before release.",
    visualKind: "deployment",
  },
  {
    title: "AT&T Openet Microservices",
    sourceTitle: "AT&T Openet",
    source: "Amdocs / Software Engineer II",
    category: "Charging",
    tags: ["Java", "Kafka", "Kubernetes", "Cassandra", "Redis"],
    labHref: "/labs?lab=distributed",
    labLabel: "Distributed Consensus Lab",
    impact:
      "Real-time 5G charging that feeds AT&T's downstream billing — the revenue-critical path for its subscriber base.",
    visualKind: "charging",
  },
  {
    title: "Metro By T-Mobile Platform",
    sourceTitle: "Metro By T-Mobile",
    source: "Amdocs / Software Engineer II",
    category: "Telecom Enterprise",
    tags: ["Java", "Angular.js", "Kafka", "Jenkins", "Kubernetes"],
    labHref: "/labs?lab=telecom",
    labLabel: "Telecom Core Simulator",
    impact:
      "Protected the Metro customer experience during a risky post-acquisition migration onto T-Mobile's platform.",
    visualKind: "telecom",
  },
  {
    title: "TMO Digital Billing Aggregation",
    sourceTitle: "TMO DGB",
    source: "Amdocs / Software Engineer",
    category: "Telecom Enterprise",
    tags: ["Java", "Spring Boot", "Kafka", "Redis", "GitLab CI", "Kubernetes"],
    labHref: "/labs?lab=patterns",
    labLabel: "Design Patterns Machine",
    impact:
      "Kept T-Mobile's legacy SOA and modern billing systems in sync so digital billing could go live.",
    visualKind: "billing",
  },
  {
    title: "NorthStar Ordering Modernization",
    sourceTitle: "NorthStar",
    source: "Amdocs / Software Engineer",
    category: "Performance Engineering",
    tags: ["Java", "Spring Boot", "Kafka", "Camunda", "Couchbase", "PostgreSQL"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact:
      "Moved enterprise ordering off brittle legacy SOA so high-value orders stop stalling under load.",
    visualKind: "ordering",
  },
  {
    title: "Media Multiprocessing Service",
    sourceTitle: "Multiprocessing",
    source: "Dubdub.ai / Software Engineer Intern",
    category: "Performance Engineering",
    tags: ["Python", "Flask", "FFmpeg", "Multiprocessing"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact:
      "Let the product take on far more customer media jobs a day without the processing backlog that capped growth.",
    visualKind: "media",
  },
  {
    title: "ML Training Data Pipeline",
    sourceTitle: "Training Pipeline",
    source: "Dubdub.ai / Software Engineer Intern",
    category: "Internal Tooling",
    tags: ["Python", "Flask", "Google API", "AWS S3", "AWS EC2", "Docker"],
    labHref: "/labs?lab=database",
    labLabel: "Database Systems Lab",
    impact: "Freed the ML team from manual data prep by automating ingestion end-to-end.",
    visualKind: "pipeline",
  },
  {
    title: "Usage-Based Monetization Service",
    sourceTitle: "Gamify",
    source: "Dubdub.ai / Software Engineer Intern",
    category: "Charging",
    tags: ["Python", "Flask", "AWS", "Docker", "ER/UML"],
    labHref: "/labs?lab=database",
    labLabel: "Database Systems Lab",
    impact:
      "The company's first revenue-generating product line, from billing schema to charging early adopters.",
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
  title: "Backend Software Engineer",
  focus: "Performance engineering for distributed, carrier-scale telecom systems",
  // Keyword-rich professional summary. Leads the résumé PDF and the in-OS Resume app; written
  // to read naturally while surfacing the terms ATS keyword scans look for.
  summary:
    "Software engineer with 3+ years building backend and platform services in Java, Spring Boot, and REST APIs for distributed, carrier-scale telecom systems. At Amdocs, builds services across 5G charging, billing, ordering, and reporting on Kafka, Kubernetes, Cassandra, Redis, and Apache Spark — high-throughput systems that sustain 600K+ charging records/sec, engineered for low latency and reliability. Works full-stack with React and TypeScript in Agile teams, applying object-oriented design and clean CI/CD.",
  proofPoints: [
    {
      label: "scale",
      value: "100M+ subscribers",
    },
    {
      label: "throughput",
      value: "600K+ records/sec",
    },
    {
      label: "stack",
      value: "Java + Spring Boot + Kafka + Spark",
    },
  ] satisfies ProofPoint[],
  // Honest career-peak readouts for the operations console telemetry board (not live data).
  telemetry: [
    { label: "subscribers served", value: "100M+", note: "5G charging scale" },
    { label: "charging records/sec", value: "600K/s", note: "real-time rating" },
    { label: "uptime target", value: "99.999%", note: "ordering + charging" },
    { label: "usage records", value: "~5B/day", note: "charging & usage" },
  ] satisfies TelemetryReading[],
  skills: [
    {
      title: "Application",
      short: "App",
      summary: "Backend services, the interfaces on top, and the tests that keep them honest.",
      items: [
        "Java",
        "Spring Boot",
        "Microservices",
        "REST APIs",
        "Hibernate",
        "Python",
        "Flask",
        "JUnit",
        "Mockito",
        "React.js",
        "TypeScript",
      ],
    },
    {
      title: "Performance & Scale",
      short: "Perf",
      summary: "Making services fast and keeping them up under carrier-scale load.",
      items: [
        "Concurrency",
        "Async / Event-Driven",
        "Caching",
        "Throughput Optimization",
        "Horizontal Scaling",
      ],
    },
    {
      title: "Data Systems",
      short: "Data",
      summary: "Event flows, storage tradeoffs, and read/write paths at scale.",
      items: [
        "Kafka",
        "Apache Spark",
        "Redis",
        "Cassandra DB",
        "Couchbase",
        "PostgreSQL",
        "SQL",
        "Grafana",
      ],
    },
    {
      title: "Cloud & Delivery",
      short: "Cloud",
      summary: "Containers, pipelines, secrets, and how bytes reach the edge.",
      items: [
        "Kubernetes",
        "Docker",
        "Git",
        "Maven",
        "GitLab CI",
        "Jenkins",
        "CI/CD",
        "Vault",
        "AWS",
        "Azure",
      ],
    },
    {
      title: "Foundation",
      short: "Core",
      summary: "The coursework fundamentals under the tooling.",
      items: [
        "DSA",
        "Object-Oriented Design (OOP)",
        "Distributed Systems",
        "DBMS",
        "Operating Systems",
      ],
    },
    {
      title: "Ways of Working",
      short: "Team",
      summary: "How I partner across teams and keep delivery reliable.",
      items: ["Agile", "Scrum", "Collaboration", "Ownership", "Mentoring"],
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
