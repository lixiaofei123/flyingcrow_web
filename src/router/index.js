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
      name: "??????",
      component: TheContainer,
      children: [
        {
          path: "dashboard",
          name: "????????????",
          component: AdminDashboard,
        },
        {
          path: "userdashboard",
          name: "????????????",
          component: UserDashboard,
        },
        {
          path: "monitor",
          name: "????????????",
          component: Monitor,
        },
        {
          path: "files",
          meta: {
            label: "??????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "????????????",
              component: File,
            },
          ],
        },
        {
          path: "images",
          meta: {
            label: "??????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "????????????",
              component: Images,
            },
          ],
        },
        {
          path: "upload",
          redirect: "/upload/local",
          meta: {
            label: "??????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "local",
              name: "????????????",
              component: LocalUpload,
            },
            {
              path: "remote",
              name: "????????????",
              component: RemoteDownload,
            },
          ],
        },
        {
          path: "storages",
          redirect: "/storages",
          meta: {
            label: "??????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "????????????",
              component: Storage,
            },
            {
              path: "edit/:id",
              name: "??????/????????????",
              component: EditStorage,
            },
            {
              path: "show/:id",
              name: "????????????",
              component: EditStorage,
            },
          ],
        },
        {
          path: "crs",
          redirect: "/crs",
          meta: {
            label: "????????????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "??????????????????",
              component: CR,
            },
            {
              path: "edit/:id",
              name: "??????/??????????????????",
              component: EditCR,
            },
            {
              path: "show/:id",
              name: "??????????????????",
              component: EditCR,
            },
          ],
        },
        {
          path: "justifys",
          redirect: "/justifys",
          meta: {
            label: "CDN??????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "CDN????????????",
              component: Justify,
            },
            {
              path: "edit/:id",
              name: "??????/??????????????????",
              component: EditJustify,
            },
            {
              path: "show/:id",
              name: "??????????????????",
              component: EditJustify,
            },
          ],
        },

        {
          path: "users",
          redirect: "/users/list",
          meta: {
            label: "??????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "list",
              name: "????????????",
              component: Users,
            },
            {
              path: "groups",
              name: "?????????",
              component: Groups,
            },
            {
              path: "tokens",
              name: "?????????",
              component: Token,
            },
            {
              path: "user/:id",
              meta: {
                label: "????????????",
              },
              name: "User",
              component: User,
            },
            {
              path: "group/:id",
              meta: {
                label: "???????????????",
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
            label: "????????????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "upload",
              name: "????????????",
              component: SiteUploadSetting,
            },
            {
              path: "site",
              name: "????????????",
              component: SiteSetting,
            },
            {
              path: "other",
              name: "????????????",
              component: OtherSetting,
            },
          ],
        },
        {
          path: "my",
          redirect: "/my",
          meta: {
            label: "????????????",
          },
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "",
              name: "????????????",
              component: Me,
            },
            {
              path: "marker",
              name: "????????????",
              component: WaterMarkerSetting,
            },
            {
              path: "ac",
              name: "????????????",
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
