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
    role: "Experienced Software Developer",
    company: "Amdocs",
    period: "07/2025 - Present",
    location: "Pune, MH, India",
    projects: [
      {
        title: "ADS Reporting",
        description:
          "Engineered ADS (Active Data Store) Reporting — a YAML-configured Apache Spark job in Java on Kubernetes cron — that transforms ~5TB/day of write-optimized DataStax Enterprise Cassandra data into read-ready Grafana reports, now expanding across AT&T charging and usage tables for 100M+ subscribers.",
      },
      {
        title: "Production Deployment Tool",
        description:
          "Created an internal dashboard (Java Spring Boot, Fabric8, GitLab REST API, React.js, Vault) for feature testing, handling environment comparisons, changes, and caching across ~500 concurrent API calls and cutting testing and delivery time 20%.",
      },
      {
        title: "AT&T Openet",
        description:
          "Shipped Openet CHF-CGF services (Java Spring Boot, Kafka, Redis, Cassandra DB, Kubernetes) that process accounting events from AT&T Network Access Servers, powering real-time charging for 100M+ subscribers' data and talk usage at 1M+ events/sec with 99.99% accuracy.",
      },
      {
        title: "Metro By T-Mobile",
        description:
          "Delivered web-app services (Java Spring Boot, Kafka, Angular.js, Jenkins, Kubernetes) to 20M+ Metro brand users after the T-Mobile post-acquisition migration, lifting adoption 15% and cutting service-integration time 40%.",
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
          "Bridged T-Mobile's legacy SOA to new digital-billing systems with Java Spring Boot, Kafka, Redis, Vault, GitLab CI/CD, and Kubernetes, aggregating 5M+ daily records for 40M+ subscribers at 99.9% reliability and 50% faster data sync.",
      },
      {
        title: "NorthStar",
        description:
          "Modernized T-Mobile's ordering platform, replacing legacy SOA with Java Spring Boot, Kafka, Camunda, Couchbase, PostgreSQL, and Kubernetes services for 5M+ enterprise subscribers; delivered 99.99% uptime with async processing, shipped 100+ features/fixes, cut deployment time 30%, and raised order throughput 4x.",
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
          "Optimized a core media service with Python multiprocessing across Flask/FFmpeg, partitioning tasks over threads to scale throughput ~300% for 10K+ daily media jobs.",
      },
      {
        title: "Training Pipeline",
        description:
          "Automated an ML data pipeline (Python Flask, Google API client, AWS S3/EC2, Docker) that ingests 1000+ records daily from Google Sheets, cutting data-prep time 70% and speeding model-training cycles 50%.",
      },
      {
        title: "Gamify",
        description:
          "Launched the company's first usage-based monetization service (Python Flask on AWS/Docker), modeling the schema with ER/UML diagrams and billing early adopters to drive $200K initial revenue and 35% faster go-to-market.",
      },
    ],
  },
];

const projectDefinitions: ProjectDefinition[] = [
  {
    title: "ADS (Active Data Store) Reporting",
    sourceTitle: "ADS Reporting",
    source: "Amdocs / Experienced Software Developer",
    category: "Data & Analytics",
    tags: ["Java", "Apache Spark", "Spark SQL", "Cassandra", "Grafana"],
    labHref: "/labs?lab=database",
    labLabel: "Database Systems Lab",
    impact:
      "Turns write-optimized ~5TB/day Cassandra data into read-ready daily and weekly reports in Grafana—now extending to AT&T charging and usage tables for 100M+ subscribers.",
    visualKind: "reporting",
  },
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
  // Keyword-rich professional summary. Leads the résumé PDF and the in-OS Resume app; written
  // to read naturally while surfacing the terms ATS keyword scans look for.
  summary:
    "Software developer with 3+ years building backend and platform services for distributed, carrier-scale systems. At Amdocs, ships Java and Spring Boot microservices with Kafka, Kubernetes, Cassandra, Redis, and Apache Spark — powering charging, billing, ordering, and reporting for 100M+ subscribers at up to 1M+ events/sec with 99.99% uptime targets. Comfortable across the stack with React and TypeScript, focused on reliability, throughput, and clean CI/CD delivery.",
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
    { label: "usage records", value: "5B+", note: "charging & usage events" },
  ] satisfies TelemetryReading[],
  skills: [
    {
      title: "Application",
      short: "App",
      summary: "Backend services, the interfaces on top, and the tests that keep them honest.",
      items: [
        "Java",
        "Spring Boot",
        "Python",
        "Flask",
        "React.js",
        "Angular.js",
        "JavaScript",
        "TypeScript",
        "Three.js",
        "JUnit",
        "Mockito",
        "Test NG",
        "Postman",
      ],
    },
    {
      title: "Data Systems",
      short: "Data",
      summary: "Event flows, storage tradeoffs, and read/write paths at scale.",
      items: [
        "Kafka",
        "Apache Spark",
        "Spark SQL",
        "Redis",
        "Cassandra DB",
        "Couchbase",
        "PostgreSQL",
        "SQL & NoSQL DBs",
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
        "GitLab CI",
        "Jenkins",
        "Vault",
        "AWS",
        "Azure",
        "CDN",
        "Edge",
        "DNS",
      ],
    },
    {
      title: "Foundation",
      short: "Core",
      summary: "The coursework fundamentals under the tooling.",
      items: [
        "DSA",
        "Design & Analysis of Algorithms",
        "OOP",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "Computer Architecture",
        "Distributed Systems",
        "Theory of Computation",
        "Software Engineering",
      ],
    },
    {
      title: "Ways of Working",
      short: "Team",
      summary: "How I partner across teams and keep delivery reliable.",
      items: ["Collaboration", "Communication", "Ownership", "Mentoring", "Problem-solving"],
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
