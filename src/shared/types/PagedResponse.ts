/**
 * Wrapper phân trang chung cho các list API (tasks/projects/meetings...).
 * BE tự clamp: page<1→1, pageSize<1→1, pageSize>100→100.
 */
export interface PagedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
