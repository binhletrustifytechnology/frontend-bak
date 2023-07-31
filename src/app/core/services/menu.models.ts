import {HasUUID} from "../../shared/models/id/has-uuid";

export declare type MenuSectionType = 'link' | 'toggle';

export interface MenuSection extends HasUUID {
  name: string;
  fullName?: string;
  type: MenuSectionType;
  path: string;
  icon: string;
  isMdiIcon?: boolean;
  pages?: Array<MenuSection>;
  opened?: boolean;
  disabled?: boolean;
  rootOnly?: boolean;
  enableSubTenant?: boolean;
}
