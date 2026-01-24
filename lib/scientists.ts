export type Scientist = {
  id: number;
  userId?: number | null;
  fullName: string;
  academicTitle: string;
  institution: string;
  description: string;
  countries: string[];
  areas: string[];
};

export const SCIENTISTS: Scientist[] = [
  {
    id: 1,
    fullName: "Masud Əfəndiyev",
    academicTitle: "Prof. Dr.",
    institution: "Technical University of Munich",
    description:
      "Expert in differential equations and mathematical physics with decades of research on applied analysis.",
    countries: ["Germany"],
    areas: ["Mathematics", "Differential Equations"],
  },
  {
    id: 2,
    fullName: "Leyla Vəliyeva",
    academicTitle: "Assoc. Prof.",
    institution: "Polytechnic University of Madrid",
    description:
      "Architect and urban planner working on resilient cities and adaptive reuse projects.",
    countries: ["Spain"],
    areas: ["Architecture", "Urbanism"],
  },
  {
    id: 3,
    fullName: "Elçin İsmayılov",
    academicTitle: "Dr.",
    institution: "University of Bologna",
    description:
      "Historian researching Silk Road heritage and intercultural exchanges.",
    countries: ["Italy"],
    areas: ["History", "Cultural Studies"],
  },
  {
    id: 4,
    fullName: "Fəridə Rüstəmova",
    academicTitle: "Dr.",
    institution: "Lund University",
    description:
      "Sociologist investigating migration patterns and diaspora community integration.",
    countries: ["Sweden"],
    areas: ["Sociology", "Migration"],
  },
  {
    id: 5,
    fullName: "Murad Mursəlov",
    academicTitle: "Prof.",
    institution: "University of Tokyo",
    description:
      "Pioneers automation solutions for smart manufacturing and robotics safety.",
    countries: ["Japan"],
    areas: ["Engineering", "Automation"],
  },
  {
    id: 6,
    fullName: "Lale Hidayətova",
    academicTitle: "MD, PhD",
    institution: "Stanford University",
    description:
      "Clinical neurologist focusing on neurodegenerative diseases and digital therapeutics.",
    countries: ["United States"],
    areas: ["Medicine", "Neurology"],
  },
  {
    id: 7,
    fullName: "Rəşad Mehdiyev",
    academicTitle: "Dr.",
    institution: "Warsaw University of Technology",
    description:
      "Physicist specializing in photonics and high-power laser applications.",
    countries: ["Poland"],
    areas: ["Physics", "Optics"],
  },
  {
    id: 8,
    fullName: "Aysu Məmmədli",
    academicTitle: "Dr.",
    institution: "Delft University of Technology",
    description:
      "Environmental scientist modelling climate resilience and sustainable urban water systems.",
    countries: ["Netherlands"],
    areas: ["Environmental Science", "Sustainability"],
  },
  {
    id: 9,
    fullName: "Nihat Cəfərov",
    academicTitle: "Prof.",
    institution: "University of Melbourne",
    description:
      "Legal scholar focused on international law, human rights, and comparative justice.",
    countries: ["Australia"],
    areas: ["Law", "Human Rights"],
  },
  {
    id: 10,
    fullName: "Tunar İbrahimov",
    academicTitle: "Dr.",
    institution: "University of Bergen",
    description:
      "Marine biologist studying Arctic ecosystems and climate change impact on fisheries.",
    countries: ["Norway"],
    areas: ["Marine Biology"],
  },
  {
    id: 11,
    fullName: "Günel Rəsulova",
    academicTitle: "Dr.",
    institution: "University of Geneva",
    description:
      "Education policy expert improving inclusive schooling and international academic collaboration.",
    countries: ["Switzerland"],
    areas: ["Education", "Policy"],
  },
  {
    id: 12,
    fullName: "Samir Sadıqov",
    academicTitle: "Assoc. Prof.",
    institution: "Carnegie Mellon University",
    description:
      "Cybersecurity researcher focusing on distributed systems security and privacy-preserving protocols.",
    countries: ["United States"],
    areas: ["Computer Science", "Cybersecurity"],
  },
  {
    id: 13,
    fullName: "Amina Səmədova",
    academicTitle: "Dr.",
    institution: "Sorbonne University",
    description:
      "Linguist researching multilingual education and translation technologies.",
    countries: ["France"],
    areas: ["Linguistics", "Translation"],
  },
  {
    id: 14,
    fullName: "Ramil Əliyev",
    academicTitle: "Dr.-Ing.",
    institution: "RWTH Aachen University",
    description:
      "Mechanical engineer designing lightweight structures for aerospace applications.",
    countries: ["Germany"],
    areas: ["Mechanical Engineering"],
  },
  {
    id: 15,
    fullName: "Lamiya Həsənova",
    academicTitle: "Dr.",
    institution: "KU Leuven",
    description:
      "Political scientist analyzing diplomacy in Eastern Partnership countries and EU integration.",
    countries: ["Belgium"],
    areas: ["Political Science", "Diplomacy"],
  },
  {
    id: 16,
    fullName: "İlqar Şabanov",
    academicTitle: "Prof.",
    institution: "New York University Abu Dhabi",
    description:
      "Development economist studying innovation ecosystems and economic diversification in the Gulf region.",
    countries: ["United Arab Emirates"],
    areas: ["Economics", "Development"],
  },
];

export function findScientistById(id: number) {
  return SCIENTISTS.find((scientist) => scientist.id === id);
}
