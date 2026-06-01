type ResumeFile = {
  label: string;
  detail: string;
  href: string;
};

export const resumeFiles: ResumeFile[] = [
  {
    label: "Human-readable PDF",
    detail: "Roomier layout for recruiters and direct sharing.",
    href: "/Amandeep_Yadav_Resume_Human.pdf",
  },
  {
    label: "ATS / Accessible PDF",
    detail: "Tagged, structured PDF for applications and parsers.",
    href: "/Amandeep_Yadav_Resume_Accessible.pdf",
  },
];
