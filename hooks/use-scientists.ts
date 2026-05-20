import { useQuery } from "@tanstack/react-query";
import { PagedResponse } from "@/types/paged-response";
import { Scientist } from "@/types/scientist";
import { fetchScientists } from "@/lib/api/scientists";

export function useScientists(
  locale: string,
  page: number,
  search: string,
  country: string,
  area: string,
) {
  return useQuery<PagedResponse<Scientist>>({
    queryKey: ["scientists", locale, page, search, country, area],
    queryFn: async () =>
      await fetchScientists(
        locale,
        page,
        100,
        search || undefined,
        country || undefined,
        area || undefined,
      ),
  });
}
