import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { ValidDirective } from '../../../common/directives/valid.directive';
import { BlankComponent } from "../../blank/blank.component";
import { UserService } from '../../../services/user.service';
import { SwalService } from '../../../services/swal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { AuthService } from '../../../services/auth.service';
import { ImageUrl } from '../../../common/constants/imageUrl';
import { ValidationMessages } from '../../../common/constants/validationMessages';
import { UserModel } from '../../../models/userModel';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SharedModule, ValidDirective, BlankComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user: UserModel;
  userEditForm: FormGroup;
  userPasswordUpdateForm: FormGroup;
  validationMessages: ValidationMessages = new ValidationMessages();
  constImageUrl: ImageUrl = new ImageUrl();
  activeTab: string = 'settings';
  image: File;
  imageUrls: { imageUrl: string; name: string; size: number }[] = [];
  isImageSelected = false;

  constructor(
    private authService: AuthService,
    private http: HttpService,
    private formBuilder: FormBuilder,
    private swal: SwalService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUserDetail();
    this.createUserEditForm();
    this.createUserPasswordUpdateForm();
  }


  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }


  getUserDetail(): void {
    const userId = this.authService.isAuthenticatedByUserId;
    this.http
      .get<UserModel>(`User/GetById?Id=${userId}`)
      .subscribe((res) => {
        this.user = res;
        this.userEditForm.patchValue({ ...res});
        this.userService.setUser(res);
      });
  }


  createUserEditForm(): void {
    this.userEditForm = this.formBuilder.group({
      id: [0],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ]
    });
  }


  update(): void {
    if (this.userEditForm.valid) {
      this.http
        .put('User/Update', this.userEditForm.value)
        .subscribe(() => {
          this.swal.callToast('Güncelleme işlemi başarılı!');
          this.getUserDetail();
        });
    }
  }

  createUserPasswordUpdateForm(): void {
    this.userPasswordUpdateForm = this.formBuilder.group(
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

  updatePassword(): void {
    if (this.userPasswordUpdateForm.valid) {
      this.http
        .post<any>('Auth/UpdatePassword', this.userPasswordUpdateForm.value)
        .subscribe((res) => {
          this.swal.callToast(res.message);
        });
    }
  }

  getImages(event: any): void {
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      if (this.validateFileType(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => this.addImage(reader.result as string, file);
      } else {
        console.error('Invalid file type: ', file.type);
      }
    }
  }

  validateFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    return allowedTypes.includes(file.type);
  }

  addImage(imageUrl: string, file: File): void {
    this.imageUrls.push({ imageUrl, name: file.name, size: file.size });
    this.image = file;
    this.isImageSelected = true;
  }

  removeImage(index: number): void {
    this.imageUrls.splice(index, 1);
    if (this.imageUrls.length === 0) {
      this.image = null;
      this.isImageSelected = false;
    }
  }

  saveImage(): void {
    if (this.userEditForm.valid) {
      const formData: FormData = new FormData();
      const userId = this.authService.isAuthenticatedByUserId.toString();
      formData.append('userId', userId);
      formData.append('file', this.image);
      this.http.post<any>('User/AddImage', formData).subscribe((res) => {
        this.swal.callToast(res.message);
        this.getUserDetail();
      });
    }
  }

  // Getters for patientEditForm
  get firstName() {
    return this.userEditForm.get('firstName');
  }
  get lastName() {
    return this.userEditForm.get('lastName');
  }

  // Getters for patientPasswordUpdateForm
  get password() {
    return this.userPasswordUpdateForm.get('password');
  }
  get confirmPassword() {
    return this.userPasswordUpdateForm.get('confirmPassword');
  }
  get oldPassword() {
    return this.userPasswordUpdateForm.get('oldPassword');
  }
}
