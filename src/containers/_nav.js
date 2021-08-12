let admin_nav = [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "站点面板",
        to: "/admin/dashboard",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "监控面板",
        to: "/admin/monitor",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "个人面板",
        to: "/admin/userdashboard",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "文件管理",
        to: "/admin/files",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "图片管理",
        to: "/admin/images",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "上传",
        route: "/admin/upload",
        icon: "cil-puzzle",
        items: [
          {
            name: "本地上传",
            to: "/admin/upload/local",
          },
          {
            name: "远程下载",
            to: "/admin/upload/remote",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "存储",
        route: "/admin/storages",
        icon: "cil-puzzle",
        items: [
          {
            name: "存储策略",
            to: "/admin/storages",
          },
          {
            name: "内容审核策略",
            to: "/admin/crs",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "用户",
        route: "/admin/users",
        icon: "cil-puzzle",
        items: [
          {
            name: "用户",
            to: "/admin/users/list",
          },
          {
            name: "用户组",
            to: "/admin/users/groups",
          },
          {
            name: "授权码",
            to: "/admin/users/tokens",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "系统设置",
        route: "/admin/setting",
        icon: "cil-puzzle",
        items: [
          {
            name: "传输设置",
            to: "/admin/setting/upload",
          },
          {
            name: "站点设置",
            to: "/admin/setting/site",
          },
          {
            name: "其它设置",
            to: "/admin/setting/other",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "个人设置",
        route: "/admin/my",
        icon: "cil-puzzle",
        items: [
          {
            name: "个人资料",
            to: "/admin/my",
          },
          {
            name: "水印设置",
            to: "/admin/my/marker",
          },
          {
            name: "访问控制",
            to: "/admin/my/ac",
          },
        ],
      },
    ],
  },
];

let user_nav = [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "个人面板",
        to: "/admin/userdashboard",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "文件管理",
        to: "/admin/files",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "图片管理",
        to: "/admin/images",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "上传",
        route: "/admin/upload",
        icon: "cil-puzzle",
        items: [
          {
            name: "本地上传",
            to: "/admin/upload/local",
          },
          {
            name: "远程下载",
            to: "/admin/upload/remote",
          },
        ],
      },
      {
        _name: "CSidebarNavItem",
        name: "授权码",
        to: "/admin/users/tokens",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "个人设置",
        route: "/admin/my",
        icon: "cil-puzzle",
        items: [
          {
            name: "个人资料",
            to: "/admin/my",
          },
          {
            name: "水印设置",
            to: "/admin/my/marker",
          },
          {
            name: "访问控制",
            to: "/admin/my/ac",
          },
        ],
      },
    ],
  },
];

export { admin_nav, user_nav };
