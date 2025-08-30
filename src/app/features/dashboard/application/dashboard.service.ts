import { Observable } from 'rxjs';

export interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
}

export abstract class DashboardService {
  abstract getDashboardCards(): Promise<DashboardCard[]>;
}
