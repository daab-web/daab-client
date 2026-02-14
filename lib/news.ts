export type NewsArticle = {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  excerpt: string;
  publishedDate: string;
  authorName?: string;
  category?: string;
  tags?: string[];
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "Annual General Assembly 2026 Announcement",
    slug: "annual-general-assembly-2026",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    excerpt: "Join us for our Annual General Assembly where we will discuss key achievements and future directions of the association.",
    publishedDate: "2026-02-10",
    authorName: "DAAB Secretariat",
    category: "Events",
    tags: ["Assembly", "Annual Meeting"],
  },
  {
    id: 2,
    title: "New Research Collaboration with European Universities",
    slug: "new-research-collaboration-european-universities",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    excerpt: "DAAB announces a groundbreaking research partnership with leading European institutions to foster academic exchange.",
    publishedDate: "2026-02-05",
    authorName: "Dr. Leyla Vəliyeva",
    category: "Research",
    tags: ["Collaboration", "Research", "Europe"],
  },
  {
    id: 3,
    title: "Scientific Excellence Award Winners 2025",
    slug: "scientific-excellence-award-winners-2025",
    thumbnail: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=600&fit=crop",
    excerpt: "Celebrating outstanding contributions to science by our members. Congratulations to all the winners of this year's awards.",
    publishedDate: "2026-01-28",
    authorName: "Awards Committee",
    category: "Awards",
    tags: ["Awards", "Excellence", "Recognition"],
  },
  {
    id: 4,
    title: "Webinar Series: Climate Science and Policy",
    slug: "webinar-series-climate-science-policy",
    thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop",
    excerpt: "A new monthly webinar series bringing together experts to discuss climate challenges and sustainable solutions.",
    publishedDate: "2026-01-20",
    authorName: "Dr. Aysu Məmmədli",
    category: "Education",
    tags: ["Webinar", "Climate", "Education"],
  },
  {
    id: 5,
    title: "Scholarship Program Launch for Young Researchers",
    slug: "scholarship-program-launch-young-researchers",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    excerpt: "DAAB is proud to announce a new scholarship program supporting young Azerbaijani researchers abroad.",
    publishedDate: "2026-01-15",
    authorName: "DAAB Board",
    category: "Programs",
    tags: ["Scholarship", "Young Researchers", "Support"],
  },
  {
    id: 6,
    title: "International Conference on Digital Humanities",
    slug: "international-conference-digital-humanities",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
    excerpt: "Save the date for our upcoming international conference exploring the intersection of technology and humanities.",
    publishedDate: "2026-01-08",
    authorName: "Dr. Amina Səmədova",
    category: "Events",
    tags: ["Conference", "Digital Humanities", "Technology"],
  },
];

export function findNewsById(id: number) {
  return NEWS_ARTICLES.find((article) => article.id === id);
}

export function findNewsBySlug(slug: string) {
  return NEWS_ARTICLES.find((article) => article.slug === slug);
}
