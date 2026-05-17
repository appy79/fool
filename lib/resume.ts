export type SkillCategory = {
  title: string;
  items: string[];
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
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
  email: string;
  phone: string;
  location: string;
  socials: { label: string; href: string }[];
};

export const resume = {
  name: "Amandeep Yadav",
  title: "Software Developer",
  tagline: "Dynamic Software Developer with a proven track record in microservices, distributed systems, and full-stack product delivery.",
  intro:
    "I build scalable software solutions with Java, JavaScript, and cloud-native architectures. My experience ranges from internal developer tools and telecom platforms to AI dubbing products and college-scale web applications.",
  highlights: [
    "Enterprise microservices architecture",
    "Distributed systems with Kafka and Kubernetes",
    "Agile product delivery and automation",
    "Full-stack engineering from backend to frontend",
  ],
  skills: [
    {
      title: "Programming",
      items: ["Java", "Python", "JavaScript", "C++"],
    },
    {
      title: "Frameworks & Platforms",
      items: ["Spring Boot", "Flask", "Angular.js", "React.js", "Kafka", "Kubernetes"],
    },
    {
      title: "Tools & Practices",
      items: ["Git", "Jenkins", "Bash", "CI/CD", "Docker", "AWS"],
    },
  ] as SkillCategory[],
  experience: [
    {
      role: "Experienced Software Developer",
      company: "Amdocs",
      period: "07/2025 - Current",
      location: "Remote",
      description:
        "Built an internal production deployment tool with Spring Boot, Fabric8, GitLab REST API, React.js, and Vault. The dashboard handled ~500 concurrent API calls and reduced testing effort by 20%.",
    },
    {
      role: "Experienced Software Developer",
      company: "Amdocs",
      period: "07/2023 - 06/2025",
      location: "Remote",
      description:
        "Delivered telecom microservices for Metro by T-Mobile, AT&T Openet, NorthStar modernization, and TMO DGB using Java Spring Boot, Kafka, Camunda, Apache Camel, Couchbase, PostgreSQL, and Kubernetes.",
    },
    {
      role: "Backend Intern",
      company: "DUBDUB.AI",
      period: "10/2021 - 01/2022",
      location: "Remote",
      description:
        "Built monetization and data pipelines in Python Flask for an enterprise dubbing platform, deployed on AWS with Docker and S3 integration.",
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
        "Designed and built an internal dashboard for Amdocs developers to compare testing environments, manage feature deployments, and cache API results for performance.",
      category: "Enterprise",
      tags: ["Java", "Spring Boot", "React.js", "Vault"],
      link: "#contact",
    },
    {
      title: "iNIT Inventory System",
      description:
        "Led development of a college inventory issuance and tracking system using Next.js, Prisma, MySQL, and Material UI for thousands of annual users.",
      category: "Web",
      tags: ["Next.js", "Prisma", "MySQL", "Material UI"],
      link: "#contact",
    },
    {
      title: "NorthStar Modernization",
      description:
        "Developed a high-volume telecom ordering platform with microservices, asynchronous processing, rolling updates, and better operational reliability.",
      category: "Platform",
      tags: ["Kafka", "Kubernetes", "Spring Boot", "PostgreSQL"],
      link: "#contact",
    },
  ] as ProjectItem[],
  contact: {
    email: "CONTACT_EMAIL_REMOVED",
    phone: "CONTACT_PHONE_REMOVED",
    location: "Remote / India",
    socials: [
      { label: "GitHub", href: "https://github.com/appy79" },
      { label: "LinkedIn", href: "https://linkedin.com/in/amandeep-yadav" },
    ],
  } as ContactInfo,
};
