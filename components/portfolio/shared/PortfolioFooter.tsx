export default function PortfolioFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 py-8">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
        © {currentYear} Amandeep Yadav / Terminus archive / non-random systems
      </p>
    </footer>
  );
}
