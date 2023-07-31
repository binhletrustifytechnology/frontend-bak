import {MatDialogRef} from "@angular/material/dialog";
import {BaseData, ExportableEntity} from "@shared/models/base-data";
import {DashboardId} from "@shared/models/id/dashboard-id";
import {TenantId} from "@shared/models/id/tenant-id";
import {ShortCustomerInfo} from "@shared/models/customer.models";
import {Timewindow} from "@shared/models/time.models";

export interface DashboardInfo extends BaseData<DashboardId>, ExportableEntity<DashboardId> {
  tenantId?: TenantId;
  title?: string;
  image?: string;
  assignedCustomers?: Array<ShortCustomerInfo>;
  mobileHide?: boolean;
  mobileOrder?: number;
}

export interface DashboardConfiguration {
  timewindow?: Timewindow;
  // settings?: DashboardSettings;
  // widgets?: {[id: string]: Widget } | Widget[];
  // states?: {[id: string]: DashboardState };
  // entityAliases?: EntityAliases;
  // filters?: Filters;
  [key: string]: any;
}

export interface Dashboard extends DashboardInfo {
  configuration?: DashboardConfiguration;
  dialogRef?: MatDialogRef<any>;
}
