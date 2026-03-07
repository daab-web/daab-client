export type Scientist = {
  id: string;
  userId: string;
  slug: string;
  firstName: string;
  lastName: string;
  academicTitle: string;
  description?: string;
  institutions: string[];
  countries: string[];
  areas: string[];
  photoUrl?: string;
  linkedIn?: string;
  orcid?: string;
  website?: string;
};
