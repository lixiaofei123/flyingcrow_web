import Vue from "vue";
import Router from "vue-router";

const TheContainer = () => import("@/containers/TheContainer");

const AdminDashboard = () => import("@/views/dashboard/AdminDashboard");
const UserDashboard = () => import("@/views/dashboard/UserDashboard");
const Monitor = () => import("@/views/monitor/Monitor");

const Storage = () => import("@/views/storage/Storage");
const EditStorage = () => import("@/views/storage/EditStorage");

const CR = () => import("@/views/storage/CR");
const EditCR = () => import("@/views/storage/EditCR");

const Justify = () => import("@/views/storage/Justify");
const EditJustify = () => import("@/views/storage/EditJustify");

const File = () => import("@/views/file/File");
const Images = () => import("@/views/file/Images");

const Token = () => import("@/views/token/Token");

const Users = () => import("@/views/users/Users");
const User = () => import("@/views/users/User");
const Groups = () => import("@/views/users/Groups");
const Group = () => import("@/views/users/Group");

const SiteUploadSetting = () => import("@/views/setting/SiteUploadSetting");
const WaterMarkerSetting = () => import("@/views/setting/WaterMarkerSetting");

const SiteSetting = () => import("@/views/setting/SiteSetting");
const OtherSetting = () => import("@/views/setting/OtherSetting");
const ACSetting = () => import("@/views/setting/ACSetting");

const LocalUpload = () => import("@/views/upload/LocalUpload");
const RemoteDownload = () => import("@/views/upload/RemoteDownload");

const Me = () => import("@/views/me/Me");

const Colors = () => import("@/views/theme/Colors");
const Typography = () => import("@/views/theme/Typography");

const Charts = () => import("@/views/charts/Charts");
const Widgets = () => import("@/views/widgets/Widgets");

const Cards = () => import("@/views/base/Cards");
const Forms = () => import("@/views/base/Forms");
const Switches = () => import("@/views/base/Switches");
const Tables = () => import("@/views/base/Tables");
const Tabs = () => import("@/views/base/Tabs");
const Breadcrumbs = () => import("@/views/base/Breadcrumbs");
const Carousels = () => import("@/views/base/Carousels");
const Collapses = () => import("@/views/base/Collapses");
const Jumbotrons = () => import("@/views/base/Jumbotrons");
const ListGroups = () => import("@/views/base/ListGroups");
const Navs = () => import("@/views/base/Navs");
const Navbars = () => import("@/views/base/Navbars");
const Paginations = () => import("@/views/base/Paginations");
const Popovers = () => import("@/views/base/Popovers");
const ProgressBars = () => import("@/views/base/ProgressBars");
const Tooltips = () => import("@/views/base/Tooltips");

const StandardButtons = () => import("@/views/buttons/StandardButtons");
const ButtonGroups = () => import("@/views/buttons/ButtonGroups");
const Dropdowns = () => import("@/views/buttons/Dropdowns");
const BrandButtons = () => import("@/views/buttons/BrandButtons");

const CoreUIIcons = () => import("@/views/icons/CoreUIIcons");
const Brands = () => import("@/views/icons/Brands");
const Flags = () => import("@/views/icons/Flags");

const Alerts = () => import("@/views/notifications/Alerts");
const Badges = () => import("@/views/notifications/Badges");
const Modals = () => import("@/views/notifications/Modals");

const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");
const Login = () => import("@/views/pages/Login");
const Register = () => import("@/views/pages/Register");

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "hash",
  linkActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes(),
});

