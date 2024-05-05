export interface PageRequestParams {
  ['sort-dir']?: 'ASC' | 'DESC';
  ['sort']?: string;
  ['page-size']?: number;
  ['page-num']?: number;
  ['search']?: string;
}
