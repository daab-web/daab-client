export function formatDate(dateString: string | null | undefined, locale: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original string if invalid
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getTimeAgo(dateString: string | null | undefined, locale: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Return empty string if invalid
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) return locale === "az" ? "Bu gün" : "Today";
  if (diffInDays === 1) return locale === "az" ? "Dünən" : "Yesterday";
  if (diffInDays < 7)
    return locale === "az"
      ? `${diffInDays} gün əvvəl`
      : `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return locale === "az"
      ? `${weeks} həftə əvvəl`
      : `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  const months = Math.floor(diffInDays / 30);
  return locale === "az"
    ? `${months} ay əvvəl`
    : `${months} month${months > 1 ? "s" : ""} ago`;
}

