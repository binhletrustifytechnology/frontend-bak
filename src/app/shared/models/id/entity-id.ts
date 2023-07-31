import {HasUUID} from "@shared/models/id/has-uuid";
import {EntityType} from "@shared/models/entity-type.models";

export interface EntityId extends HasUUID {
  entityType: EntityType
  // entityType: EntityType | AliasEntityType;
}
