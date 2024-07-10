import { Component } from '@angular/core';
import { SharedModule } from '../../common/shared/shared.module';
import { UserHeaderComponent } from "./user-header/user-header.component";
import { UserSidebarComponent } from "./user-sidebar/user-sidebar.component";
import { UserFooterComponent } from "./user-footer/user-footer.component";

@Component({
    selector: 'app-user-layout',
    standalone: true,
    templateUrl: './user-layout.component.html',
    styleUrl: './user-layout.component.scss',
    imports: [SharedModule, UserHeaderComponent, UserSidebarComponent, UserFooterComponent]
})
export class UserLayoutComponent {

}
