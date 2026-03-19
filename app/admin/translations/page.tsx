import TranslationManagement from "../translation-management";

export default function TranslationsPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Translations</h1>
      </div>
      <TranslationManagement />
    </div>
  );
}
