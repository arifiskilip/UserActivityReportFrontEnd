export interface ActivityReportModel{
    id:number;
    activityTypeId:number;
    activityTypeName:string;
    description:string;
    date:Date;
    createdDate:Date;
    updatedDate :Date;
    status:boolean;
}