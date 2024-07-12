import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../common/constants/validationMessages';
import { ValidDirective } from '../../../common/directives/valid.directive';
import { SharedModule } from '../../../common/shared/shared.module';
import { MenuPipe } from '../../../pipes/menu.pipe';
import { HttpService } from '../../../services/http.service';
import { SwalService } from '../../../services/swal.service';
import { UserMenus } from '../../../menu';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/userModel';
import { ImageUrl } from '../../../common/constants/imageUrl';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [SharedModule, MenuPipe, ValidDirective],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.scss'
})
export class UserSidebarComponent{
  search: string = "";
  menus = UserMenus;


  constructor(private userService:UserService, private authService:AuthService) {
    this.getPatientDetail();
    this.userService.user$.subscribe(user=>{
      this.user = user;
    })
  }

  user:UserModel;
  constImageUrl:ImageUrl = new ImageUrl();
  getPatientDetail(){
    this.userService.getPatientDetail("User/GetById?Id="+this.authService.isAuthenticatedByUserId)
    .subscribe(res=>{
      this.user = res
    })
  }

  }
