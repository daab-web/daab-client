export default async function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold mb-4">About WAAS</h1>
        <p className="text-muted-foreground text-lg">
          Select a section from the sidebar to learn more about our organization.
        </p>
      </div>
    </div>
  );
}
