type SkillCategory = {
  title: string;
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
  evidence: string;
};

type ProjectDefinition = Omit<ProjectItem, "description"> & {
  sourceTitle: string;
};

type ProofPoint = {
  label: string;
  value: string;
  detail: string;
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
  socials?: { label: string; href: string }[];
  socialsFromEnv?: { label: string; envKey: string; hrefTemplate?: string }[];
  emailFromEnv?: "CONTACT_EMAIL" | string;
  phoneFromEnv?: "CONTACT_PHONE" | string;
};

export type ResolvedContactInfo = ContactInfo & {
  email?: string;
  phone?: string;
};

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
    impact: "Reduced developer and tester delivery friction by 20% through faster environment comparison and validation.",
    evidence: "Maps to coordinating many environment checks and concurrent API calls without losing correctness or throughput.",
  },
  {
    title: "AT&T Openet Microservices",
    sourceTitle: "AT&T Openet",
    source: "Amdocs / Experienced Software Developer",
    category: "Charging",
    tags: ["Java", "Kafka", "Kubernetes", "Cassandra", "Redis"],
    labHref: "/labs?lab=distributed",
    labLabel: "Distributed Consensus Lab",
    impact: "Processed charging/accounting events for 100M+ subscribers with 1M+ events/sec throughput targets.",
    evidence: "Maps to distributed event ordering, fault tolerance, and convergence across high-volume charging services.",
  },
  {
    title: "Metro By T-Mobile Platform",
    sourceTitle: "Metro By T-Mobile",
    source: "Amdocs / Experienced Software Developer",
    category: "Telecom Enterprise",
    tags: ["Java", "Angular.js", "Kafka", "Jenkins", "Kubernetes"],
    labHref: "/labs?lab=telecom",
    labLabel: "Telecom Core Simulator",
    impact: "Improved service adoption and integration speed during a post-acquisition platform migration.",
    evidence: "Maps to access, orchestration, events, persistence, and billing paths in telecom service flows.",
  },
  {
    title: "TMO Digital Billing Aggregation",
    sourceTitle: "TMO DGB",
    source: "Amdocs / Software Developer",
    category: "Telecom Enterprise",
    tags: ["Java", "Spring Boot", "Kafka", "Redis", "GitLab CI", "Kubernetes"],
    labHref: "/labs?lab=patterns",
    labLabel: "Design Patterns Machine",
    impact: "Aggregated 5M+ daily billing records for 40M+ subscribers while improving data sync speed by 50%.",
    evidence: "Maps to adapter, observer, and boundary patterns used when bridging legacy SOA and new billing systems.",
  },
  {
    title: "NorthStar Ordering Modernization",
    sourceTitle: "NorthStar",
    source: "Amdocs / Software Developer",
    category: "Performance Engineering",
    tags: ["Java", "Spring Boot", "Kafka", "Camunda", "Couchbase", "PostgreSQL"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact: "Supported high-volume enterprise ordering, 99.99% uptime goals, and 4x order throughput improvement.",
    evidence: "Maps to async processing, work queues, bounded parallelism, and throughput tradeoffs in ordering workflows.",
  },
  {
    title: "Media Multiprocessing Service",
    sourceTitle: "Multiprocessing",
    source: "Dubdub.ai / Backend Intern",
    category: "Performance Engineering",
    tags: ["Python", "Flask", "FFmpeg", "Multiprocessing"],
    labHref: "/labs?lab=concurrency",
    labLabel: "Concurrency Race Visualizer",
    impact: "Increased throughput by approx. 300% for high-volume daily media processing workloads.",
    evidence: "Maps to multiprocessing, worker isolation, and throughput tradeoffs from the media-processing optimization.",
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
    evidence: "Maps to ingestion, storage, batching, and data-access tradeoffs in a training-data pipeline.",
  },
  {
    title: "Usage-Based Monetization Service",
    sourceTitle: "Gamify",
    source: "Dubdub.ai / Backend Intern",
    category: "Charging",
    tags: ["Python", "Flask", "AWS", "Docker", "ER/UML"],
    labHref: "/labs?lab=database",
    labLabel: "Database Systems Lab",
    impact: "Launched an early monetization service that helped drive $200K initial revenue and faster go-to-market.",
    evidence: "Maps to ER modeling, usage records, persistence, and data-access design for billing-facing monetization.",
  },
];

const getExperienceProjectDescription = (title: string) => {
  const project = experience
    .flatMap((item) => item.projects)
    .find((item) => item.title === title);

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
  proofPoints: [
    {
      label: "current",
      value: "Amdocs, India",
      detail: "Shipping enterprise telecom systems and internal platform tooling.",
    },
    {
      label: "scale",
      value: "100M+ subscribers",
      detail: "Charging, billing, and service access flows across telecom programs.",
    },
    {
      label: "stack",
      value: "Java + React + Kafka + Kubernetes",
      detail: "Spring Boot services, distributed data systems, and Reactive systems.",
    },
  ] as ProofPoint[],
  skills: [
    {
      title: "Backend & testing",
      items: ["Java", "Spring Boot", "Python", "Flask", "JUnit", "Mockito", "Test NG", "Postman"],
    },
    {
      title: "Data & systems",
      items: ["Kafka", "Redis", "Cassandra DB", "Couchbase", "PostgreSQL", "SQL & NoSQL DBs", "DSA", "OOP", "Operating Systems", "Computer Networks"],
    },
    {
      title: "Cloud & delivery",
      items: ["Kubernetes", "Docker", "GitLab CI", "Jenkins", "Vault", "AWS", "Azure"],
    },
    {
      title: "Frontend",
      items: ["React.js", "Angular.js", "JavaScript", "TypeScript", "Three.js"],
    },
  ] as SkillCategory[],
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
  ] as EducationItem[],
  projects,
  contact: {
    location: "Pune, MH, India",
    locationHref: "https://www.google.com/maps/search/?api=1&query=Amdocs%20DVCI%20India",
    socialsFromEnv: [
      { label: "GitHub", envKey: "SOCIAL_GITHUB", hrefTemplate: "https://github.com/{value}" },
      { label: "LinkedIn", envKey: "SOCIAL_LINKEDIN", hrefTemplate: "https://www.linkedin.com/in/{value}" },
      { label: "LeetCode", envKey: "SOCIAL_LEETCODE", hrefTemplate: "https://leetcode.com/u/{value}" },
    ],
    emailFromEnv: "CONTACT_EMAIL",
    phoneFromEnv: "CONTACT_PHONE",
  } as ResolvedContactInfo,
};
