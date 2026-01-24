import MissionContent from "@/content/az/mission.md";

export default async function Mission() {
  return (
    <section
      id="mission"
      data-section="mission"
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="space-y-6">
        <MissionContent />
      </div>
    </section>
  );
}

