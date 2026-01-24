import CharterContent from "@/content/az/charter.md";

export default async function Charter() {
  return (
    <section
      id="charter"
      data-section="charter"
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="space-y-6">
        <CharterContent />
      </div>
    </section>
  );
}

