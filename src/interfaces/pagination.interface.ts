export interface Pagination {
    total_items: number,
    total_pages: number,
    current_page: number,
    offset: number,
    has_next: boolean,
    has_previous: boolean,
}