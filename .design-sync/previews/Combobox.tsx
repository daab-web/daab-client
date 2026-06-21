import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "daab-client";

const frameworks = ["Next.js", "SvelteKit", "Nuxt", "Remix", "Astro"];

export function Default() {
  return (
    <div className="w-64">
      <Combobox defaultOpen items={frameworks}>
        <ComboboxInput placeholder="Select framework…" />
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
