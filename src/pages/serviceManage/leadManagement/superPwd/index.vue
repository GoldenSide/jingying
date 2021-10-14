<!---*
* @description 
* @fileName index.vue(超极密码页面)
* @author 龙伟
* @date 2020/12/11 15:24:09
*--->
<template>
  <div class="password-contaniner">
    <contHeader :titleText="$route.meta.title" />
    <div class="conditions-content">
      <div class="content">
        <div class="top">
          <el-select
            v-model="value"
            filterable
            placeholder="请输入店铺名称"
            clearable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="(item, index) in restaurantsOptions"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-button type="primary" @click="getShopPwd">
            <img :src="require('@/../static/img/search.png')" alt="" />
            搜索</el-button
          >
        </div>
        <div class="bottom">
          <ul>
            <li v-for="(item, index) in pwdConfig" :key="index">
              <div>
                <label>{{ item.label }}：</label>
                <div
                  v-if="item.label == '后台地址' || item.label == '买家地址'"
                >
                  <p
                    @click="getUrl(item.text)"
                    style="color: #3d69d6; cursor: pointer"
                  >
                    {{ item.text }}
                  </p>
                </div>
                <div v-else>
                  <p>
                    {{ item.text }}
                  </p>
                </div>
                <el-button type="primary" v-copy="copyValue(index)"
                  >复制</el-button
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listSelect, superPwd } from "@/api/leadManagement/shopManagement";
export default {
  name: "superPwd",
  components: {},
  data() {
    return {
      value: "",
      loading: false,
      restaurantsOptions: [],
      pwdObj: {},
      pwdConfig: [
        { label: "后台地址", prop: "admin_url", text: "" },
        { label: "登陆账号", prop: "login_email", text: "" },
        { label: "登陆密码", prop: "login_pwd", text: "" },
        { label: "买家地址", prop: "buyer_url", text: "" },
      ],
    };
  },
  props: {},
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val.trim()) {
          this.pwdConfig.forEach((item) => {
            item.text = "";
          });
        }
      },
    },
  },
  created() {},
  methods: {
    // 获取筛选店铺
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          listSelect({
            page: 1,
            page_size: 500,
            name: query,
          })
            .then((res) => {
              this.restaurantsOptions = res.data.list;
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
          // this.restaurantsOptions = this.restaurants.filter(
          //   (item) => item.value.indexOf(query) != -1
          // );
        }, 200);
      } else {
        this.restaurantsOptions = [];
      }
    },
    // 获取超极密码
    getShopPwd() {
      if (!this.value) {
        this.$message.error("请先选择店铺");
        return;
      }
      superPwd({
        shop_name: this.value,
      }).then((res) => {
        this.pwdConfig.forEach((item) => {
          item.text = res.data[item.prop];
        });
      });
    },
    getUrl(url) {
      window.open(url)
    },
  },
  computed: {
    copyValue() {
      return function (index) {
        return this.pwdConfig[index].text;
      };
    },
  },
};
</script>

<style scoped lang="scss">
.password-contaniner {
  .content {
    height: 78vh;
    padding: 16px;
    .el-select {
      width: 400px;
      margin-right: 12px;
    }
    .el-button {
      img {
        width: 20px;
        vertical-align: middle;
      }
    }
  }
  .bottom {
    margin-top: 32px;
    li {
      margin-bottom: 16px;
      label {
        font-weight: 400;
        color: #212b36;
        font-size: 14px;
        vertical-align: middle;
      }
      div {
        display: inline-block;
        vertical-align: middle;
      }
      p {
        width: 338px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
    }
  }
  .el-button {
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
