import { ActivityTypeModel } from './../../../models/activityTypeModel';
import trLocale from '@fullcalendar/core/locales/tr';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ActivityReportsByUserIdModel } from './../../../models/activityReportsByUserIdModel';
import { Component, OnInit, Pipe } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { BlankComponent } from '../../blank/blank.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core';
import { take } from 'rxjs';
import { SwalService } from '../../../services/swal.service';
import { ActivityReportService } from '../../../services/activity-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityTypeService } from '../../../services/activity-type.service';
import { PdfExportService } from '../../../services/pdf-export.service';
import { DatePipe } from '@angular/common';
import { __values } from 'tslib';
declare var $: any;

@Component({
  selector: 'app-user-activity-report',
  standalone: true,

  imports: [SharedModule, BlankComponent, FullCalendarModule],
  templateUrl: './user-activity-report.component.html',
  styleUrl: './user-activity-report.component.scss',
})
export class UserActivityReportComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private swal: SwalService,
    private activityService: ActivityReportService,
    private router: Router,
    private route: ActivatedRoute,
    private activityTypeService:ActivityTypeService,
    private pdfService:PdfExportService,
    private datePipe:DatePipe
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedActivityTypeId = params['activityType'] || '';
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
    });
    this.initializeCalendarOptions();
    this.getActivityReportsByUser();
    this.createActivityReportAddForm();
    this.createActivityReportUpdateForm();
    this.getActivityTypes();
  }

  activityReports: ActivityReportsByUserIdModel[] = [];
  calendarOptions: CalendarOptions;
  selectedEvent: any;
  activityReportAddForm: FormGroup;
  activityReportUpdateForm: FormGroup;


  dateFormatter(date: Date): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy HH:mm') || '';
  }
  dowloandPdf(){
    const headers = ['ID','Aktivite Türü',"Tarih","Olusturulma Tarihi","Güncelleme Tarihi"];
    const filteredData = this.activityReports.map(report=>({
      id:report.id,
      activityTypeName:report.activityTypeName,
      date:this.dateFormatter(report.date),
      createdDate:this.dateFormatter(report.createdDate),
      updatedDate:this.dateFormatter(report.updatedDate) =='01.01.0001 00:00' ? '-' : this.dateFormatter(report.updatedDate)
    }));
    this.pdfService.exportToPdf(filteredData,headers,"ActivityReports");
  } 
  getActivityReportsByUser() {
    this.activityService
      .getFilteredByUserId(this.selectedActivityTypeId,this.startDate,this.endDate)
      .pipe(take(1))
      .subscribe((res) => {
        this.activityReports = res;
        this.initializeCalendarOptions();
      });
  }
  initializeCalendarOptions() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: trLocale,
      events: this.activityReports.map((a) => ({
        id: a.id.toString(),
        title: a.activityTypeName,
        start: a.date,
        color: 'green',
      })),
      eventClick: this.handleEventClick.bind(this), // add eventClick callback
    };
  }
  handleEventClick(arg: any) {
      this.activityService.getById(arg.event.id)
      .pipe(take(1))
      .subscribe(res=>{
        this.activityReportUpdateForm.patchValue({
          ...res
        });
        $('#activityReportUpdateModal').modal('show');
      })
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  createActivityReportAddForm() {
    this.activityReportAddForm = this.fb.group({
      activityTypeId: ['', [Validators.required]],
      description: [
        '',
        [Validators.required, Validators.min(3), Validators.max(50)],
      ],
      date: ['', [Validators.required]],
    });
  }

  createActivityReportUpdateForm() {
    this.activityReportUpdateForm = this.fb.group({
      id: [0],
      date: ['', [Validators.required]],
      activityTypeId: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  addActivityReport(): void {
    if (this.activityReportAddForm.valid) {
      this.activityService
        .add(this.activityReportAddForm.value)
        .subscribe((res) => {
          this.swal.callToast('Ekleme işlemi başarılı.', 'success');
          this.clearFilter();
          this.activityReportAddForm.reset();
        });
    }
  }
  activityTypes:ActivityTypeModel[];
  getActivityTypes(){
    this.activityTypeService.getAll()
    .pipe(take(1))
    .subscribe(res=>{
      this.activityTypes = res;
    })
  }
  updateActivityReport() {
    if (this.activityReportUpdateForm.valid) {
      this.swal.callSwal(
        'Mevcut aktivite güncellenecektir',
        'Aktivite güncellemek istediğinizden emin misiniz?',
        () => {
          this.activityService
            .update(this.activityReportUpdateForm.value)
            .pipe(take(1))
            .subscribe((res) => {
              this.swal.callToast('Güncelleme işlemi başarılı.');
              this.clearFilter();
            });
          $('#activityReportUpdateModal').modal('hide');
        },
        'Güncelle'
      );
    }
  }

  deleteActivityReport(intervalId: number) {
    this.swal.callSwal(
      'Mevcut aktivite silinecektir',
      'Aktivite silmek istediğinizden emin misiniz?',
      () => {
        this.activityService
          .delete(intervalId)
          .pipe(take(1))
          .subscribe((res) => {
            this.swal.callToast('Silme işlemi başarılı.');
            this.clearFilter();
          });
        $('#activityReportUpdateModal').modal('hide');
      },
      'Sil'
    );
  }
  // burada çalış
  selectedActivityTypeId: string = '';
  startDate: string = '';
  endDate: string = '';
  filterEvents() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        activityType: this.selectedActivityTypeId,
        startDate: this.startDate,
        endDate: this.endDate,
      },
      queryParamsHandling: 'merge',
    });
    this.getActivityReportsByUser();
  }
  clearFilter(){
    this.selectedActivityTypeId="";
    this.startDate="";
    this.endDate="";
    this.router.navigate(['/user']);
    this.getActivityReportsByUser();
  }
}
