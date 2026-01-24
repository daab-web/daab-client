import NecessityContent from "@/content/az/necessity.mdx";

export default async function Necessity() {
  return (
    <section
      id="necessity"
      data-section="necessity"
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="space-y-6">
        <NecessityContent />
      </div>
    </section>
  );
}
