<template>
  <div>
    <CRow>
      <CCol col="12" lg="6">
        <CCard>
          <CCardHeader> {{ user.name }} 信息 </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol sm="3">
                  头像
                </CCol>
                <CCol sm="9">
                  <CRow>
                    <CCol sm="12">
                      <div class="c-avatar" style="width:80px;height:80px;">
                        <img
                          :src="user.avatar"
                          class="c-avatar-img "
                        />
                      </div>
                      <br>
                      <CButton
                        class="btn"
                        size="sm"
                        color="primary"
                        @click="selectFile"
                        >更换头像</CButton
                      >
                      <span :style="{color:tipColor}">&nbsp;&nbsp;{{tipText}}</span>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CInput
                label="登录账号"
                horizontal
                :disabled="true"
                v-model="user.name"
              /><CInput label="昵称" horizontal v-model="user.nickName" />
              <CTextarea label="心情" v-model="user.mood" horizontal rows="3" />
              <CInput
                label="用户组"
                horizontal
                :disabled="true"
                v-model="user.groupName"
              />
              <CInput label="邮箱" horizontal v-model="user.email" />
              <CInput
                label="用户角色"
                horizontal
                :disabled="true"
                v-model="roleTypes[user.role]"
              />
              <CInput
                label="存储配额"
                type="number"
                append="MB"
                horizontal
                v-model="user.storageQuota"
                :disabled="true"
              />
              <CInput
                label="流量配额"
                type="number"
                append="MB"
                horizontal
                v-model="user.trafficQuota"
                :disabled="true"
              />
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton class="btn" color="primary" @click="updateUser"
              >更新个人资料</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol col="12" lg="6">
        <CRow>
          <CCol md="6">
            <CWidgetProgress
              :header="usedStorageQuotaText"
              text="已使用存储"
              :footer="usedStorageQuotaTip"
              :color="usedStorageQuotaColor"
              inverse
              :value="usedStorageQuotaProgress"
            />
          </CCol>
          <CCol md="6">
            <CWidgetProgress
              :header="usedTrafficQuotaText"
              text="本月使用流量"
              :footer="usedTrafficQuotaTip"
              :color="usedTrafficQuotaColor"
              inverse
              :value="usedTrafficQuotaProgress"
            />
          </CCol>
        </CRow>
      </CCol>
    </CRow>
    <AvatarEditor
      @cancel="showAvatarEditModel = false"
      @avatar="selectAvatar"
      :imageData="avatarBase64Str"
      :show="showAvatarEditModel"
    />
  </div>
</template>

<script>
import { myInfo, updateMyInfo, uploadNoNameFile } from "../../api/api";
import { wellSize } from "../../utils/utils";
import AvatarEditor from "../components/AvatarEditor";

export default {
  name: "Me",
  components: { AvatarEditor },
  data() {
    return {
      showAvatarEditModel: false,
      roleTypes: {
        user: "普通用户",
        admin: "管理员",
        superadmin: "超级管理员",
      },
      user: {},
      stat: {
        usedStorage: 0,
        usedTraffic: 0,
      },
      tipColor: "green",
      tipText: "",
      uploadAction: "",
      headers: {},
      avatarBase64Str: "",
    };
  },
  created() {
    let userId = this.$route.params.id;
    this.uploadAction = `${window.globalConfig.url}/file/upload`;
    this.resetUser(userId);
  },
  computed: {
    usedStorageQuotaText() {
      return wellSize(this.stat.usedStorage);
    },
    usedTrafficQuotaText() {
      return wellSize(this.stat.usedTraffic);
    },
    usedStorageQuotaColor() {
      if (this.usedStorageQuotaProgress <= 50) {
        return "gradient-info";
      } else if (this.usedStorageQuotaProgress <= 80) {
        return "gradient-warning";
      } else {
        return "gradient-danger";
      }
    },
    usedTrafficQuotaColor() {
      if (this.usedTrafficQuotaProgress <= 50) {
        return "gradient-info";
      } else if (this.usedTrafficQuotaProgress <= 80) {
        return "gradient-warning";
      } else {
        return "gradient-danger";
      }
    },
    usedStorageQuotaTip() {
      if (this.usedStorageQuotaProgress <= 50) {
        return "目前存储空间充裕";
      } else if (this.usedStorageQuotaProgress <= 80) {
        return "存储空间告急";
      } else if (this.usedStorageQuotaProgress < 100) {
        return "存储即将用尽";
      } else {
        return "存储已经用尽";
      }
    },
    usedTrafficQuotaTip() {
      if (this.usedTrafficQuotaProgress <= 50) {
        return "目前流量充裕";
      } else if (this.usedTrafficQuotaProgress <= 80) {
        return "流量告急";
      } else if (this.usedTrafficQuotaProgress < 100) {
        return "流量即将用尽";
      } else {
        return "流量已经用尽";
      }
    },
    usedStorageQuotaProgress() {
      return (
        (this.stat.usedStorage / 1024 / 1024 / this.user.storageQuota) * 100
      );
    },
    usedTrafficQuotaProgress() {
      return (
        (this.stat.usedTraffic / 1024 / 1024 / this.user.trafficQuota) * 100
      );
    },
  },
  methods: {
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },
    selectAvatar(base64Str) {
      this.showAvatarEditModel = false
      let file = this.dataURLtoFile(base64Str,"avatar.png")
      uploadNoNameFile(
        file,
        () => {
          
        },
        (data) => {
          this.uploadAvatarSuccess(data);
        },
        (data) => {
          let error = {
            message: JSON.stringify(data),
          };
          this.uploadAvatarError();
        }
      );
    },
    selectFile() {
      let that = this;
      let fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("style", "visibility:hidden");
      fileInput.setAttribute("accept", "image/png,image/jpeg");
      fileInput.addEventListener("change", function() {
        if (this.files.length > 0) {
          // 读取base64编码数据
          let file = this.files[0];
          let reader = new FileReader();
          reader.onload = (event) => {
            let base64Str = event.target.result;
            that.avatarBase64Str = base64Str;
            that.showAvatarEditModel = true;
          };
          reader.readAsDataURL(file);
        }
        document.body.removeChild(fileInput);
      });
      document.body.appendChild(fileInput);
      fileInput.click();
    },
    uploadSuccessInfo(msg) {
      this.tipColor = "green";
      this.tipText = msg;
    },
    uploadErrorInfo(msg) {
      this.tipColor = "red";
      this.tipText = msg;
    },
    uploadAvatarError() {
      this.uploadErrorInfo("上传头像失败");
    },
    uploadAvatarSuccess(response) {
      if (response.code === 200) {
        this.user.avatar = response.data.urls[0];
      }
      this.uploadSuccessInfo("图片上传成功，头像将在保存后生效");
    },
    resetUser() {
      myInfo(
        (data) => {
          if (data.code === 200) {
            this.user = data.data.user;
            this.stat = data.data.stat;
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `获取个人资料失败，原因${data.reason}`,
          });
        }
      );
    },
    updateUser() {
      updateMyInfo(
        this.user,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `个人资料更新成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `更新个人资料失败，原因${data.reason}`,
          });
        }
      );
    },
  },
};
</script>
<style scoped>
.btn {
  margin-right: 20px;
}
.usedQuota {
  text-align: center;
}
</style>
