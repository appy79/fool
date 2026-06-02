type TechnologyIconProps = {
  name: string;
  className?: string;
};

export default function TechnologyIcon({ name, className = "size-3.5" }: TechnologyIconProps) {
  const normalizedName = name.toLowerCase();
  const iconProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (normalizedName.includes("java") || normalizedName.includes("spring")) {
    return (
      <svg {...iconProps}>
        <path d="M8 17h8a3 3 0 0 0 0-6H9a3 3 0 0 0 0 6Z" />
        <path d="M8 11V7M12 11V5M16 11V7M9 19h6" />
      </svg>
    );
  }

  if (normalizedName.includes("react") || normalizedName.includes("angular") || normalizedName.includes("javascript") || normalizedName.includes("typescript")) {
    return (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 10h8M8 14h5M15 14l1.5 1.5L19 12" />
      </svg>
    );
  }

  if (normalizedName.includes("kafka") || normalizedName.includes("microservice") || normalizedName.includes("rest")) {
    return (
      <svg {...iconProps}>
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8" />
      </svg>
    );
  }

  if (normalizedName.includes("redis") || normalizedName.includes("cassandra") || normalizedName.includes("couchbase") || normalizedName.includes("postgres") || normalizedName.includes("sql") || normalizedName.includes("db")) {
    return (
      <svg {...iconProps}>
        <ellipse cx="12" cy="6" rx="6.5" ry="3" />
        <path d="M5.5 6v6c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3V6" />
        <path d="M5.5 12v6c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-6" />
      </svg>
    );
  }

  if (normalizedName.includes("kubernetes") || normalizedName.includes("docker") || normalizedName.includes("jenkins") || normalizedName.includes("gitlab") || normalizedName.includes("git")) {
    return (
      <svg {...iconProps}>
        <path d="M12 3 4.5 7.5v9L12 21l7.5-4.5v-9L12 3Z" />
        <path d="M12 8v8M8 10.5l8 3M16 10.5l-8 3" />
      </svg>
    );
  }

  if (normalizedName.includes("vault") || normalizedName.includes("postman") || normalizedName.includes("test") || normalizedName.includes("junit") || normalizedName.includes("mockito")) {
    return (
      <svg {...iconProps}>
        <path d="M12 3 5 6v5c0 4.5 2.8 7.6 7 10 4.2-2.4 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }

  if (normalizedName.includes("python") || normalizedName.includes("flask") || normalizedName.includes("ffmpeg") || normalizedName.includes("google api")) {
    return (
      <svg {...iconProps}>
        <path d="M8 4h6a3 3 0 0 1 3 3v3H9a3 3 0 0 0-3 3v1" />
        <path d="M16 20h-6a3 3 0 0 1-3-3v-3h8a3 3 0 0 0 3-3v-1" />
        <path d="M10 7h.01M14 17h.01" />
      </svg>
    );
  }

  if (normalizedName.includes("aws") || normalizedName.includes("azure") || normalizedName.includes("s3") || normalizedName.includes("ec2")) {
    return (
      <svg {...iconProps}>
        <path d="M7 18h10a4 4 0 0 0 .6-7.96A6.5 6.5 0 0 0 5.2 8.5 4.8 4.8 0 0 0 7 18Z" />
      </svg>
    );
  }

  if (normalizedName.includes("camunda") || normalizedName.includes("er/uml") || normalizedName.includes("oop") || normalizedName.includes("dsa") || normalizedName.includes("operating") || normalizedName.includes("network")) {
    return (
      <svg {...iconProps}>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="9" y="14" width="6" height="6" rx="1" />
        <path d="M10 7h4M12 10v4" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
    </svg>
  );
}
