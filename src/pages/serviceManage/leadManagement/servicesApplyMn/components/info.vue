<!---*
* @description 服务申请单详情 
* @fileName info.vue
* @author 叶金龙
* @date 2020/11/30 16:07:47
*--->
<template>
  <el-dialog
    title="查看"
    :visible.sync="infoVisible"
    width="634px"
    :before-close="diaClose"
  >
    <div class="textContent">
      <ul class="lists">
        <li class="item" v-for="(item, index) in textConfig" :key="index">
          <label class="label">{{ item.label }}:</label>
          <span
            :class="['text', item.shape]"
            :style="{
              backgroundColor: item.shape ? currentRow.bgc : 'transparent',
            }"
            >{{ currentRow[item.prop] }}</span
          >
        </li>
      </ul>
      <div class="services">
        <div class="linetext">
          <label class="label">服务：</label>
        </div>
        <div class="table">
          <div class="title line">
            <div>服务</div>
            <div>服务供应商</div>
          </div>
          <div class="line" v-for="(item, index) in currentServer" :key="index">
            <div>
              {{ item.name }}
            </div>
            <div>
              <span v-for="(v, index) in item.companys" :key="index">
                {{ v.name }} <i v-if="index < item.companys.length - 1">、</i>
              </span>
            </div>
          </div>
        </div>
        <div class="linetext">
          <label class="label">开通服务原因：</label>
          <span class="text">
            {{ currentRow.apply_reason }}
          </span>
        </div>
        <div class="linetext">
          <label class="label">附件：</label>
        </div>
        <fileList :fileList="currentRow.file_url_list" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { servicesProvides } from "@/api/common";
import fileList from "@/components/fileList/list";
export default {
  name: "servicesApplyInfo",
  components: { fileList },
  data() {
    return {
      textConfig: [
        {
          label: "申请状态",
          prop: "apply_response_name",
          shape: "inlineblock",
        },
        { label: "申请单号", prop: "apply_number" },
        { label: "公司名称", prop: "company_name" },
        { label: "公司ID", prop: "company_id" },
        { label: "公司负责人", prop: "leading_official" },
        { label: "申请人", prop: "apply_person_name" },
        { label: "申请时间", prop: "apply_time" },
        { label: "申请单类型", prop: "apply_type_name" },
      ],
      servicesArr: [],
      server: [],
      fileList: [],
    };
  },
  props: {
    infoVisible: {
      type: Boolean,
      default: false,
    },
    currentRow: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    currentRow: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          delete val.server.server_name;
          this.server = Object.keys(val.server);
        }
      },
    },
  },
  created() {
    this.initResource();
  },
  methods: {
    diaClose() {
      this.$emit("update:infoVisible", false);
    },
    initResource() {
      servicesProvides().then((res) => {
        this.servicesArr = res.data;
      });
    },
    handleChange() {},
  },
  computed: {
    currentServer() {
      let arr = [];
      for (let val of this.servicesArr) {
        let index = this.server.indexOf(val.id);
        if (index == -1) {
          continue;
        } else {
          let reso = this.currentRow.server[this.server[index]];
          let companys = val.companys.filter((v) => {
            return reso.indexOf(v.id) !== -1;
          });
          arr.push({ id: val.id, name: val.name, companys });
        }
      }
      return arr;
    },
  },
};
</script>

<style scoped lang='scss'>
.textContent {
  .lists {
    font-size: 14px;
    overflow: hidden;
    .item {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
      .label {
        color: #8996a3;
      }
      .text {
        color: #212b36;
        &.inlineblock {
          text-align: center;
          width: 55px;
          height: 20px;
          border-radius: 27px;
          display: inline-block;
        }
      }
    }
  }
  .services {
    .linetext {
      margin-top: 16px;
      .label {
        color: #8996a3;
      }
    }
    .table {
      width: 100%;
      margin-bottom: 16px;
      margin-top: 8px;
      .title {
        color: #212b36;
        font-weight: 500;
        background: #f6f6f6;
      }
      .line {
        height: 46px;
        line-height: 46px;
        display: flex;
        justify-content: space-between;
        &:not(:first-child) {
          border-bottom: 1px solid #dfe3e8;
        }
        div {
          flex: 1;
          &:first-child {
            padding-left: 66px;
          }
        }
      }
    }
  }
}
</style>