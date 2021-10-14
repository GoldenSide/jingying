<!---*
* @description 商品风控管理
* @fileName list.vue
* @author 叶金龙
* @date 2021/01/11 16:40:23
*--->
<template>
  <div class="control-contaniner">
    <div class="cobtrol-top">
      <!-- <goBackIcon /> -->
      <div class="topTitte">
        <contHeader :titleText="$route.meta.title" />
        <div class="status" :style="{ backgroundColor: bgc }">
          {{ infoObj.is_del_text || "--" }}
        </div>
      </div>
    </div>
    <el-button
      type="primary"
      class="freeze"
      size="medium"
      v-if="infoObj.is_del == '0'"
      @click="freezeShop"
      >冻结店铺</el-button
    >
    <div class="shopInfo" style="margin-top: 12px" v-if="infoObj">
      <div class="title">店铺基本信息</div>
      <ul class="lists">
        <li class="item" v-for="(item, index) in shopInfoConfig" :key="index">
          {{ item.label }}: {{ infoObj[item.key] || "- -" }}
        </li>
      </ul>
    </div>
    <div class="conditions-content">
      <div class="toggleBtns">
        <el-tabs
          v-model="arrKey"
          @tab-click="
            (obj, e) => toggleBtn({ value: obj.name }, Number(obj.index))
          "
        >
          <el-tab-pane
            v-for="(item, index) in statusBtns"
            :label="item.text"
            :name="item.value"
            :key="index"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="search-content">
        <el-input
          v-model="search.product_name"
          placeholder="请输入商品名称"
          size="normal"
          clearable
          @keyup.enter.native="init"
        ></el-input>
        <el-tooltip
          class="item"
          effect="light"
          :disabled="!item.content"
          :content="item.content"
          placement="top"
          v-for="(item, index) in comElpopover"
          :key="index"
        >
          <elpopover
            :slotName="item.slotName"
            :btnText="item.btnText"
            :width="item.width"
            :isShow="(bool) => changeBool(bool, item)"
            :bool="item.bool"
          >
            <template v-for="elp in comElpopover" :slot="elp.slotName">
              <el-radio
                style="padding: 5px 0"
                v-for="(item, index) in elp.checkArr()"
                :key="index"
                :label="item.value"
                v-model="search[elp.key]"
                >{{ item.name }}</el-radio
              >
            </template>
          </elpopover>
        </el-tooltip>
        <btns :btnConfig="btnConfig" :btn-click="(btn) => btnCb(btn)" />
      </div>
      <div class="search-tag">
        <el-tag
          v-for="(item, index) in comElpopover"
          :key="index"
          closable
          v-show="
            checkCalc(item.key, item.checkArr(), 'value', 'name').length > 0
          "
          @close="deleCondition(item.key)"
          style="margin-right: 10px"
          >{{ item.btnText }}：
          {{ checkCalc(item.key, item.checkArr(), "value", "name") }}
        </el-tag>
      </div>
      <div class="batchActBox" v-if="currentIndex !== 1">
        <batchAct :render="statusBtns[currentIndex || 0].render"></batchAct>
      </div>
      <div class="list-content">
        <el-table
          :data="dataList"
          style="width: 100%"
          v-loading="loading"
          ref="dataTable"
          tooltip-effect="light"
          :height="calcHeight"
          @select="selectOne"
          @select-all="selectAll"
          @sort-change="sortChange"
        >
          <el-table-column
            v-if="currentIndex !== 1"
            fixed="left"
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            v-for="(item, index) in calcXshoppy"
            :key="index"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            :fixed="item.fixed"
            :align="item.align || 'left'"
            :sortable="item.sortable"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <cellRender
                :column="item"
                :row="row"
                :render="item.render"
                v-if="item.render"
              />
              <div v-else>{{ row[item.prop] }}</div>
            </template>
          </el-table-column>

          <el-table-column
            v-for="(item, index) in currentIndex == 3 || currentIndex == 4
              ? []
              : oneSixEightEight"
            :key="index + 'xshoppy'"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'left'"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <cellRender
                :column="item"
                :row="row"
                :render="item.render"
                v-if="item.render"
              />
              <div v-else>{{ row[item.prop] }}</div>
            </template>
          </el-table-column>

          <el-table-column
            v-for="(item, index) in currentColumn"
            :key="index + 'xshoppy' + currentColumn.length"
            :width="item.width"
            :prop="item.prop"
            :fixed="item.fixed"
            :label="item.label"
            :align="item.align || 'left'"
            show-overflow-tooltip
            :sortable="item.sortable"
          >
            <template slot-scope="{ row }">
              <cellRender
                :column="item"
                :row="row"
                :render="item.render"
                v-if="item.render"
              />
              <div v-else>{{ row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
        <PaginationCom
          :limit.sync="search.page_size"
          :page.sync="search.page"
          :total="pagination.total"
          @pagination="asyncGetList"
        />
      </div>
    </div>
    <logMenu
      :logVisible.sync="logVisible"
      v-if="logVisible"
      :logData="logData"
      :getLogData="getLogData"
    />
    <reasonDia
      v-if="reasonVisible"
      :reasonVisible.sync="reasonVisible"
      :reasonObj="reasonObj"
      :submitHandler="checkPost"
    />
    <putUpDia
      v-if="putUpVisible"
      :putUpVisible.sync="putUpVisible"
      :reasonObj="reasonObj"
      :submitHandler="checkPost"
    />
    <freeze
      v-if="freezeShopVisible"
      :freezeShopVisible.sync="freezeShopVisible"
      :freezeShopId="infoObj.id"
      :refresh="freezeCb"
    />
    <!-- <goodInfoList
      :goodInfoVisible.sync="goodInfoVisible"
      :currentDetail="currentDetail"
    /> -->
  </div>
</template>

<script>
import elpopover from "@/components/search/elpopover";
import btns from "@/components/search/btn";
import cellRender from "@/components/table/cellRender";
import reasonDia from "./component/reason";
import putUpDia from "./component/putUp";
import freeze from "../shopManagementList/components/freezeShop";
import statusTag from "@/components/status/statusTag";
// import goodInfoList from "./component/goodInfoList";
import {
  goodsLists,
  goodsDailyLogs,
  checkGoods,
  deleteGood,
  getCount,
} from "@/api/leadManagement/commodityControl";
export default {
  name: "commodityDetail",
  components: {
    btns,
    elpopover,
    cellRender,
    reasonDia,
    putUpDia,
    freeze,
    statusTag,
    // goodInfoList,
    batchAct: () => import("../goodsCheckMn/components/batchAct"),
  },
  data() {
    return {
      arrKey: "",
      currentIndex: null,
      loading: false,
      dataList: [],
      search: {
        shop_id: "",
        product_name: "",
        list_type: 1,
        risk_type: null,
        type: [],
        statusType: [],
        page: 1,
        page_size: 15,
        is_valid: "1",
        new_today: "0", //筛选条件  待调整
        product_status: 0,
        sort_field: "",
        sort_direction: "",
      },
      infoObj: {},
      pagination: {
        total: 0,
      },
      shopInfoConfig: [
        {
          label: "店铺名称",
          key: "name",
        },
        {
          label: "店铺域名",
          key: "domain",
        },
        {
          label: "paypal账号",
          key: "paypal_account",
        },
        {
          label: "公司名称",
          key: "company_name",
        },
        {
          label: "公司类型",
          key: "company_type_name",
        },
      ],
      riskType: [
        {
          value: 1,
          name: "疑似低价欺诈",
        },
        {
          value: 2,
          name: "低价欺诈",
        },
        {
          value: 3,
          name: "违禁词",
        },
      ],
      putUpType: [
        {
          value: 1,
          name: "侵权",
        },
        {
          value: 2,
          name: "低价欺诈",
        },
        {
          value: 3,
          name: "其他",
        },
      ],

      isValidType: [
        {
          value: "0",
          name: "否",
        },
        {
          value: "1",
          name: "是",
        },
      ],
      newTodayType: [
        {
          value: "0",
          name: "否",
        },
        {
          value: "1",
          name: "是",
        },
      ],
      goodsStatus: [
        {
          value: 1,
          name: "在售",
        },
        {
          value: 2,
          name: "下架",
        },
        {
          value: 3,
          name: "删除",
        },
      ],
      elpopoverArr: [
        {
          btnText: "全部挂起标记",
          slotName: "putUpType",
          key: "hang_type",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
          checkArr: () => {
            return this.putUpType;
          },
        },
        {
          btnText: "全部判定结果",
          slotName: "riskType",
          key: "risk_type",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
          checkArr: () => {
            return this.riskType;
          },
        },
        {
          btnText: "商品当前状态",
          slotName: "goodsStatus",
          key: "product_status",
          width: 150,
          bool: false,
          isShow: function (bool) {
            return bool;
          },
          checkArr: () => {
            return this.goodsStatus;
          },
        },
        {
          btnText: "过滤失效商品",
          slotName: "isValidType",
          key: "is_valid",
          width: 150,
          bool: false,
          content:
            "失效商品包括：下架/删除/店铺冻结/未绑定独立域名导致的商品失效",
          isShow: function (bool) {
            return bool;
          },
          checkArr: () => {
            return this.isValidType;
          },
        },
        {
          btnText: "今日新增",
          slotName: "newTodayType",
          key: "new_today",
          width: 150,
          bool: false,
          content: "表示筛选列表中今日新增的商品",
          isShow: function (bool) {
            return bool;
          },
          checkArr: () => {
            return this.newTodayType;
          },
        },
      ],
      btnConfig: [
        { text: "搜索", icon: "search", type: "primary", cb: "init" },
        { text: "清空", icon: "clear", type: "default", cb: "clear" },
      ],
      statusBtns: [
        {
          text: "待审核",
          value: "noCheckColumn",
          render: ({ h, btns }) => {
            return (
              <div class="seletSumBox">
                <span>
                  已经选中<i>{this.constructIds(this.selectArr).length}</i>项
                </span>
                <el-button
                  size="medium"
                  disabled={this.selectArr.length <= 0}
                  onClick={() => this.check(this.selectArr, "批量审核")}
                >
                  批量审核
                </el-button>
                <el-button
                  size="medium"
                  disabled={this.selectArr.length <= 0}
                  onClick={() => this.putUp(this.selectArr, "批量挂起")}
                >
                  批量挂起
                </el-button>
              </div>
            );
          },
        },
        {
          text: "违规已处理",
          value: "processedColumn",
        },
        {
          text: "合规商品",
          value: "complianceColumn",
          render: ({ h, btns }) => {
            return (
              <div class="seletSumBox">
                <span>
                  已经选中<i>{this.constructIds(this.selectArr).length}</i>项
                </span>
                <el-button
                  size="medium"
                  disabled={this.selectArr.length <= 0}
                  onClick={() => this.check(this.selectArr, "违规原因")}
                >
                  违规
                </el-button>
              </div>
            );
          },
        },
        {
          text: "抽检商品",
          value: "spotCheckColumn",
          render: ({ h, btns }) => {
            return (
              <div class="seletSumBox">
                <span>
                  已经选中<i>{this.constructIds(this.selectArr).length}</i>项
                </span>
                <el-button
                  size="medium"
                  disabled={this.selectArr.length <= 0}
                  onClick={() => this.check(this.selectArr, "批量审核")}
                >
                  批量审核
                </el-button>
                <el-button
                  size="medium"
                  disabled={this.selectArr.length <= 0}
                  onClick={() => this.putUp(this.selectArr, "批量挂起")}
                >
                  批量挂起
                </el-button>
              </div>
            );
          },
        },
        {
          text: "已挂起",
          value: "putUpColumn",
          render: ({ h, btns }) => {
            return (
              <div class="seletSumBox">
                <span>
                  已经选中<i>{this.constructIds(this.selectArr).length}</i>项
                </span>
                <el-button
                  size="medium"
                  disabled={this.selectArr.length <= 0}
                  onClick={() => this.check(this.selectArr, "批量审核")}
                >
                  批量审核
                </el-button>
              </div>
            );
          },
        },
      ],
      xshoppy: [
        {
          label: "xs商品",
          prop: "title",
          width: 300,
          render: ({ h, row }) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                },
              },
              [
                h("el-image", {
                  attrs: {
                    src: row.image_url,
                    previewSrcList: [row.image_url],
                  },
                  style: {
                    width: "50px",
                    height: "50px",
                  },
                }),
                h(
                  "p",
                  {
                    style: {
                      marginLeft: "8px",
                      height: "50px",
                      width: "225px",
                      whiteSpace: "break-spaces",
                      display: "flex",
                    },
                  },
                  row.title
                ),
              ]
            );
          },
        },
        {
          label: "xs商品URL",
          prop: "product_url",
          width: 100,
          render: ({ h, row }) => {
            return h("div", [
              row.product_url &&
                h(
                  "a",
                  {
                    attrs: {
                      href: row.product_url,
                      target: "_blank",
                    },
                    style: {
                      color: "#409eff",
                      fontWeight: 500,
                    },
                    on: {
                      click: (v) => {
                        console.log("xs商品URL");
                      },
                    },
                  },
                  "打开链接"
                ),
            ]);
          },
        },
        {
          label: "xs商品销量",
          prop: "sales_num",
          sortable: "custom",
          width: 150,
          align: "right",
        },
        {
          label: "xs商品售价($)",
          prop: "price",
          width: 150,
          align: "right",
        },
        {
          label: "xsGMV($)",
          prop: "gmv",
          sortable: "custom",
          width: 150,
          align: "right",
        },
      ],
      oneSixEightEight: [
        {
          label: "1688平均售价(￥)",
          prop: "avg_price",
          align: "right",
          width: 200,
        },
        // {
        //   label: "1688搜索链接",
        //   prop: "product_url_1688",
        //   width: 150,
        //   render: ({ h, row }) => {
        //     return (
        //       row.product_url_1688 &&
        //       h(
        //         "a",
        //         {
        //           attrs: {
        //             href: row.product_url_1688,
        //             target: "_blank",
        //           },
        //           style: {
        //             color: "#409eff",
        //             fontWeight: 500,
        //           },
        //         },
        //         "打开链接"
        //       )
        //     );
        //   },
        // },
        {
          label: "1688搜索商品详情",
          prop: "product_detail_url_1688",
          width: 150,
          render: ({ h, row }) => {
            return (
              row.product_detail_url_1688 &&
              h(
                "a",
                {
                  attrs: {
                    href: row.product_detail_url_1688,
                    target: "_blank",
                  },
                  style: {
                    color: "#409eff",
                    fontWeight: 500,
                  },
                },
                "查看"
              )
            );
          },
        },
      ],
      //待审核
      noCheckColumn: [
        { prop: "system_result_remark", label: "系统判定结果", width: 200 },
        { prop: "content", label: "内容", width: 300 },
        { prop: "updated_at", label: "判定时间", width: 200 },
        {
          label: "操作",
          width: 150,
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.check([row], "审核")}
                  style=""
                >
                  审核
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.putUp([row], "挂起")}
                  style=""
                >
                  挂起
                </el-link>
              </div>
            );
          },
        },
      ],
      //违规已处理
      processedColumn: [
        { prop: "system_result_remark", label: "系统判定结果", width: 300 },
        { prop: "content", label: "内容", width: 300 },
        { prop: "audited_at", label: "违规时间", width: 200 },
        { prop: "audit_reason", label: "违规原因", width: 200 },
        { prop: "updated_at", label: "处理时间", width: 200 },
        {
          prop: "status_remark",
          label: "处理结果",
          width: 200,
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor:
                  row.status == "3"
                    ? this.colorObj.orange
                    : row.status == "5"
                    ? this.colorObj.notice
                    : this.colorObj.yellow,
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.status_remark,
              },
            });
          },
        },
        {
          prop: "product_status_remark",
          label: "商品状态",
          width: 200,
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor:
                  row.is_del == "1"
                    ? this.colorObj.orange
                    : row.product_status == "1"
                    ? this.colorObj.green
                    : this.colorObj.yellow,
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.product_status_remark,
              },
            });
          },
        },

        {
          label: "操作",
          width: 150,
          fixed: "right",
          render: ({ h, row }) => {
            return h("div", [
              (row.status == "2" || row.status == "5") &&
                row.is_del == "0" &&
                h(
                  "el-link",
                  {
                    props: { type: "primary" },
                    on: {
                      click: () => {
                        this.delete([row], "确认商品链接是否删除？");
                      },
                    },
                  },
                  "强制删除"
                ),
              h(
                "el-link",
                {
                  props: { type: "primary" },
                  on: {
                    click: () => {
                      this.dailyLog(row);
                    },
                  },
                },
                "日志"
              ),
            ]);
          },
        },
      ],
      //合规商品
      complianceColumn: [
        { prop: "system_result_remark", label: "系统判定结果", width: 200 },
        { prop: "content", label: "内容", width: 300 },
        { prop: "audited_at", label: "合规时间", width: 200 },
        { prop: "audit_reason", label: "合规原因", width: 300 },
        {
          prop: "product_status_remark",
          label: "商品状态",
          width: 150,
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor:
                  row.is_del == "1"
                    ? this.colorObj.orange
                    : row.product_status == "1"
                    ? this.colorObj.green
                    : this.colorObj.yellow,
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.product_status_remark,
              },
            });
          },
        },
        {
          label: "操作",
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.dailyLog(row)}
                  style=""
                >
                  日志
                </el-link>
              </div>
            );
          },
        },
      ],
      // 抽检商品
      spotCheckColumn: [
        {
          label: "xs商品",
          prop: "title",
          width: 300,
          render: ({ h, row }) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                },
              },
              [
                h("el-image", {
                  attrs: {
                    src: row.image_url,
                    previewSrcList: [row.image_url],
                  },
                  style: {
                    width: "50px",
                    height: "50px",
                  },
                }),
                h(
                  "p",
                  {
                    style: {
                      marginLeft: "8px",
                      height: "50px",
                      width: "225px",
                      whiteSpace: "break-spaces",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      alignItems: "center",
                    },
                  },
                  row.title
                ),
              ]
            );
          },
        },
        {
          label: "xs商品URL",
          prop: "product_url",
          render: ({ h, row }) => {
            return h("div", [
              row.product_url &&
                h(
                  "a",
                  {
                    attrs: {
                      href: row.product_url,
                      target: "_blank",
                    },
                    style: {
                      color: "#409eff",
                      fontWeight: 500,
                    },
                    on: {
                      click: (v) => {
                        console.log("xs商品URL");
                      },
                    },
                  },
                  "打开链接"
                ),
            ]);
          },
        },
        {
          label: "最近1周销量",
          prop: "week_sales_num",
          sortable: "custom",
          width: 125,
          align: "right",
        },
        {
          label: "xs商品销量",
          prop: "sales_num",
          sortable: "custom",
          align: "right",
        },
        {
          label: "xs商品售价($)",
          prop: "price",
          align: "right",
        },
        {
          label: "xsGMV($)",
          prop: "gmv",
          sortable: "custom",
          align: "right",
        },

        {
          prop: "product_status_remark",
          label: "商品状态",
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor:
                  row.is_del == "1"
                    ? this.colorObj.orange
                    : row.product_status == "1"
                    ? this.colorObj.green
                    : this.colorObj.yellow,
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.product_status_remark,
              },
            });
          },
        },
        {
          label: "操作",
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.check([row], "审核")}
                  style=""
                >
                  审核
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.putUp([row], "挂起")}
                  style=""
                >
                  挂起
                </el-link>
              </div>
            );
          },
        },
      ],
      // 已挂起
      putUpColumn: [
        {
          label: "挂起标记",
          prop: "hang_remark",
        },
        {
          label: "挂起时间",
          prop: "updated_at",
        },
        {
          label: "商品状态",
          prop: "product_status_remark",
          render: ({ h, row }) => {
            return h(statusTag, {
              style: {
                backgroundColor:
                  row.is_del == "1"
                    ? this.colorObj.orange
                    : row.product_status == "1"
                    ? this.colorObj.green
                    : this.colorObj.yellow,
              },
              slot: "status-slot",
              domProps: {
                innerHTML: row.product_status_remark,
              },
            });
          },
        },
        {
          label: "操作",
          width: 150,
          fixed: "right",
          render: ({ h, row }) => {
            return (
              <div>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.check([row], "审核")}
                  style=""
                >
                  审核
                </el-link>
                <el-link
                  type="primary"
                  size="default"
                  onClick={() => this.dailyLog(row)}
                  style=""
                >
                  日志
                </el-link>
              </div>
            );
          },
        },
      ],
      downLoadUrl: "",
      selectArr: [],
      logVisible: false,
      logData: {
        logSearch: {
          id: "",
          page: 1,
          page_size: 15,
        },
        pagination: {
          total: 0,
        },
        title: "日志",
        dataList: [],
        width: "634px",
        logColumn: [
          {
            prop: "id",
            width: 70,
            label: "日志ID",
          },
          {
            prop: "operator",
            width: 90,
            label: "操作人",
          },
          {
            prop: "updated_at",
            width: 150,
            label: "操作时间",
          },
          {
            prop: "content",
            label: "备注",
          },
        ],
      },
      reasonVisible: false,
      reasonObj: {},
      colorObj: {
        green: "#D8F5E8",
        yellow: "#FCF0D8",
        orange: "#FFC48B",
        notice: "#D5F2FA",
      },
      freezeDis: false,
      putUpVisible: false,
      freezeShopVisible: false,
    };
  },
  props: {},
  watch: {
    dataList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.iterationTable(val);
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.infoObj = JSON.parse(to.query.row);
      let queryObj = JSON.parse(to.query.row);
      if (queryObj && queryObj.id) {
        vm.toggleBtn(vm.statusBtns[0], 0);
      }
    });
  },
  created() {},
  methods: {
    toggleBtn(item, index) {
      if (this.currentIndex == index) return;
      this.currentIndex = index;
      this.arrKey = item.value;
      this.search.product_status = null;
      // this.spotCheckColumn = [].concat(this.noCheckColumn);
      this.clear();
      this.dataList = [];
      this.pagination.total = 0;
    },
    init() {
      this.selectArr = [];
      this.search.page = 1;
      this.asyncGetList();
    },
    clear() {
      this.search = this.$options.data().search;
      this.init();
    },
    asyncGetList() {
      this.loading = true;
      this.search.list_type = this.currentIndex + Number(1);
      this.search.shop_id = this.infoObj.id;
      if (this.currentIndex == 1 || this.currentIndex == 2) {
        this.search.is_valid = "0";
        this.search.new_today = "0";
      }
      Promise.all([this.getList(), this.getListCount()])
        .then((result) => {
          let [list, count] = result;
          list.forEach((element) => {
            this.$set(element, "checked", false);
            const row = this.selectArr.find((v) => {
              return v.product_id == element.product_id;
            });
            if (row) {
              this.$set(element, "checked", true);
            }
          });
          this.dataList = list;
          this.pagination.total = count;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    sortChange(obj) {
      this.$nextTick(() => {
        this.search.sort_field = obj.prop;
        this.search.sort_direction = obj.order;
        this.init();
      });
    },
    getList() {
      return new Promise((resolve, reject) => {
        goodsLists(this.search).then((res) => {
          let { list } = res.data;
          resolve(list);
        });
      });
    },
    getListCount() {
      return new Promise((resolve, reject) => {
        getCount(this.search).then((res) => {
          let { count } = res.data;
          resolve(count);
        });
      });
    },
    createObj(row, title) {
      this.reasonObj = {
        product_ids:
          this.search.list_type == 1 || this.search.list_type == 4
            ? this.constructIds(row)
            : [],
        shop_id: row[0].shop_id,
        audit_type: null,
        audit_reason: "",
        title,
        ids:
          this.search.list_type == 3 || this.search.list_type == 5
            ? this.calcIds(row)
            : [],
        audit_source: this.search.list_type,
        hang_type: 1,
        hang_remark: "",
      };
    },
    check(row, title = "判定原因") {
      this.reasonVisible = true;
      this.createObj(row, title);
    },
    checkPost(obj) {
      checkGoods(obj).then((res) => {
        this.refresh();
      });
    },
    putUp(row, title = "") {
      this.putUpVisible = true;
      this.createObj(row, title);
    },

    delete(row = [], text) {
      if (this.valid(row)) {
        this.utils.deleConfig(
          this,
          text,
          "提示",
          ["确 定", "取 消"],
          this.deleCb(row)
        );
      } else {
        return false;
      }
    },
    deleCb(row) {
      return () => {
        deleteGood({ id: row[0].id }).then((res) => {
          this.refresh();
        });
      };
    },
    refresh() {
      this.init();
      this.$message.success("操作成功");
    },
    selectOne(selection, row) {
      row.checked = !row.checked;
      this.getSelectTable(row);
    },
    selectAll(selection) {
      this.getSelectTableAll();
      selection.forEach((v) => {
        this.selectOne(selection, v);
      });
    },
    getSelectTable(val) {
      if (val.checked) {
        this.selectArr = [...this.selectArr, val];
      } else {
        const index = this.selectArr.findIndex((v) => {
          if (this.search.list_type == 1 || this.search.list_type == 4) {
            return v.product_id == val.product_id;
          } else if (this.search.list_type == 3 || this.search.list_type == 5) {
            return v.id == val.id;
          }
        });
        if (index > -1) {
          this.selectArr.splice(index, 1);
        }
      }
    },
    getSelectTableAll() {
      this.dataList.forEach((v) => {
        const index = this.selectArr.findIndex((element) => {
          if (this.search.list_type == 1 || this.search.list_type == 4) {
            return v.product_id == element.product_id;
          } else if (this.search.list_type == 3 || this.search.list_type == 5) {
            return v.id == element.id;
          }
        });
        if (index > -1) {
          v.checked = false;
          this.selectArr.splice(index, 1);
        }
      });
    },
    iterationTable(rows = []) {
      this.$nextTick(() => {
        rows.forEach((row) => {
          this.toggleRowSelect(row, row.checked);
        });
      });
    },
    toggleRowSelect(row, bool) {
      this.$nextTick(() => {
        this.$refs["dataTable"].toggleRowSelection(row, bool);
      });
    },

    deleCondition(key) {
      this.search[key] = null;
      this.init();
    },
    changeBool(bool, obj) {
      this.$set(obj, "bool", bool);
    },
    btnCb(btn) {
      this[btn.cb]();
    },
    valid(arr) {
      if (this.constructIds(arr).length <= 0) {
        this.$message.warning("请选择需要操作的商品");
        return false;
      } else {
        return true;
      }
    },
    dailyLog({ id }) {
      this.logVisible = true;
      this.logData.logSearch.id = id;
      this.getLogData();
    },
    getLogData() {
      goodsDailyLogs(this.logData.logSearch).then((res) => {
        if (res) {
          let { count, list } = res.data;
          this.logData.dataList = list;
          this.logData.pagination.total = count;
        }
      });
    },
    // iteminfo(detail = []) {
    //   this.goodInfoVisible = true;
    //   this.currentDetail = JSON.parse(detail);
    // },
    filterGoods(val) {
      this.search.is_valid = val;
      this.init();
    },
    filterToday(val) {
      this.search.new_today = val;
      this.init();
    },
    freezeShop() {
      this.freezeShopVisible = true;
    },
    freezeCb() {
      this.infoObj.is_del = "1";
      this.infoObj.is_del_text = "冻结";
    },
  },
  computed: {
    bgc() {
      return this.infoObj.is_del === "0" ? "#bbe5b3" : "#ffc48b";
    },
    currentColumn() {
      return this[this.arrKey];
    },
    constructIds() {
      return (arr) => arr.map((v) => v.product_id);
    },
    calcIds() {
      return (arr) => arr.map((v) => v.id);
    },
    checkCalc() {
      return function (key, checkArr, value, label) {
        let arr = [];
        arr = checkArr.filter((ele) => {
          return ele.value == this.search[key];
        });
        if (arr.length > 0) {
          return arr[0].name;
        } else {
          return "";
        }
      };
    },
    calcHeight() {
      // if (this.arrKey == "noCheckColumn" || this.arrKey == "spotCheckColumn") {
      //   return "calc(100vh - 470px)";
      // } else {
      //   return "calc(100vh - 470px)";
      // }
      return "80vh";
    },
    comElpopover() {
      return this.currentIndex == 1
        ? this.elpopoverArr.slice(1, 3)
        : this.currentIndex == 2
        ? this.elpopoverArr.slice(1, 2)
        : this.currentIndex == 4
        ? [...this.elpopoverArr.slice(0, 1), ...this.elpopoverArr.slice(3)]
        : [...this.elpopoverArr.slice(1, 2), ...this.elpopoverArr.slice(3)];
    },
    calcXshoppy() {
      if (this.currentIndex == 0) {
        let arr = this.utils.deepClone(this.xshoppy);
        let insertObj = {
          label: "最近1周销量",
          prop: "week_sales_num",
          sortable: "custom",
          width: 125,
          align: "right",
        };
        arr.splice(3, 0, insertObj);
        return arr;
      } else if (this.currentIndex == 3) {
        return [];
      } else if (this.currentIndex == 4) {
        return this.xshoppy;
      } else {
        return this.xshoppy
          .slice(0, 3)
          .concat(
            this.xshoppy.slice(this.xshoppy.length - 2, this.xshoppy.length - 1)
          );
      }
    },
  },
};
</script>

<style scoped lang="scss">
.control-contaniner {
  position: relative;
  .freeze {
    position: absolute;
    right: 0;
    top: 0px;
  }
  .topTitte {
    display: flex;
    align-items: center;
    .status {
      padding: 0 8px;
      font-size: 13px;
      font-weight: 600;
      color: #414f3e;
      height: 20px;
      line-height: 20px;
      border-radius: 15px;
      margin-left: 8px;
    }
  }

  .shopInfo {
    background-color: #fff;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0px 1px 3px 0px rgba(35, 35, 112, 0.12),
      0px 0px 0px 1px rgba(67, 67, 145, 0.05);
    border-radius: 4px;
    .title {
      font-weight: 600;
      font-size: 16px;
      color: #1c3246;
    }
    .lists {
      margin-top: 16px;
      display: flex;
      justify-content: flex-start;
      .item {
        color: #303133;
        line-height: 20px;
        margin-right: 32px;
        font-size: 14px;
      }
    }
  }
  .conditions-content {
    .toggleBtns {
      /deep/ .el-tabs .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__nav-wrap {
          &::after {
            height: 1px;
            background-color: #c8d4df;
          }
          .el-tabs__nav-scroll {
            padding-left: 20px;
            .el-tabs__nav {
              .el-tabs__active-bar {
                height: 3px;
              }
              .el-tabs__item {
                height: 47px;
                line-height: 47px;
                color: #637381;
                font-weight: 500;
                &.is-active {
                  color: #212b36;
                  font-weight: 700;
                }
              }
            }
          }
        }
      }
      .exportbtn {
        float: right;
      }
    }

    .list-content {
      /deep/ .el-table {
        border: none;
        .el-table__header-wrapper {
          thead.is-group {
            background-color: #fafafa;
          }
        }
        .el-table__body {
          td {
            border-right: none;
          }
        }
        th.is-right {
          .cell {
            text-align: right;
          }
        }
        .el-image-viewer__close {
          .el-icon-circle-close:before {
            font-size: 40px;
            color: #606266;
          }
        }
      }
    }
  }
  .cobtrol-top {
    display: flex;
  }
}
</style>
