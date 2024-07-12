import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { ActivityReportModel } from '../models/activityReportMode';
import { ActivityReportsByUserIdModel } from '../models/activityReportsByUserIdModel';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportService {

  constructor(private http:HttpService) { }


  add(activityReport:ActivityReportModel){
    return this.http.post<ActivityReportModel>('ActivityReport/Add',activityReport);
  }
  delete(id:number){
    return this.http.delete<any>(`ActivityReport/Delete?Id=${id}`);
  }
  update(activityReport:ActivityReportModel){
    return this.http.put<ActivityReportModel>('ActivityReport/Update',activityReport);
  }
  getById(id:number){
    return this.http.get<ActivityReportModel>(`ActivityReport/GetById?Id=${id}`);
  }
  getFilteredByUserId(activityTypeId?:string,startDate?:string,endDate?:string){
    let query = `ActivityReport/GetFilteredByUserId`;
    if (activityTypeId) {
      query += `?ActivityTypeId=${activityTypeId}`;
    }
    if (startDate) {
      query += query.includes('?') ? `&StartDate=${startDate}` : `?StartDate=${startDate}`;
    }
    if (endDate) {
      query += query.includes('?') ? `&EndDate=${endDate}` : `?EndDate=${endDate}`;
    }

    return this.http.get<ActivityReportsByUserIdModel[]>(query);
  }
}
