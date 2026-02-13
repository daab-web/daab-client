export type PagedMetadata = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  firstItemIndex: number;
  lastItemIndex: number;
};
