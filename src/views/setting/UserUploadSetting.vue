<template>
  <div>
    <CRow>
      <CCol sm="12" md="6">
        <CCard>
          <CCardBody>
            <CForm>
              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  启用水印
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    :checked.sync="setting.watermark"
                    class="mr-1"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <div v-if="setting.watermark">
                <CRow form class="form-group">
                  <CCol sm="3">
                    水印类型
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <select
                          class="form-control"
                          v-model="setting.watermarkConfig.type"
                          style="width:100%"
                        >
                          <option :value="0">文本</option>
                          <option :value="1">图片</option>
                        </select>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="3">
                    水印位置
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <select
                          class="form-control"
                          v-model="setting.watermarkConfig.position"
                          style="width:100%"
                        >
                          <option :value="0">左上角</option>
                          <option :value="1">上方水平居中</option>
                          <option :value="2">右上角</option>
                          <option :value="3">左侧垂直居中</option>
                          <option :value="4">居中</option>
                          <option :value="5">右侧垂直居中</option>
                          <option :value="6">左下角</option>
                          <option :value="7">下方水平居中</option>
                          <option :value="8">右下角</option>
                        </select>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group" v-if="horizontalPaddingText">
                  <CCol sm="3">
                    {{ horizontalPaddingText }}
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-slider
                          v-model="setting.watermarkConfig.horizontalPadding"
                          :min="0"
                          :max="1000"
                        ></el-slider>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group" v-if="verticalPaddingText">
                  <CCol sm="3">
                    {{ verticalPaddingText }}
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-slider
                          v-model="setting.watermarkConfig.verticalPadding"
                          :min="0"
                          :max="1000"
                        ></el-slider>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="3">
                    最小宽度
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-slider
                          v-model="setting.watermarkConfig.minWidth"
                          :min="0"
                          :max="1000"
                        ></el-slider>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="3">
                    最小高度
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-slider
                          v-model="setting.watermarkConfig.minHeight"
                          :min="0"
                          :max="1000"
                        ></el-slider>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>

              <div
                v-if="setting.watermark && setting.watermarkConfig.type === 0"
              >
                <CInput
                  label="文本内容"
                  type="text"
                  v-model="setting.watermarkConfig.text"
                  horizontal
                />
                <CRow form class="form-group">
                  <CCol sm="3">
                    文字颜色
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-color-picker
                          v-model="setting.watermarkConfig.textColor"
                        ></el-color-picker>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="3">
                    文字大小
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-slider
                          v-model="setting.watermarkConfig.textSize"
                          :min="0"
                          :max="100"
                        ></el-slider>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
              <div
                v-if="setting.watermark && setting.watermarkConfig.type === 1"
              >
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    水印图片
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <div class="c-WaterImg" style="width:80px;height:80px;">
                          <img
                            :height="50"
                            :src="waterImg"
                            onerror="this.src='img/default_avatar.png'"
                          />
                        </div>
                        <el-upload
                          class="upload-WaterImg"
                          :action="uploadAction"
                          name="file"
                          multiple
                          :limit="1"
                          :show-file-list="false"
                          :on-success="uploadWaterImgSuccess"
                          :before-upload="beforeWaterImgUpload"
                          :on-error="uploadWaterImgError"
                          :headers="headers"
                          accept="image/png,image/jpeg"
                        >
                          <CButton class="btn" size="sm" color="primary"
                            >更换图片</CButton
                          >
                          <span
                            v-if="tipText"
                            v-bind:style="{ color: tipColor }"
                            >{{ tipText }}</span
                          >
                        </el-upload>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="3">
                    缩放比例
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-slider
                          v-model="setting.watermarkConfig.scale"
                          :step="0.1"
                          :min="0"
                          :max="5"
                        ></el-slider>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>

              <CRow form class="form-group">
                <CCol tag="label" sm="3" class="col-form-label">
                  启用压缩
                </CCol>
                <CCol sm="9">
                  <CSwitch
                    :checked.sync="setting.isCompress"
                    class="mr-1"
                    color="primary"
                  />
                </CCol>
              </CRow>
              <div v-if="setting.isCompress">
                <CRow form class="form-group">
                  <CCol sm="3">
                    压缩算法
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <select
                          class="form-control"
                          v-model="setting.compressConfig.type"
                          style="width:100%"
                        >
                          <option :value="0">JPEG</option>
                          <option :value="1">ZLIB</option>
                          <option :value="2">PNG</option>
                          <option :value="3">LZ4</option>
                        </select>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow form class="form-group">
                  <CCol sm="3">
                    压缩质量<HelpTips
                      tips="压缩质量只对jpeg算法有效"
                    ></HelpTips>
                  </CCol>
                  <CCol sm="9">
                    <CRow>
                      <CCol sm="12">
                        <el-slider
                          v-model="setting.compressConfig.quatile"
                          :min="0"
                          :max="100"
                        ></el-slider>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
            </CForm>
            <CRow form class="form-group">
              <CCol tag="label" sm="3" class="col-form-label"> </CCol>
              <CCol sm="6" md="4">
                <CButton block color="primary" size="sm" @click="saveSetting"
                  >保存配置</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol class="d-md-down-none" md="6">
        <CCard>
          <CCardHeader>
            预览图
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="12">
                <div class="preview">
                  <img
                    id="watermark_bg"
                    src="/img/demo.png"
                    style="width:100%"
                    @load="getDemoBgSize"
                  />
                  <div
                    id="watermark"
                    :style="{
                      position: 'absolute',
                      left: left,
                      top: top,
                    }"
                  >
                    <div
                      v-if="setting.watermarkConfig.type === 0"
                      :style="{
                        fontSize: setting.watermarkConfig.textSize + 'px',
                        color: setting.watermarkConfig.textColor,
                      }"
                    >
                      {{ setting.watermarkConfig.text }}
                    </div>
                    <img
                      v-if="setting.watermarkConfig.type === 1"
                      :src="waterImg"
                      :style="{ transform: transform }"
                    />
                  </div>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import HelpTips from "../base/HelpTips.vue";
