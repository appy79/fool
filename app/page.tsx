import TerminusOS from "@/components/portfolio/os/TerminusOS";
import { getResolvedContact } from "@/lib/contact";

export default function Home() {
  const contact = getResolvedContact();

  return <TerminusOS contact={contact} />;
}
