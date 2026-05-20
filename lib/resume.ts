export type SkillCategory = {
  title: string;
  items: string[];
};

export type ExperienceProject = {
  title: string;
  description: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  description?: string;
  projects: ExperienceProject[];
};

export type ProjectItem = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  link: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  location: string;
};

export type ContactInfo = {
  location: string;
  socials?: { label: string; href: string }[];
  socialsFromEnv?: { label: string; envKey: string }[];
  emailFromEnv?: "CONTACT_EMAIL" | string;
  phoneFromEnv?: "CONTACT_PHONE" | string;
};

export type ResolvedContactInfo = ContactInfo & {
  email?: string;
  phone?: string;
};

export const resume = {
  name: "Amandeep Yadav",
  title: "Software Developer",
  intro: "Dynamic Software Developer with a proven track record at Amdocs, skilled in Java, JavaScript, and Agile methodologies. Adept at collaborating with stakeholders to deliver impactful solutions, leveraging first principles thinking, and expertise in microservices architecture to drive various projects to success.",
  highlights: [
    "Microservices architecture and cloud-native delivery",
    "Distributed systems using Kafka, Kubernetes, and container orchestration",
    "Agile product delivery with automation and CI/CD",
    "End-to-end full-stack engineering from backend services to UX-driven frontend",
  ],
  skills: [
    {
      title: "Programming",
      items: ["Java", "Python", "JavaScript", "C++"],
    },
    {
      title: "Frameworks & libraries",
      items: ["Angular.js", "React.js", "Three.js", "Spring Boot", "Flask", "WordPress"],
    },
    {
      title: "Fundamentals",
      items: ["DSA", "OOP", "OS & Kernel", "Virtualization", "SQL & NoSQL DBs", "Computer Architecture", "OSI Model"],
    },
    {
      title: "Cloud & CI",
      items: ["Docker", "AWS", "Azure", "GitLab CI", "Jenkins"],
    },
    {
      title: "Distributed systems",
      items: ["Kafka", "Spark", "Kubernetes", "Cassandra DB", "Redis", "Couchbase"],
    },
    {
      title: "Tools",
      items: ["Git", "Bash", "Jira", "Confluence", "Draw.io"],
    },
    {
      title: "Testing",
      items: ["JUnit", "Postman", "TestNG", "Mockito"],
    },
    {
      title: "Concepts",
      items: ["Microservices architecture", "First principles thinking", "Limits and efficiency of computation"],
    },
    {
      title: "GenAI",
      items: ["Cursor", "Claude", "Copilot", "Comet"],
    },
  ] as SkillCategory[],
  experience: [
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
            "Developed Openet CHF-CGF microservices using Java Spring Boot, Redis, Cassandra DB, Kubernetes, and Kafka to process accounting events from AT&T Network Access Servers. Enabled real-time charging for 50M+ subscribers' data/talk time usage—scaling to 1M+ events/sec with 99.9% accuracy.",
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
      company: "DUBDUB.AI",
      period: "10/2021 - 01/2022",
      location: "Pune, MH, India",
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
  ] as ExperienceItem[],
  education: [
    {
      degree: "Master of Computer Applications",
      school: "NIT Trichy",
      period: "07/2020 - 06/2023",
      location: "Tiruchirappalli, India",
    },
    {
      degree: "Bachelor of Computer Applications",
      school: "University of Rajasthan",
      period: "07/2017 - 06/2020",
      location: "Jaipur, India",
    },
  ] as EducationItem[],
  projects: [
    {
      title: "Production Deployment Tool",
      description:
        "Built an internal dashboard using Java Spring Boot, Fabric8, GitLab REST API, React.js, and Vault to streamline feature testing and environment comparisons for Amdocs developers.",
      category: "Internal Tooling",
      tags: ["Java", "Spring Boot", "React.js", "Vault", "GitLab"],
      link: "#contact",
    },
    {
      title: "AT&T Openet Microservices",
      description:
        "Delivered Openet CHF-CGF microservices with Java Spring Boot, Redis, Cassandra DB, Kubernetes, and Kafka to process accounting events for 50M+ subscribers with 1M+ events/sec reliability.",
      category: "Telecom Enterprise",
      tags: ["Java", "Kafka", "Kubernetes", "Cassandra", "Redis"],
      link: "#contact",
    },
    {
      title: "Metro By T-Mobile Platform",
      description:
        "Built microservices web apps and integration tooling using Java Spring Boot, Kafka, Angular.js, Git, Jenkins, and Kubernetes to support 20M+ users after acquisition.",
      category: "Telecom Enterprise",
      tags: ["Java", "Angular.js", "Kafka", "Jenkins", "Kubernetes"],
      link: "#contact",
    },
  ] as ProjectItem[],
  contact: {
    location: "Remote / India",
    socialsFromEnv: [
      { label: "GitHub", envKey: "SOCIAL_GITHUB" },
      { label: "LinkedIn", envKey: "SOCIAL_LINKEDIN" },
    ],
    emailFromEnv: "CONTACT_EMAIL",
    phoneFromEnv: "CONTACT_PHONE",
  } as ResolvedContactInfo,
};
