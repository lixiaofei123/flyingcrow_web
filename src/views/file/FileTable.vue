<template>
  <div>
    <div class="table_line">
      <div class="name">名称</div>
      <div class="d-md-down-none modifytime">修改时间</div>
      <div class="d-md-down-none size">大小</div>
    </div>
    <div class="table_line" v-for="item in items" v-bind:key="item.name">
      <div class="name" @click="openFile(item)">
        <img class="fileicon" :src="fileIcon(item)" />
        <span style="vertical-align:middle;">{{ item.name }}</span>
      </div>
      <div class="opera">
        <CDropdown color="link" :caret="false">
          <template #toggler-content>
            <CIcon :height="25" :content="$options.freeSet.cilOptions" />
          </template>
          <CDropdownItem v-if="!item.isDict" @click="openFile(item)"
            >查看详情</CDropdownItem
          >
          <CDropdownItem
            ><span style="color:red" @click="deleteFile(item)"
              >删除</span
            ></CDropdownItem
          >
        </CDropdown>
      </div>
      <div class="d-md-down-none modifytime">{{ item.modifytime }}</div>
      <div class="d-md-down-none size">{{ item.size }}</div>
    </div>
  </div>
</template>

<script>
import { freeSet } from "@coreui/icons";

export default {
  name: "FileTable",
  freeSet,
  props: {
    items: Array,
  },
  data() {
    return {};
  },
  methods: {
    fileIcon(item) {
      if (item.isDict) {
        return "img/diricon.png";
      } else {
        return "img/fileicon.png";
      }
    },
    openFile(item) {
      if (item.isDict) {
        this.$emit("openDir", item.fullPath);
      } else {
        this.$emit("fileInfo", item.fullPath);
      }
    },
    deleteFile(item) {
      if (!item.isDict) {
        this.$emit("deleteFile", item.id);
      }
    },
  },
};
</script>

<style scoped>
.remove-padding {
  margin-left: 0px;
  margin-right: 0px;
}

.table_line {
  display: flex;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(247, 247, 247);
  vertical-align: middle;
}
.table_line:first-child {
  color: rgb(202, 202, 202);
}
.table_line:not(:first-child) {
  cursor: pointer;
}
.table_line:not(:first-child):hover {
  background: rgb(236, 236, 236);
}
.name {
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fileicon {
  width: 35px;
  height: 35px;
  margin-right: 10px;
  vertical-align: middle;
}
.opera {
  flex-shrink: 0;
  text-align: center;
  vertical-align: middle;
}
.modifytime {
  width: 200px;
  flex-shrink: 0;
  text-align: center;
  vertical-align: middle;
}
.size {
  width: 120px;
  flex-shrink: 0;
  text-align: center;
  vertical-align: middle;
}

.modifytime:not(:first-child) {
  padding-top: 6px;
}
.size:not(:first-child) {
  padding-top: 6px;
}
</style>
