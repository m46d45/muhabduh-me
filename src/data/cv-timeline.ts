/**
 * Academic timeline for the on-site CV page.
 * Sourced from existing CV extract / site roles — do not invent awards.
 */

export type TimelineKind = "education" | "role" | "award";

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  kind: TimelineKind;
  note?: string;
};

export const education: TimelineItem[] = [
  {
    period: "2018",
    title: "Insinyur (Ir.) — Professional Engineer",
    org: "Institut Teknologi Bandung",
    kind: "education",
  },
  {
    period: "2000",
    title: "Ph.D., Civil Engineering",
    org: "Purdue University, USA",
    kind: "education",
  },
  {
    period: "1996",
    title: "Magister Teknik (M.T.), Civil Engineering",
    org: "Institut Teknologi Bandung",
    kind: "education",
  },
  {
    period: "1993",
    title: "Sarjana Teknik (S.T.), Civil Engineering",
    org: "Institut Teknologi Bandung",
    kind: "education",
  },
];

export const roles: TimelineItem[] = [
  {
    period: "2023–present",
    title: "Professor of Civil Engineering (Guru Besar)",
    org: "Faculty of Civil & Environmental Engineering, ITB",
    kind: "role",
    note: "Functional appointment from 1 June 2023",
  },
  {
    period: "Present",
    title: "Chairman",
    org: "IAMKRI — Indonesian Lean Construction Professional Society",
    kind: "role",
  },
  {
    period: "2020–2025",
    title: "Vice Rector for Finance, Planning and Development",
    org: "Institut Teknologi Bandung",
    kind: "role",
  },
  {
    period: "2016–2017 · 2018–2020",
    title: "Head of Civil Engineering Study Programme",
    org: "FTSL, ITB",
    kind: "role",
  },
  {
    period: "2015–2016",
    title: "Vice Rector II",
    org: "Institut Teknologi Sumatera (ITERA)",
    kind: "role",
  },
  {
    period: "2012–2015",
    title: "Head, Construction Management & Engineering Laboratory",
    org: "FTSL, ITB",
    kind: "role",
  },
  {
    period: "2010–2011",
    title: "Director, Directorate of Logistics",
    org: "Institut Teknologi Bandung",
    kind: "role",
  },
  {
    period: "2005",
    title: "Associate Professor (Lektor Kepala)",
    org: "Institut Teknologi Bandung",
    kind: "role",
    note: "Functional appointment from 1 September 2005",
  },
  {
    period: "2001",
    title: "Assistant Professor (Asisten Ahli)",
    org: "Institut Teknologi Bandung",
    kind: "role",
  },
];

export const awards: TimelineItem[] = [
  {
    period: "2025",
    title: "Ganesa Wira Adiutama",
    org: "Institut Teknologi Bandung",
    kind: "award",
    note: "Service recognition as Vice Rector",
  },
  {
    period: "2023",
    title: "Best Reviewer",
    org: "International Journal of Construction Management",
    kind: "award",
  },
  {
    period: "2022",
    title: "Outstanding Reviewer",
    org: "International Journal of Construction Management",
    kind: "award",
  },
  {
    period: "2020",
    title: "25 Years of Service Award",
    org: "Institut Teknologi Bandung",
    kind: "award",
  },
  {
    period: "2018",
    title: "Best Researcher Lecturer, FTSL",
    org: "Institut Teknologi Bandung",
    kind: "award",
  },
  {
    period: "2018",
    title: "Satyalancana Karya Satya XX Tahun",
    org: "Government of Indonesia",
    kind: "award",
  },
  {
    period: "2016",
    title: "Adi Karsa Madya",
    org: "Institut Teknologi Sumatera (ITERA)",
    kind: "award",
  },
];
