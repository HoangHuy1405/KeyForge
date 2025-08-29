// Sorting type: field + direction
export type Sort = {
  field: string;
  direction: 'asc' | 'desc';
};

// Filter type (flexible, can be expanded)
export type Filter = {
  [key: string]: string | number | boolean;
};

export interface GetListParams {
  page?: number;
  size?: number;
  sort?: Sort[];
  filters?: string;
  /**
   * Example:
   *   "category = 'FURNITURE' and logistics.location ~ 'HCM'"
   *
   */
}
