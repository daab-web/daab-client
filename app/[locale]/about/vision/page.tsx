import VisionContent from "@/content/az/vision.md";

export default async function Vision() {
  return (
    <section
      id="vision"
      data-section="vision"
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="space-y-6">
        <VisionContent />
      </div>
    </section>
  );
}

