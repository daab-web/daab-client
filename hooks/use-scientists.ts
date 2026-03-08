import { useQuery } from "@tanstack/react-query";
import { PagedResponse } from "@/types/paged-response";
import { Scientist } from "@/types/scientist";
import { fetchScientists } from "@/lib/api/scientists";
import { fetchAreas, fetchCountries } from "@/lib/api/index";

export function useScientists(
  page: number,
  search: string,
  country: string,
  area: string,
) {
  return useQuery<PagedResponse<Scientist>>({
    queryKey: [page, search, country, area],
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

export function useAreas() {
  return useQuery<string[]>({
    queryKey: ["areas"],
    queryFn: fetchAreas,
  });
}

export function useCoutnries() {
  return useQuery<string[]>({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });
}
