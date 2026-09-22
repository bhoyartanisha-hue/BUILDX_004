export type Lang='en'|'hi'|'mr'; export type Role='citizen'|'official';
export type Screen='map'|'roads'|'work-list'|'verification'|'expiry'|'search'|'notifications'|'settings'|'dashboard'|'file-complaint'|'tracker'|'receipt';
export type UtilityType='water'|'sewer'|'gas'|'electricity'|'telecom'|'household'|'chamber'; export type Severity='critical'|'high'|'medium'|'low';
export type WorkflowStatus='assigned'|'in-progress'|'submitted'|'approved'|'rejected';
export interface GeoPoint {lat:number;lng:number}
export interface MapElement extends GeoPoint {id:string;type:'pipeline'|'chamber'|'household'|'road'|'worksite';label:string;utilityType?:UtilityType;status?:'active'|'expiring'|'expired';severity?:Severity;sublabel?:string;path?:GeoPoint[]}
export interface RoadSegment {id:string;name:string;ward:string;length:string;width:string;surface:string;lastRepaired:string;repairCount:number;path:GeoPoint[]; baseScore:number}
export interface WorkItem {id:string;title:string;utilityType:UtilityType;severity:Severity;status:string;area:string;assignedTo:string;createdAt:string;description:string}
export interface WorkOrder {id:string;title:string;contractor:string;description:string;area:string;utilityType:UtilityType;status:WorkflowStatus;assignedDate:string;submittedDate?:string|undefined;rejectionReason?:string|undefined}
export interface Complaint {id:string;title:string;description:string;category:UtilityType;department:string;location:string;roadId:string;status:'received'|'assigned'|'in-progress'|'resolved';severity:Severity;createdAt:string;photo?:string|undefined;citizen:string;clusterId?:string|undefined}
export interface Notice {id:string;type:'expiry'|'verification'|'escalation';title:string;message:string;createdAt:string;read:boolean}
export interface Profile {name:string;role:Role;zone:string;ward:string;email:string;phone:string}
