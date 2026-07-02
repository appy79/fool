type ResumeFile = {
  label: string;
  detail: string;
  href: string;
};

// A single ATS-optimized PDF, generated from `lib/resume.ts` at build time (see
// `scripts/generate-resume.tsx`). The in-OS Resume app renders the richly styled view; this is
// the downloadable copy that applicant tracking systems parse.
export const resumeFiles: ResumeFile[] = [
  {
    label: "Résumé PDF",
    detail: "Single-page, ATS-friendly PDF generated from the site's résumé data.",
    href: "/Amandeep_Yadav_Resume.pdf",
  },
];

/** Canonical downloadable résumé. Convenience accessor for the single entry above. */
export const primaryResumeFile: ResumeFile = resumeFiles[0];
