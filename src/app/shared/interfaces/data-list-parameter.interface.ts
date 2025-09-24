export interface DataListParameter {
  rows: number;
  page: number;
  sortBy?: string;
  filterObj?: unknown;
  searchQuery?: string;
  filterRange?: string;
  queryString?: string;
  get_teacher?: number;
  student_id?: number;
}