function configRoutes() {
  return [
    {
      path: "/",
      redirect: "/dashboard",
      name: "主页",
      component: TheContainer,
      children: [
        {
          path: "dashboard",
          name: "站点面板",
          component: AdminDashboard,
        },
        {
          path: "userdashboard",
          name: "个人面板",
          component: UserDashboard,
        },
        {
          path: "monitor",
          name: "监控面板",
          component: Monitor,
        },
        {
          path: "files",
          meta: {
            label: "文件",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "文件管理",
              component: File,
            },
          ],
        },
        {
          path: "images",
          meta: {
            label: "图片",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "图片管理",
              component: Images,
            },
          ],
        },
        {
          path: "upload",
          redirect: "/upload/local",
          meta: {
            label: "上传",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "local",
              name: "本地上传",
              component: LocalUpload,
            },
            {
              path: "remote",
              name: "远程下载",
              component: RemoteDownload,
            },
          ],
        },
        {
          path: "storages",
          redirect: "/storages",
          meta: {
            label: "存储",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "存储列表",
              component: Storage,
            },
            {
              path: "edit/:id",
              name: "新增/编辑存储",
              component: EditStorage,
            },
            {
              path: "show/:id",
              name: "查看存储",
              component: EditStorage,
            },
          ],
        },
        {
          path: "crs",
          redirect: "/crs",
          meta: {
            label: "审核策略",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "审核策略列表",
              component: CR,
            },
            {
              path: "edit/:id",
              name: "新增/编辑审核策略",
              component: EditCR,
            },
            {
              path: "show/:id",
              name: "查看审核策略",
              component: EditCR,
            },
          ],
        },
        {
          path: "justifys",
          redirect: "/justifys",
          meta: {
            label: "CDN鉴权",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "CDN鉴权列表",
              component: Justify,
            },
            {
              path: "edit/:id",
              name: "新增/编辑鉴权策略",
              component: EditJustify,
            },
            {
              path: "show/:id",
              name: "查看鉴权策略",
              component: EditJustify,
            },
          ],
        },

        {
          path: "users",
          redirect: "/users/list",
          meta: {
            label: "用户",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "list",
              name: "用户列表",
              component: Users,
            },
            {
              path: "groups",
              name: "用户组",
              component: Groups,
            },
            {
              path: "tokens",
              name: "授权码",
              component: Token,
            },
            {
              path: "user/:id",
              meta: {
                label: "用户详情",
              },
              name: "User",
              component: User,
            },
            {
              path: "group/:id",
              meta: {
                label: "用户组详情",
              },
              name: "Group",
              component: Group,
            },
          ],
        },
        {
          path: "setting",
          redirect: "/setting/upload",
          meta: {
            label: "系统设置",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "upload",
              name: "传输设置",
              component: SiteUploadSetting,
            },
            {
              path: "site",
              name: "站点设置",
              component: SiteSetting,
            },
            {
              path: "other",
              name: "其它设置",
              component: OtherSetting,
            },
          ],
        },
        {
          path: "my",
          redirect: "/my",
          meta: {
            label: "个人设置",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "个人资料",
              component: Me,
            },
            {
              path: "marker",
              name: "水印设置",
              component: WaterMarkerSetting,
            },
            {
              path: "ac",
              name: "访问控制",
              component: ACSetting,
            },
          ],
        },
        {
          path: "theme",
          redirect: "/theme/colors",
          name: "Theme",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "colors",
              name: "Colors",
              component: Colors,
            },
            {
              path: "typography",
              name: "Typography",
              component: Typography,
            },
          ],
        },
        {
          path: "charts",
          name: "Charts",
          component: Charts,
        },
        {
          path: "widgets",
          name: "Widgets",
          component: Widgets,
        },
        {
          path: "base",
          redirect: "/base/cards",
          name: "Base",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "cards",
              name: "Cards",
              component: Cards,
            },
            {
              path: "forms",
              name: "Forms",
              component: Forms,
            },
            {
              path: "switches",
              name: "Switches",
              component: Switches,
            },
            {
              path: "tables",
              name: "Tables",
              component: Tables,
            },
            {
              path: "tabs",
              name: "Tabs",
              component: Tabs,
            },
            {
              path: "breadcrumbs",
              name: "Breadcrumbs",
              component: Breadcrumbs,
            },
            {
              path: "carousels",
              name: "Carousels",
              component: Carousels,
            },
            {
              path: "collapses",
              name: "Collapses",
              component: Collapses,
            },
            {
              path: "jumbotrons",
              name: "Jumbotrons",
              component: Jumbotrons,
            },
            {
              path: "list-groups",
              name: "List Groups",
              component: ListGroups,
            },
            {
              path: "navs",
              name: "Navs",
              component: Navs,
            },
            {
              path: "navbars",
              name: "Navbars",
              component: Navbars,
            },
            {
              path: "paginations",
              name: "Paginations",
              component: Paginations,
            },
            {
              path: "popovers",
              name: "Popovers",
              component: Popovers,
            },
            {
              path: "progress-bars",
              name: "Progress Bars",
              component: ProgressBars,
            },
            {
              path: "tooltips",
              name: "Tooltips",
              component: Tooltips,
            },
          ],
        },
        {
          path: "buttons",
          redirect: "/buttons/standard-buttons",
          name: "Buttons",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "standard-buttons",
              name: "Standard Buttons",
              component: StandardButtons,
            },
            {
              path: "button-groups",
              name: "Button Groups",
              component: ButtonGroups,
            },
            {
              path: "dropdowns",
              name: "Dropdowns",
              component: Dropdowns,
            },
            {
              path: "brand-buttons",
              name: "Brand Buttons",
              component: BrandButtons,
            },
          ],
        },
        {
          path: "icons",
          redirect: "/icons/coreui-icons",
          name: "CoreUI Icons",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "coreui-icons",
              name: "Icons library",
              component: CoreUIIcons,
            },
            {
              path: "brands",
              name: "Brands",
              component: Brands,
            },
            {
              path: "flags",
              name: "Flags",
              component: Flags,
            },
          ],
        },
        {
          path: "notifications",
          redirect: "/notifications/alerts",
          name: "Notifications",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "alerts",
              name: "Alerts",
              component: Alerts,
            },
            {
              path: "badges",
              name: "Badges",
              component: Badges,
            },
            {
              path: "modals",
              name: "Modals",
              component: Modals,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      redirect: "/login",
      name: "Pages",
      component: {
        render(c) {
          return c("router-view");
        },
      },
      children: [,
        {
          path: "/login",
          name: "Login",
          component: Login,
        },
        {
          path: "/register",
          name: "Register",
          component: Register,
        },
      ],
    },
  ];
}
