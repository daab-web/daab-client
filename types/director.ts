export type Director = {
  id: string;
  scientistId: string | null;
  profilePictureUrl: string | null;
  firstName: string;
  lastName: string;
  role: string;
  academicTitle: string;
  countries: string[];
};

export interface UntranslatedDirectorEntry {
  directorId: string;
  slug: string;
  status: string;
  missingLocales: string[];
}
