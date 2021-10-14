<!---*
* @description  服务配置
* @fileName servicesSet.vue
* @author 叶金龙
* @date 2020/12/01 19:49:20
*--->
<template>
  <el-dialog
    title="服务管理"
    :visible.sync="servicesVisible"
    width="634px"
    :before-close="beforeClose"
    :close-on-click-modal="false"
  >
    <div class="fastSearch" v-if="!dataObj">
      <label>公司名称/ID：</label>
      <el-select
        v-model="searchVal"
        filterable
        placeholder="请输入公司关键字/ID查询"
        clearable
        remote
        :remote-method="remoteMethod"
        :loading="searchLoading"
        @change="companyChange"
      >
        <el-option
          v-for="item in restaurantsOptions"
          :key="item.id"
          :label="item.company_name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="contentBox">
      <div class="tabs">
        <div
          :class="['item', { active: currentIndex == index }]"
          v-for="(item, index) in tabs"
          :key="index"
          @click="toggleTab(index)"
        >
          {{ item.text }}
        </div>
      </div>
      <div class="servicesSec">
        <div class="left" v-if="currentIndex == 0">
          <div class="sec top">
            <div class="text">请选择需要开通的服务 <span>*</span></div>
            <ul class="lists">
              <li
                :class="['item', { active: onIndex == index }]"
                v-for="(item, index) in onservicesArr"
                :key="index"
                @click.stop="showSupplier(item, index)"
              >
                <div :class="['tag', { on: isOn(item.id) }]">
                  {{ isOn(item.id) ? "已开通" : "未开通" }}
                </div>
                <div
                  class="iconBox"
                  :style="{
                    backgroundColor: iconConfig[item.id].bgc,
                  }"
                >
                  <i
                    :class="['iconfont', iconConfig[item.id].icon]"
                    :style="{ color: iconConfig[item.id].color }"
                  ></i>
                </div>
                <div class="name">{{ item.name }}</div>
                <el-checkbox
                  v-model="item.checked"
                  :disabled="isOn(item.id)"
                  @change.self="
                    (value) =>
                      changeServer(value, 'onsupplier', 'noOnServer', index, item)
                  "
                ></el-checkbox>
              </li>
            </ul>
            <p class="notice" v-if="noOnServer">请选择需要开通的服务</p>
          </div>
          <div class="sec bottom" v-if="onCompanys.length > 0">
            <div class="text">请选择{{ onserverName }}供应商 <span>*</span></div>
            <ul class="onCompanys">
              <el-radio-group v-model="onsupplier[onserverId].id">
                <el-radio
                  v-for="(item, index) in onCompanys"
                  :key="index"
                  :label="item.id"
                  :disabled="item.disabled"
                  @change.self="(value) => changeSupplier(value, item)"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </ul>
          </div>
          <div class="sec reason">
            <div class="text">开通服务原因 <span>*</span></div>
            <div class="reasonText">
              <el-input
                type="textarea"
                v-model.trim="onForm.apply_reason"
                placeholder="最多输入200字，超出不可输入"
                maxlength="200"
                show-word-limit
                @input="(value) => reasonChange(value, 'onForm', 'noOnReason')"
              ></el-input>
              <p class="notice" v-if="noOnReason">请填写开通服务的原因</p>
            </div>
          </div>
          <div class="sec">
            <div class="text">上传协议附件</div>
            <div class="uploadBox">
              <upload
                :tips="'上传文件大小不能超过5M,数量不大于5个'"
                :beforeUpload="beforeUpload"
                :obj="onForm"
                :fileKey="'file_url_list'"
                :handleFileSuccessBack="onSuccessBack"
                :handlerFileRemoveBack="onRemoveBack"
              />
            </div>
          </div>
        </div>
        <div class="right" v-if="currentIndex == 1">
          <div class="sec top">
            <div class="text">请选择需要关闭的服务 <span>*</span></div>
            <ul class="lists">
              <li
                :class="['item', { active: offIndex == index }]"
                v-for="(item, index) in offservicesArr"
                :key="index"
                @click.stop="showSupplier(item, index)"
              >
                <div :class="['tag', { on: isOn(item.id) }]">
                  {{ isOn(item.id) ? "已开通" : "未开通" }}
                </div>
                <div
                  class="iconBox"
                  :style="{
                    backgroundColor: iconConfig[item.id].bgc,
                  }"
                >
                  <i
                    :class="['iconfont', iconConfig[item.id].icon]"
                    :style="{ color: iconConfig[item.id].color }"
                  ></i>
                </div>
                <div class="name">{{ item.name }}</div>
                <el-checkbox
                  v-model="item.checked"
                  :disabled="!isOn(item.id)"
                  @change.self="
                    (value) =>
                      changeServer(value, 'offsupplier', 'noOffServer', index, item)
                  "
                ></el-checkbox>
              </li>
            </ul>
            <p class="notice" v-if="noOffServer">请选择需要关闭的服务</p>
          </div>
          <div class="sec bottom" v-if="offCompanys.length > 0">
            <div class="text">请选择{{ offserverName }}供应商 <span>*</span></div>
            <ul class="onCompanys">
              <el-radio-group v-model="offsupplier[offserverId].id">
                <el-radio
                  v-for="(item, index) in offCompanys"
                  :key="index"
                  :label="item.id"
                  :disabled="item.disabled"
                  @change.self="(value) => changeSupplier(value, item)"
                  >{{ item.name }}</el-radio
                >
              </el-radio-group>
            </ul>
          </div>
          <div class="sec reason">
            <div class="text">关闭服务原因 <span>*</span></div>
            <div class="reasonText">
              <el-input
                type="textarea"
                v-model.trim="offForm.apply_reason"
                placeholder="最多输入200字，超出不可输入"
                maxlength="200"
                show-word-limit
                @input="(value) => reasonChange(value, 'offForm', 'noOffReason')"
              ></el-input>
              <p class="notice" v-if="noOffReason">请填写关闭服务的原因</p>
            </div>
          </div>
          <div class="sec">
            <div class="text">上传协议附件</div>
            <div class="uploadBox">
              <upload
                :tips="'上传文件大小不能超过5M,数量不大于5个'"
                :beforeUpload="beforeUpload"
                :obj="offForm"
                :fileKey="'file_url_list'"
                :handleFileSuccessBack="onSuccessBack"
                :handlerFileRemoveBack="onRemoveBack"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取 消</el-button>
      <el-button type="primary" @click="submit" size="medium" :loading="loading">{{
        currentIndex == 0 ? "开 通" : "关 闭"
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { servicesProvides, companyListSelect } from "@/api/common";
import { serverApply } from "@/api/leadManagement/followUp";
import { serviceItemInfo } from "@/api/leadManagement/serviceApply";
import upload from "@/components/upload/upload";
export default {
  name: "servicesSet",
  components: { upload },
  data() {
    return {
      loading: false,
      tabs: [{ text: "开通服务" }, { text: "关闭服务" }],
      currentIndex: null,
      onservicesArr: [],
      offservicesArr: [],
      server: [],
      iconConfig: {
        YuncApp: { color: "#FEAD35", icon: "iconyuncang", bgc: "#FEF6EA" },
        YunjApp: { color: "#4ABCFF", icon: "iconcaigou", bgc: "#EBF5FD" },
        AdsApp: { color: "#3FD282", icon: "iconguanggao", bgc: "#EBFAF2" },
        // YunXApp: { color: "#5BCDE3", icon: "iconzhaohuowang", bgc: "#ECF9FB" },  //暂时适用xshoopy
      },
      onCompanys: [],
      onserverName: "",
      onsupplier: {
        YuncApp: { id: "", bool: false, mutil: false },
        YunjApp: { id: "", bool: false, mutil: true },
        AdsApp: { id: "", bool: false, mutil: false },
        // YunXApp: { id: "", bool: false, mutil: false }, //暂时适用xshoopy
      },
      onserverId: "",
      onIndex: null,
      onForm: {
        file_url_list: [],
        apply_reason: "",
        server: {},
        apply_type: 1,
        company_id: null,
      },
      offCompanys: [],
      offserverName: "",
      offsupplier: {
        YuncApp: { id: "", bool: false, mutil: false },
        YunjApp: { id: "", bool: false, mutil: true },
        AdsApp: { id: "", bool: false, mutil: false },
        // YunXApp: { id: "", bool: false, mutil: false }, //暂时适用xshoopy
      },
      offserverId: "",
      offIndex: null,
      offForm: {
        file_url_list: [],
        apply_reason: "",
        server: {},
        apply_type: 0,
        company_id: null,
      },
      noOffReason: false,
      noOnReason: false,
      noOnServer: false,
      noOffServer: false,
      searchVal: "",
      searchLoading: false,
      restaurantsOptions: [],
      originServe: [],
    };
  },
  props: {
    servicesVisible: {
      type: Boolean,
      default: false,
    },
    dataObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    dataObj: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val !== null) {
          this.completeData(val);
        }
      },
    },
    noOnServer: {
      deep: true,
      immediate: true,
      handler(val) {},
    },
    noOffServer: {
      deep: true,
      immediate: true,
      handler(val) {},
    },
  },
  created() {
    this.initResources();
  },
  methods: {
    completeData(obj) {
      let { server, company_id } = obj;
      this.server = Object.keys(server);
      this.initSupplier(server);
      this.onForm = { ...this.onForm, ...obj };
      this.offForm = { ...this.offForm, ...{ company_id } };
    },
    initResources() {
      servicesProvides().then((res) => {
        let { data } = res;
        this.originServe = data;
        this.completeArr(this.originServe);
      });
    },
    completeArr(arr) {
      this.onservicesArr = this.initservicesArr(arr, true);
      this.offservicesArr = this.initservicesArr(arr, false);
    },
    initservicesArr(data, bool) {
      return this.utils.deepClone(data).map((v) => {
        this.$set(v, "checked", false);
        if (this.server.indexOf(v.id) != -1 && bool) {
          this.$set(v, "checked", true);
        }
        return v;
      });
    },
    initSupplier(server) {
      for (let key in server) {
        if (server[key].length > 0) {
          this.onsupplier[key].id = server[key][0];
        }
      }
    },
    beforeClose() {
      this.$emit("update:servicesVisible", false);
    },
    simpleClose() {
      this.$emit("update:servicesVisible", false);
    },
    toggleTab(index) {
      if (this.currentIndex == index) return;
      this.currentIndex = index;
    },
    showSupplier(item, index) {
      if (this.currentIndex == 0) {
        this.onserverName = item.name;
        this.onserverId = item.id;
        this.onIndex = index;
        this.onCompanys = this.utils.deepClone(item.companys);
        this.onCompanys.forEach((v) => {
          if (this.isOn(item.id)) {
            this.$set(v, "disabled", true);
          } else {
            this.$set(v, "disabled", false);
          }
        });
      } else if (this.currentIndex == 1) {
        this.offserverName = item.name;
        this.offserverId = item.id;
        this.offIndex = index;
        this.offCompanys = this.utils.deepClone(item.companys);
        this.offCompanys.forEach((v) => {
          if (
            !this.isOn(item.id) ||
            (this.isOn(item.id) && this.onsupplier[item.id].id !== v.id)
          ) {
            this.$set(v, "disabled", true);
          } else {
            this.$set(v, "disabled", false);
          }
        });
      }
    },

    changeServer(value, key, bool, index, item) {
      this.$set(this[key][item.id], "bool", value);
      this.$set(this[key][item.id], "id", "");
      this[bool] = this.validServer(this[key]);
    },
    changeSupplier(value, item) {
      if (this.currentIndex == 0) {
        this.$set(this.onservicesArr[this.onIndex], "checked", true);
        this.onsupplier[this.onserverId].bool = true;
        this.noOnServer = this.validServer(this.onsupplier);
      } else if (this.currentIndex == 1) {
        this.$set(this.offservicesArr[this.offIndex], "checked", true);
        this.offsupplier[this.offserverId].bool = true;
        this.noOffServer = this.validServer(this.offsupplier);
      }
    },
    beforeUpload(file) {
      let isLt5M = file.size / 1024 / 1024 < 5;
      let islengLt5 = true;
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过5M");
      }
      if (this.currentIndex == 0) {
        islengLt5 = this.onForm.file_url_list.length < 5;
      } else if (this.currentIndex == 1) {
        islengLt5 = this.offForm.file_url_list.length < 5;
      }
      if (!islengLt5) {
        this.$message.error("上传文件个数不能超过5个");
      }
      return isLt5M && islengLt5;
    },
    onSuccessBack(res, { uid, name, response, status }) {
      if (status !== "success") return;
      if (this.currentIndex == 0) {
        this.onForm.file_url_list.push({
          uid,
          name,
          url: response.file_preview,
        });
      } else if (this.currentIndex == 1) {
        this.offForm.file_url_list.push({
          uid,
          name,
          url: response.file_preview,
        });
      }
    },
    onRemoveBack({ status }, obj) {
      if (status !== "success") return;
      if (this.currentIndex == 0) {
        this.onForm.file_url_list = obj;
      } else if (this.currentIndex == 1) {
        this.offForm.file_url_list = obj;
      }
    },
    validServer(validObj) {
      let arr = Object.entries(validObj);
      let superBool = arr.some((v) => {
        return v[1].bool == true;
      });
      if (!superBool) {
        return true;
      } else {
        let mutils = arr.filter((v) => {
          return v[1].mutil == true && v[1].bool == true;
        });

        if (mutils.length > 0) {
          let subBool = mutils.some((v) => {
            return v[1].id == "";
          });
          if (subBool) {
            return true;
          }
        }
        return false;
      }
    },
    validReason(model, key) {
      if (model.apply_reason == null || model.apply_reason == "") {
        this[key] = true;
      } else {
        this[key] = false;
      }
    },
    reasonChange(value, key, bool) {
      this.validReason(this[key], bool);
    },
    creatServerObj(resObj) {
      let arr = Object.entries(resObj).filter((v) => {
        return v[1].bool == true;
      });
      let obj = {};
      arr.forEach((v) => {
        if (v[1].mutil) {
          this.$set(obj, v[0], [v[1].id]);
        } else {
          this.$set(obj, v[0], []);
        }
      });
      return obj;
    },
    submit() {
      if (!(this.searchVal || this.dataObj)) {
        this.$message.warning("请输入你所需要操作的公司");
        return;
      }
      if (this.currentIndex == 0) {
        this.reasonChange(null, "onForm", "noOnReason");
        this.noOnServer = this.validServer(this.onsupplier);
        if (!(this.noOnServer || this.noOnReason)) {
          this.onForm.server = {
            ...this.onForm.server,
            ...this.creatServerObj(this.onsupplier),
          };
          this.post(this.onForm);
        }
      } else if (this.currentIndex == 1) {
        this.reasonChange(null, "offForm", "noOffReason");
        this.noOffServer = this.validServer(this.offsupplier);
        if (!(this.noOffServer || this.noOffReason)) {
          this.offForm.server = {
            ...this.offForm.server,
            ...this.creatServerObj(this.offsupplier),
          };
          this.post(this.offForm);
        }
      }
    },
    post(obj) {
      this.loading = true;
      serverApply(obj).then((res) => {
        this.simpleClose();
        this.$parent.getList();
        this.loading = false;
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchLoading = true;
        setTimeout(() => {
          companyListSelect({
            page: 1,
            page_size: 500,
            company_name: query,
          }).then((res) => {
            this.restaurantsOptions = res.data.list;
            this.searchLoading = false;
          });
        }, 200);
      } else {
        this.restaurantsOptions = [];
      }
    },
    companyChange(val) {
      serviceItemInfo({ company_id: val }).then((res) => {
        let obj = res.data;
        obj.company_id = val;
        this.completeData(obj);
        this.completeArr(this.originServe);
      });
    },
  },
  computed: {
    isOn() {
      return function (id) {
        return this.server.indexOf(id) == -1 ? false : true;
      };
    },
  },
  mounted() {
    this.toggleTab(0);
  },
};
</script>

