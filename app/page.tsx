import TerminusOS from "@/components/portfolio/os/TerminusOS";
import SeoDossier from "@/components/portfolio/seo/SeoDossier";
import { getResolvedContact } from "@/lib/contact";

export default function Home() {
  const contact = getResolvedContact();

  return (
    <>
      <SeoDossier contact={contact} />
      <TerminusOS contact={contact} />
    </>
  );
}
