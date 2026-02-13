import { PagedMetadata } from "./paged-metadata"

export type PagedResponse<T> = {
  items: T[],
  metadata: PagedMetadata
}

