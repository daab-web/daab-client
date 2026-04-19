import { SerializedEditorState } from "lexical";

export type Scientist = {
  id: string;
  userId: string;
  slug: string;
  firstName: string;
  lastName: string;
  academicTitle: string;
  description?: SerializedEditorState;
  institutions: string[];
  countries: string[];
  areas: string[];
  photoUrl?: string;
  linkedInUrl?: string;
  orcid?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string | null;
  publications?: Array<{ id?: string; title: string; url?: string }>;
};

export interface UpdateScientistRequest {
  email?: string;
  phoneNumber?: string;
  academicTitle: string;
  linkedInUrl?: string;
  orcid?: string;
  website?: string;
  institutions: string[]
  countries: string[]
  areas: string[]
}

export interface UpdateScientistTranslationRequest {
  firstName: string;
  lastName: string;
  description?: string;
}
