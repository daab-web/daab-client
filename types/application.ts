export interface Application {
  id: string;
  email: string;
  name: string;
  surname: string;
  residence: string;
  city: string;
  phoneNumber: string;
  universityName: string;
  fieldOfStudy: string;
  academicDegree: string;
  almaMater: string;
  academicTitle: string;
  degreeInstitution: string;
  jobPosition: string | null;
  previousJob: string | null;
  contributionsToDaab: string;
  engagedScientistFields: string | null;
  additionalInformation: string | null;
  additionalInformationToShare: string | null;
}
