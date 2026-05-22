"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ResolvedContactInfo } from "@/lib/resume";
import TuringTapeExhibit from "./exhibits/turing/TuringTapeExhibit";
import LabSelector from "./LabSelector";
import type { LabExhibit } from "./types";

type EngineeringSystemsLabProps = {
  contact: ResolvedContactInfo;
};

function LabLoadingState() {
  return (
    <section className="scroll-mt-24 rounded-[2rem] border border-border/70 bg-card/60 p-8 shadow-sm shadow-slate-900/5 dark:bg-background/50">
      <div className="space-y-3">
        <div className="h-3 w-32 rounded-full bg-muted" />
        <div className="h-8 w-72 max-w-full rounded-full bg-muted" />
        <div className="h-4 w-full max-w-2xl rounded-full bg-muted" />
      </div>
    </section>
  );
}

const TelecomCoreLab = dynamic(() => import("./exhibits/telecom/TelecomCoreExhibit"), {
  loading: LabLoadingState,
});
const DistributedConsensusLab = dynamic(() => import("./exhibits/distributed/DistributedSystemsLab"), {
  loading: LabLoadingState,
});
const PerformanceOptimizationLab = dynamic(() => import("./exhibits/performance/PerformanceOptimizationLab"), {
  loading: LabLoadingState,
});
const ConcurrencyRaceLab = dynamic(() => import("./exhibits/concurrency/MemoryConcurrencyLab"), {
  loading: LabLoadingState,
});
const NetworkEdgeLab = dynamic(() => import("./exhibits/network/NetworkEdgeLab"), {
  loading: LabLoadingState,
});
const ComplexityPuzzleLab = dynamic(() => import("./exhibits/complexity/ComplexityPuzzleLab"), {
  loading: LabLoadingState,
});
const DesignPatternsMachineLab = dynamic(() => import("./exhibits/patterns/DesignPatternsLab"), {
  loading: LabLoadingState,
});

const labExhibits: LabExhibit[] = [
  {
    id: "turing",
    label: "Turing Tape Simulator",
    summary: "Step through mechanical computation with state, tape, and transition rules.",
    component: TuringTapeExhibit,
  },
  {
    id: "telecom",
    label: "Telecom Core Simulator",
    summary: "3GPP-style subscriber flows through policy, charging, orchestration, and events.",
    component: TelecomCoreLab,
  },
  {
    id: "distributed",
    label: "Distributed Consensus Lab",
    summary: "Ordering, clocks, consensus, and fault tolerance across communicating nodes.",
    component: DistributedConsensusLab,
  },
  {
    id: "performance",
    label: "Performance Optimization Bench",
    summary: "Compare indexing, parallelism, caching, and latency tradeoffs.",
    component: PerformanceOptimizationLab,
  },
  {
    id: "concurrency",
    label: "Concurrency Race Visualizer",
    summary: "Shared memory, synchronization, lost updates, and deadlock behavior.",
    component: ConcurrencyRaceLab,
  },
  {
    id: "network",
    label: "Network Edge Lab",
    summary: "DNS, edge routing, CDN behavior, origin fallback, and request paths.",
    component: NetworkEdgeLab,
  },
  {
    id: "complexity",
    label: "P vs NP Puzzle Chamber",
    summary: "Search growth, witness verification, route costs, and constraint checks.",
    component: ComplexityPuzzleLab,
  },
  {
    id: "patterns",
    label: "Design Patterns Machine",
    summary: "Strategy, adapter, observer, and breaker patterns as system machinery.",
    component: DesignPatternsMachineLab,
  },
];

export default function EngineeringSystemsLab({ contact }: EngineeringSystemsLabProps) {
  const [activeLabId, setActiveLabId] = useState(labExhibits[0].id);
  const activeLab = labExhibits.find((lab) => lab.id === activeLabId) ?? labExhibits[0];
  const ActiveLab = activeLab.component;
  const contactLinks = [
    ...(contact.email ? [{ label: "Email", href: `mailto:${contact.email}` }] : []),
    ...(contact.phone ? [{ label: "Phone", href: `tel:${contact.phone}` }] : []),
    ...(contact.socials ?? []),
  ];

  return (
    <main className="relative min-h-screen py-16 text-foreground sm:py-20">
      <div className="glass mx-auto flex max-w-7xl flex-col gap-14 rounded-[2rem] border border-border/70 bg-card/85 px-6 py-12 shadow-2xl shadow-slate-900/10 dark:bg-background/80 dark:shadow-slate-950/20 sm:px-10 lg:px-14">
        <section id="lab" className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <Badge>Engineering Systems Lab</Badge>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Learn my engineering depth by running the systems.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                Start with a Turing tape simulator, then switch into telecom, distributed systems, performance,
                concurrency, networking, complexity, and design pattern exhibits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setActiveLabId("turing")}>
                Run the Turing tape
              </Button>
              <Button variant="outline" onClick={() => setActiveLabId("telecom")}>
                Explore telecom systems
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Turing machines and tape memory",
              "3GPP telecom core flows",
              "Distributed consensus and clocks",
              "Performance and concurrency behavior",
              "DNS, CDN, edge, and OSI routing",
              "P vs NP and design pattern tradeoffs",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-border/70 bg-card/65 p-4 text-sm font-medium shadow-sm shadow-slate-900/5 backdrop-blur dark:bg-background/50">
                {item}
              </div>
            ))}
          </div>
        </section>

        <LabSelector labs={labExhibits} activeLabId={activeLab.id} onSelect={setActiveLabId} />

        <div key={activeLab.id}>
          <ActiveLab />
        </div>

        <section id="contact" className="scroll-mt-24 rounded-3xl border border-border/70 bg-card/60 p-6 dark:bg-background/50">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge>Contact</Badge>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">Build the next exhibit or the next system.</h2>
              <p className="mt-2 text-muted-foreground">Based in {contact.location}. Available for backend, platform, and full-stack engineering conversations.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {contactLinks.length > 0 ? (
                contactLinks.map((link) => (
                  <Button key={`${link.label}-${link.href}`} variant="outline" asChild>
                    <a href={link.href}>{link.label}</a>
                  </Button>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Contact links are read from environment variables.</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
