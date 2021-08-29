let admin_nav = [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "站点面板",
        to: "/dashboard",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "监控面板",
        to: "/monitor",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "个人面板",
        to: "/userdashboard",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "文件管理",
        to: "/files",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "图片管理",
        to: "/images",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "上传",
        route: "/upload",
        icon: "cil-puzzle",
        items: [
          {
            name: "本地上传",
            to: "/upload/local",
          },
          {
            name: "远程下载",
            to: "/upload/remote",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "存储",
        route: "/storages",
        icon: "cil-puzzle",
        items: [
          {
            name: "存储策略",
            to: "/storages",
          },
          {
            name: "内容审核策略",
            to: "/crs",
          },
          {
            name: "CDN鉴权策略",
            to: "/justifys",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "用户",
        route: "/users",
        icon: "cil-puzzle",
        items: [
          {
            name: "用户",
            to: "/users/list",
          },
          {
            name: "用户组",
            to: "/users/groups",
          },
          {
            name: "授权码",
            to: "/users/tokens",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "系统设置",
        route: "/setting",
        icon: "cil-puzzle",
        items: [
          {
            name: "传输设置",
            to: "/setting/upload",
          },
          {
            name: "站点设置",
            to: "/setting/site",
          },
          {
            name: "其它设置",
            to: "/setting/other",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "个人设置",
        route: "/my",
        icon: "cil-puzzle",
        items: [
          {
            name: "个人资料",
            to: "/my",
          },
          {
            name: "水印设置",
            to: "/my/marker",
          },
          {
            name: "访问控制",
            to: "/my/ac",
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
        to: "/userdashboard",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "文件管理",
        to: "/files",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavItem",
        name: "图片管理",
        to: "/images",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "上传",
        route: "/upload",
        icon: "cil-puzzle",
        items: [
          {
            name: "本地上传",
            to: "/upload/local",
          },
          {
            name: "远程下载",
            to: "/upload/remote",
          },
        ],
      },
      {
        _name: "CSidebarNavItem",
        name: "授权码",
        to: "/users/tokens",
        icon: "cil-speedometer",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "个人设置",
        route: "/my",
        icon: "cil-puzzle",
        items: [
          {
            name: "个人资料",
            to: "/my",
          },
          {
            name: "水印设置",
            to: "/my/marker",
          },
          {
            name: "访问控制",
            to: "/my/ac",
          },
        ],
      },
    ],
  },
];

export { admin_nav, user_nav };
