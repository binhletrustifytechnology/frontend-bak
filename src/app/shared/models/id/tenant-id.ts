import {EntityType} from "@shared/models/entity-type.models";
import {EntityId} from "@shared/models/id/entity-id";

export class TenantId implements EntityId {
  entityType = EntityType.TENANT;
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
