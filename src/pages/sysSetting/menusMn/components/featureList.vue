<!---*
* @description  功能配置
* @fileName featureList.vue
* @author 叶金龙
* @date 2020/10/13 11:24:43
*--->
<template>
  <el-dialog
    :title="'配置功能(' + currentRow.meta.title + ')'"
    :visible.sync="featureVisible"
    width="600"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <div class="textLine">
      <span
        >功能列表<i v-if="featureList.length >= 20"
          >(添加权限不大于20项)</i
        ></span
      >

      <el-button
        type="success"
        size="mini"
        circle
        icon="el-icon-plus"
        title="新增"
        :disabled="featureList.length >= 20"
        @click="addFeature"
      ></el-button>
    </div>
    <el-table :data="featureList">
      <el-table-column type="index" label="序号" width="50"> </el-table-column>
      <el-table-column
        v-for="col in columns"
        :prop="col.prop"
        :key="col.prop"
        :label="col.label"
        :width="col.width"
      >
        <template slot-scope="{ row }">
          <el-input
            v-model.trim="row[col.prop]"
            size="mini"
            clearable
            :placeholder="col.placeHolder"
            @input="(val) => inputChange(val, col.prop, row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="is_show" label="是否显示">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.is_show"
            :active-value="1"
            :inactive-value="0"
            @change="(val) => switchChange(val, row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            icon="el-icon-check"
            title="保存"
            circle
            :loading="loading"
            :disabled="!(row.title && row.backend_uri) || row.noChange"
            @click="handlerFeature(row)"
          ></el-button>
          <el-button
            type="primary"
            size="danger"
            circle
            icon="el-icon-delete"
            title="删除"
            @click="deleFeature(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <span slot="footer">
      <el-button @click="simpleClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="submit" size="mini">保 存</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import {
  menuFeature,
  deleteFeature,
  handlerFeature
} from "@/api/sysSetting/menusMn";
export default {
  name: "featureList",
  components: {},
  data() {
    return {
      columns: [
        {
          prop: "title",
          label: "功能名称",
          placeHolder: "请填写功能名称",
          width: 150
        },
        {
          prop: "alias",
          label: "功能标识",
          placeHolder: "请填写功能标识",
          width: 200
        },
        {
          prop: "backend_uri",
          label: "请求地址",
          width: 300,
          placeHolder: "请输入请求地址"
        }
      ],
      featureList: [],
      item: {
        title: "",
        alias: "",
        backend_uri: "",
        is_show: 1,
        noChange: true
      },
      loading: false
    };
  },
  props: {
    featureVisible: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default() {
        return {
          meta: {
            title: ""
          }
        };
      }
    }
  },
  watch: {
    currentRow: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log(val);
        if (Object.keys(val).length > 0) {
          let { menu_id } = val;
          this.item = { ...this.item, menu_id };
          menuFeature({ menu_id }).then(({ data }) => {
            data.forEach(v => {
              this.$set(v, "noChange", true);
            });
            this.featureList = data;
          });
        }
      }
    }
  },
  created() {},
  methods: {
    simpleClose() {
      this.$emit("update:featureVisible", false);
    },
    beforeClose() {
      this.simpleClose();
    },

    addFeature() {
      this.featureList.push(this.utils.deepClone(this.item));
    },
    deleFeature(row, $index) {
      if (this.isEdit(row)) {
        deleteFeature({ id: row.id }).then(res => {
          this.featureList.splice($index, 1);
        });
      } else {
        this.featureList.splice($index, 1);
      }
    },
    handlerFeature(row) {
      this.$set(row, "noChange", true);
      this.loading = true;
      if (this.isEdit(row)) {
        handlerFeature("/common/menu/event-edit", row)
          .then(res => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          })
          .catch(err => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          });
      } else {
        handlerFeature("/common/menu/event-add", row)
          .then(res => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          })
          .catch(err => {
            setTimeout(() => {
              this.loading = false;
            }, 300);
          });
      }
    },
    isEdit(model) {
      if (model.hasOwnProperty("id")) {
        return true;
      } else {
        return false;
      }
    },

    switchChange(val, row) {
      let { title, alias, backend_uri } = row;
      if (title && alias && backend_uri) {
        this.$set(row, "noChange", false);
      } else {
        return;
      }
    },
    inputChange(val, key, row) {
      this.$set(row, "noChange", false);
    },
    submit() {}
  }
};
</script>

<style scoped lang='scss'>
.textLine {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 0;
  align-items: center;
  span {
    i {
      color: #ff4343;
    }
  }
}
</style>
