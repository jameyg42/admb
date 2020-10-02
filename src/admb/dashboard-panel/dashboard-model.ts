import { Range } from '../svc/model';

export interface DashboardModel {
  widgets: DashboardWidget[];
  range: Range;
  title: string;
  vars: any;
}
export interface DashboardWidget {
  title?: string;
  type: string;
  cols: number;
  expr: string;
  range?: Range;
  vars?: any;
}
