import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  Input,
} from "daab-client";

export function Form() {
  return (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel htmlFor="f-email">Email</FieldLabel>
        <Input id="f-email" type="email" placeholder="you@example.com" />
        <FieldDescription>We'll never share your email.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="f-company">Company</FieldLabel>
        <Input id="f-company" defaultValue="Acme Inc." />
      </Field>
    </FieldGroup>
  );
}
