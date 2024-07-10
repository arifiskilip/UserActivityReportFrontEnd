import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../common/constants/validationMessages';
import { ValidDirective } from '../../../common/directives/valid.directive';
import { SharedModule } from '../../../common/shared/shared.module';
import { MenuPipe } from '../../../pipes/menu.pipe';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { UserMenus } from '../../../menu';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [SharedModule, MenuPipe, ValidDirective],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss'
})
export class UserSidebarComponent implements OnInit{

  search: string = "";
  menus = UserMenus;
  patientPasswordUpdateForm: FormGroup;
  validationMessages: ValidationMessages = new ValidationMessages();


  constructor(
    private http: HttpService,
    private formBuilder: FormBuilder,
    private swal: SwalService,
  ) {}

  ngOnInit(): void {
    this.createPatientPasswordUpdateForm();
  }

  updatePassword(): void {
    if (this.patientPasswordUpdateForm.valid) {
      this.http
        .put<any>('Auth/UpdatePassword', this.patientPasswordUpdateForm.value)
        .subscribe((res) => {
          this.swal.callToast(res.message);
        });
    }
  }

  createPatientPasswordUpdateForm(): void {
    this.patientPasswordUpdateForm = this.formBuilder.group(
      {
        oldPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ],
        ],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup): any {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword').setErrors({ match: true });
    } else {
      return null;
    }
  }



    // Getters for patientPasswordUpdateForm
    get password() {
      return this.patientPasswordUpdateForm.get('password');
    }
    get confirmPassword() {
      return this.patientPasswordUpdateForm.get('confirmPassword');
    }
    get oldPassword() {
      return this.patientPasswordUpdateForm.get('oldPassword');
    }
  }