<style scoped lang="scss">
.fastSearch {
  margin: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  label {
    flex-basis: 100px;
  }
  .el-select {
    flex: 1;
  }
}
.contentBox {
  .tabs {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    border: 1px solid #dcdfe6;
    .item {
      flex: 1;
      color: #bfbfbf;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #5c6ac4;
        background: rgba(92, 106, 196, 0.2);
      }
    }
  }
  .servicesSec {
    .sec {
      margin-top: 32px;
      position: relative;
      .text {
        span {
          color: #ff4343;
        }
      }
      .lists {
        display: flex;
        justify-content: space-around;
        flex-wrap: nowrap;
        margin-top: 16px;
        .item {
          width: 142px;
          height: 146px;
          text-align: center;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          cursor: pointer;
          position: relative;
          &:hover,
          &.active {
            border: 1px solid #212d98;
          }
          .tag {
            position: absolute;
            right: 0;
            top: 0;
            width: 50px;
            height: 20px;
            border-radius: 0px 4px 0px 4px;
            text-align: center;
            color: #fff;
            background: #d6d6d9;
            font-size: 14px;
            &.on {
              background-color: #53c95b;
            }
          }
          .iconBox {
            border-radius: 4px;
            width: 42px;
            height: 42px;
            margin: 34px auto 0;
            .iconfont {
              line-height: 42px;
              text-align: center;
              font-size: 22px;
            }
          }
          .name {
            text-align: center;
            margin-top: 7px;
          }
          .el-checkbox {
            margin-top: 16px;
          }
        }
      }
      .notice {
        position: absolute;
        bottom: -20px;
        left: 0;
        font-size: 12px;
        color: #ff4343;
      }
      .onCompanys {
        .el-radio-group {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .el-radio {
            flex: 30%;
            margin-right: 0;
            margin-top: 16px;
          }
        }
      }
      .reasonText {
        margin-top: 16px;
        position: relative;
        .notice {
          position: absolute;
          bottom: -20px;
          left: 0;
          font-size: 12px;
          color: #ff4343;
        }
      }
      .uploadBox {
        margin-top: 16px;
      }
    }
  }
}
</style>
