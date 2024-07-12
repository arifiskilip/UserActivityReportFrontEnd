import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ActivityTypeModel } from '../models/activityTypeModel';

@Injectable({
  providedIn: 'root'
})
export class ActivityTypeService {

  constructor(private http:HttpService) { }


  getAll(){
    return this.http.get<ActivityTypeModel[]>("ActivityType/GetAll");
  }
}
