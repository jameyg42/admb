export type IncidentStatus = "RESOLVED"|"OPEN";
export type IncidentSeverity = "CRITICAL"|"WARNING";
export type ViolationType = "HEALTH_RULE";

export interface ViolationListItem {
   id: number;
   status: IncidentStatus;
   severity: IncidentSeverity;
   ruleId: number;
   description: string;
   violationType: ViolationType;
   startTime: number;
   endTime: number;
   affectedEntityId: number
   affectedEntityType: EntityType
   jiraId: string|null;
   warRoomGuid: number|null; 
}

export type EntityType = "BUSINESS_TRANSACTION";
export interface EntityDefinition {
   id: number;
   version: number;
   entityType: EntityType;
   entityId: number;
   prettyToString: string|null;
}
export interface Incident {
   id: number;
   version: number;
   name: string;
   nameUnique: boolean;
   applicationId: number;
   affectedEntityDefinition: EntityDefinition;
   description: string;
   endTime: number;
   startTime: number;
   severity: IncidentSeverity|null;
   status: IncidentStatus;
   healthRuleId: number;
   evaluationStates: EvaluationState[]
}
export interface EvaluationState {
   id: number;
   version: number;
   startTime: number|null;
   endTime: number|null;
   severity: IncidentSeverity;
   description: string;
   summary: string;
}
