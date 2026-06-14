export type NewAttachment = {
  id: string;
  file: File;
  caption: string | null;
};

export type ExistingAttachment = {
  id: string;
  fileUrl: string;
  fileType: string | null;
  caption: string | null;
};

export type Attachment = NewAttachment | ExistingAttachment;

export function isNewAttachment(a: Attachment): a is NewAttachment {
  return "file" in a;
}