import { getSetting, setSetting, fileInfoById } from "../../api/api";
var cookies = require("vue-cookie");
import elementResizeDetectorMaker from "element-resize-detector";

export default {
  name: "UserUploadSetting",
  components: {
    HelpTips,
  },
  data() {
    return {
      setting: {
        watermark: false,
        watermarkConfig: {
          type: 0,
          text: "",
          textColor: "",
          textSize: 0,
          imageId: 0,
          position: 0,
          verticalPadding: 0,
          horizontalPadding: 0,
          isScale: false,
          scale: 0,
          minWidth: 0,
          minHeight: 0,
        },
        isCompress: false,
        compressConfig: {
          type: 0,
          quatile: 0,
        },
      },
      waterImg: "",
      fileId: 0,
      tipColor: "green",
      tipText: "",
      uploadAction: "",
      headers: {},
      wartermarkWidth: 0,
      wartermarkHeight: 0,
      wartermarkBgWidth: 0,
      wartermarkBgHeight: 0,
    };
  },

  mounted() {
    const _this = this;
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById("watermark"), (element) => {
      _this.$nextTick(() => {
        this.wartermarkWidth = element.clientWidth;
        this.wartermarkHeight = element.clientHeight;
      });
    });
  },
  created: function() {
    this.uploadAction = `${window.globalConfig.url}/file/upload`;
    getSetting(
      "userupload",
      (data) => {
        if (data.code === 200) {
          this.setting = data.data;
          this.fileId = this.setting.watermarkConfig.imageId;
        }
      },
      (data) => {
        this.$notify.error({
          title: "错误",
          message: `加载上传配置出错，原因${data.reason}`,
        });
      }
    );
  },
  methods: {
    getDemoBgSize() {
      let element = document.getElementById("watermark_bg");
      this.wartermarkBgWidth = element.clientWidth;
      this.wartermarkBgHeight = element.clientHeight;
    },
    beforeWaterImgUpload(file) {
      const isImage = file.type === "image/jpeg" || file.type === "image/png";
      const isLt400K = file.size / 1024 / 1024 / 1024 < 400;

      if (!isImage) {
        this.uploadErrorInfo("上传水印图片图片只能是 JPG/PNG 格式!");
      }
      if (!isLt400K) {
        this.uploadErrorInfo("上传水印图片图片大小不能超过 400KB!");
      }

      this.headers["authorization"] = cookies.get("authorization");

      return isImage && isLt400K;
    },
    uploadSuccessInfo(msg) {
      this.tipColor = "green";
      this.tipText = msg;
    },
    uploadErrorInfo(msg) {
      this.tipColor = "red";
      this.tipText = msg;
    },
    uploadWaterImgError() {
      this.uploadErrorInfo("上传水印图片失败");
    },
    uploadWaterImgSuccess(response) {
      if (response.code === 200) {
        this.fileId = response.data.fileId;
        //this.user.WaterImg = response.data.urls[0];
      }
      this.uploadSuccessInfo("图片上传成功，水印图片将在保存后生效");
      this.setting.watermarkConfig.scale = 1
    },
    saveSetting() {
      setSetting(
        "userupload",
        this.setting,
        (data) => {
          if (data.code === 200) {
            this.$notify({
              title: "成功",
              message: `保存上传配置成功`,
              type: "success",
            });
          }
        },
        (data) => {
          this.$notify.error({
            title: "错误",
            message: `保存上传配置出错，原因${data.reason}`,
          });
        }
      );
    },
  },
  computed: {
    horizontalPaddingText: function() {
      if (
        this.setting.watermarkConfig.position == 0 ||
        this.setting.watermarkConfig.position == 3 ||
        this.setting.watermarkConfig.position == 6
      ) {
        return "左间距";
      } else if (
        this.setting.watermarkConfig.position == 2 ||
        this.setting.watermarkConfig.position == 5 ||
        this.setting.watermarkConfig.position == 8
      ) {
        return "右间距";
      } else {
        return "";
      }
    },
    verticalPaddingText: function() {
      if (
        this.setting.watermarkConfig.position == 0 ||
        this.setting.watermarkConfig.position == 1 ||
        this.setting.watermarkConfig.position == 2
      ) {
        return "顶部间距";
      } else if (
        this.setting.watermarkConfig.position == 6 ||
        this.setting.watermarkConfig.position == 7 ||
        this.setting.watermarkConfig.position == 8
      ) {
        return "底部间距";
      } else {
        return "";
      }
    },
    transform: function() {
      return "scale(" + this.setting.watermarkConfig.scale + ")";
    },
    left: function() {
      let realMarkWidth =
        this.wartermarkWidth *
        (this.setting.watermarkConfig.type == 1
          ? this.setting.watermarkConfig.scale
          : 1);
      let offset =
        this.setting.watermarkConfig.type == 1
          ? (this.wartermarkWidth * (1 - this.setting.watermarkConfig.scale)) /
            2
          : 0;
      let padding = this.setting.watermarkConfig.horizontalPadding;
      if (
        this.setting.watermarkConfig.position == 0 ||
        this.setting.watermarkConfig.position == 3 ||
        this.setting.watermarkConfig.position == 6
      ) {
        let maxLeft = this.wartermarkBgWidth - realMarkWidth;
        return (padding <= maxLeft ? padding : maxLeft) - offset + "px";
      } else if (
        this.setting.watermarkConfig.position == 2 ||
        this.setting.watermarkConfig.position == 5 ||
        this.setting.watermarkConfig.position == 8
      ) {
        let left = this.wartermarkBgWidth - realMarkWidth - padding;
        return (left >= 0 ? left : 0) - offset + "px";
      } else {
        return (this.wartermarkBgWidth - realMarkWidth) / 2 - offset + "px";
      }
    },
    top: function() {
      let realMarkHeight =
        this.wartermarkHeight *
        (this.setting.watermarkConfig.type == 1
          ? this.setting.watermarkConfig.scale
          : 1);
      let offset =
        this.setting.watermarkConfig.type == 1
          ? (this.wartermarkHeight * (1 - this.setting.watermarkConfig.scale)) /
            2
          : 0;
      let padding = this.setting.watermarkConfig.verticalPadding;
      if (
        this.setting.watermarkConfig.position == 0 ||
        this.setting.watermarkConfig.position == 1 ||
        this.setting.watermarkConfig.position == 2
      ) {
        let maxTop = this.wartermarkBgHeight - realMarkHeight;
        return (padding <= maxTop ? padding : maxTop) - offset + "px";
      } else if (
        this.setting.watermarkConfig.position == 6 ||
        this.setting.watermarkConfig.position == 7 ||
        this.setting.watermarkConfig.position == 8
      ) {
        let top = this.wartermarkBgHeight - realMarkHeight - padding;
        return (top >= 0 ? top : 0) - offset + "px";
      } else {
        return (this.wartermarkBgHeight - realMarkHeight) / 2 - offset + "px";
      }
    },
  },
  watch: {
    fileId(newVal) {
      if (newVal > 0) {
        fileInfoById(
          newVal,
          (data) => {
            if (data.code === 200) {
              let url = data.data.urls[0];
              this.waterImg = url;
              this.setting.watermarkConfig.imageId = this.fileId;
            }
          },
          (data) => {
            this.$notify.error({
              title: "错误",
              message: `加载水印图片失败，原因${data.reason}`,
            });
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 200px;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}

button {
  border-radius: 2px;
  border: none;
  margin-left: 2px;
  margin-right: 2px;
  font-size: 12px;
  outline: none;
}
.tab-pane {
  padding-top: 40px;
}

.preview {
  width: 100%;
  max-width: 600px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
</style>
