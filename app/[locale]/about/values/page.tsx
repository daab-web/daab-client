import ValuesContent from "@/content/az/values.md";

export default async function Values() {
  return (
    <section
      id="values"
      data-section="values"
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="space-y-6 [&_p]:text-center [&_p]:text-lg">
        <ValuesContent />
      </div>
    </section>
  );
}

