import { PrimeRadiantGlyph } from "../icons/FoundationMotifs";
import {
  ActivityIcon,
  CasesIcon,
  CommsIcon,
  LabsAppIcon,
  LogIcon,
  OperatorIcon,
  ResumeIcon,
  SettingsIcon,
} from "./AppIcons";
import ActivityApp from "./apps/ActivityApp";
import CaseFileApp from "./apps/CaseFileApp";
import CaseFilesApp from "./apps/CaseFilesApp";
import CommsApp from "./apps/CommsApp";
import OperatorApp from "./apps/OperatorApp";
import ResumeApp from "./apps/ResumeApp";
import SettingsApp from "./apps/SettingsApp";
import SystemApp from "./apps/SystemApp";
import SystemLogApp from "./apps/SystemLogApp";
import type { AppDefinition } from "./osStore";

export const APPS: AppDefinition[] = [
  {
    id: "system",
    title: "System",
    shortLabel: "System",
    Icon: PrimeRadiantGlyph,
    component: SystemApp,
    defaultSize: { w: 980, h: 660 },
  },
  {
    id: "operator",
    title: "Operator",
    Icon: OperatorIcon,
    component: OperatorApp,
    defaultSize: { w: 720, h: 560 },
  },
  {
    id: "cases",
    title: "Case Files",
    shortLabel: "Cases",
    Icon: CasesIcon,
    component: CaseFilesApp,
    defaultSize: { w: 780, h: 600 },
  },
  {
    id: "activity",
    title: "Activity",
    Icon: ActivityIcon,
    component: ActivityApp,
    defaultSize: { w: 740, h: 580 },
  },
  {
    id: "log",
    title: "System Log",
    shortLabel: "Log",
    Icon: LogIcon,
    component: SystemLogApp,
    defaultSize: { w: 760, h: 600 },
  },
  {
    id: "comms",
    title: "Comms",
    Icon: CommsIcon,
    component: CommsApp,
    defaultSize: { w: 640, h: 540 },
  },
  {
    id: "resume",
    title: "Resume",
    Icon: ResumeIcon,
    component: ResumeApp,
    defaultSize: { w: 560, h: 440 },
    dividerBefore: true,
  },
  {
    id: "settings",
    title: "Settings",
    Icon: SettingsIcon,
    component: SettingsApp,
    defaultSize: { w: 580, h: 480 },
  },
  {
    id: "labs",
    title: "Labs",
    Icon: LabsAppIcon,
    href: "/labs",
    external: true,
  },
  {
    id: "casefile",
    title: "Case File",
    Icon: CasesIcon,
    component: CaseFileApp,
    defaultSize: { w: 800, h: 640 },
    hidden: true,
  },
];
