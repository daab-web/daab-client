export type Scientist = {
  id: string;
  userId: string;
  slug: string;
  firstName: string;
  lastName: string;
  academicTitle: string;
  description?: string;
  institution: string[];
  countries: string[];
  areas: string[];
};
