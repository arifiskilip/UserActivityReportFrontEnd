export class MenuModel {
    name: string = '';
    icon: string = '';
    url: string = '';
    isTitle: boolean = false;
    subMenus: MenuModel[] = [];
  }
  
  export const UserMenus: MenuModel[] = [
    {
      name: 'Profilim',
      icon: 'fa-solid fa-user',
      url: '/user/profile',
      isTitle: false,
      subMenus: [],
    },
    {
      name: 'Aktivitelerim',
      icon: 'fa-solid fa-home',
      url: '/user',
      isTitle: false,
      subMenus: [],
    }
  ];
