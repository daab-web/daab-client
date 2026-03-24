import { useQuery } from "@tanstack/react-query";
import { PagedResponse } from "@/types/paged-response";
import { Scientist } from "@/types/scientist";
import { fetchScientists } from "@/lib/api/scientists";

export function useScientists(
  page: number,
  search: string,
  country: string,
  area: string,
) {
  return useQuery<PagedResponse<Scientist>>({
    queryKey: ["scientists", page, search, country, area],
    queryFn: async () =>
      await fetchScientists(
        page,
        100,
        search || undefined,
        country || undefined,
        area || undefined,
      ),
  });
}
