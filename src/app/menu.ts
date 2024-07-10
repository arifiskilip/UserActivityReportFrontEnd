export class MenuModel {
    name: string = '';
    icon: string = '';
    url: string = '';
    isTitle: boolean = false;
    subMenus: MenuModel[] = [];
  }
  
  export const UserMenus: MenuModel[] = [
    {
      name: 'Ana Sayfa',
      icon: 'fa-solid fa-home',
      url: '/admin',
      isTitle: false,
      subMenus: [],
    },
    {
      name: 'Doktorlar',
      icon: 'fa-solid fa-user',
      url: '/admin/doctor',
      isTitle: false,
      subMenus: [],
    },
    {
      name: 'Branşlar',
      icon: 'fa-solid fa-heart',
      url: '/admin/branch',
      isTitle: false,
      subMenus: [],
    },
    {
      name: 'Ünvanlar',
      icon: 'fa-solid fa-clinic-medical',
      url: '/admin/title',
      isTitle: false,
      subMenus: [],
    },
    {
      name: 'Hastalar',
      icon: 'fa-solid fa-bed',
      url: '/admin/patient',
      isTitle: false,
      subMenus: [],
    },
    {
      name: 'Geri Bildirimler',
      icon: 'fa-regular fa-comment',
      url: '/admin/feedback',
      isTitle: false,
      subMenus: [],
    },
  ];