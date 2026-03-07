export type NavKey =
  | "home"
  | "aboutWaas"
  | "boardOfDirectors"
  | "ourScientists"
  | "ourActivities"
  | "membership";

export type NavItem = {
  key: NavKey;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "aboutWaas", href: "/about" },
  { key: "boardOfDirectors", href: "/directors" },
  { key: "ourScientists", href: "/scientists" },
  { key: "ourActivities", href: "/activities" },
  { key: "membership", href: "/membership" },
];

export type AboutSectionId =
  | "necessity"
  | "mission"
  | "vision"
  | "values"
  | "charter";

export type AboutSection = {
  id: AboutSectionId;
  path: string;
};

export const ABOUT_SECTIONS: AboutSection[] = [
  { id: "necessity", path: "/about/necessity" },
  { id: "mission", path: "/about/mission" },
  { id: "vision", path: "/about/vision" },
  { id: "values", path: "/about/values" },
  { id: "charter", path: "/about/charter" },
];
