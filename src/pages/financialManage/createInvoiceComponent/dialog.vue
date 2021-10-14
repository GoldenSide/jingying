<!---*
* @description  开票弹窗
* @fileName dialog.vue
* @author 叶金龙
* @date 2021/06/09 11:13:57
*--->
<template>
  <el-dialog
    title="开票信息"
    :visible.sync="invoiceVisible"
    width="634px"
    :before-close="simpleClose"
    :close-on-click-modal="false"
  >
    <basicInfo
      :isPaypal="isPaypal"
      :obj="selectArr[0]"
      :totalMoney="totalMoney(isPaypal)"
      :invoice_source="invoice_source"
    />
    <editMoney
      :dataObj="dataObj"
      :isPaypal="isPaypal"
      :totalMoney="totalMoney(isPaypal)"
      ref="one"
    />
    <invoiceTitleSec :dataObj="dataObj" ref="two" />
    <span slot="footer">
      <el-button @click="simpleClose" size="medium">取消</el-button>
      <el-button
        type="primary"
        @click="submit"
        size="medium"
        :loading="loading"
        :disabled="isDis"
        >确认开票</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import basicInfo from "./basicInfo.vue";
import editMoney from "./eidtMoney.vue";
import invoiceTitleSec from "./invoiceTitle.vue";
import dayjs from "dayjs";
import { invoiceTitleList } from "@/api/finance/invoiceTitle";
import { createInvoice, checkInvoiceSKU } from "@/api/finance/list";
import { createWaterListInvoice } from "@/api/finance/revenue/revenue";
import { companyInfo } from "@/api/leadManagement/companyList";
export default {
  name: "crateInvoiceDialog",
  components: { basicInfo, editMoney, invoiceTitleSec },
  data() {
    return {
      dataObj: {
        company_id: null,
        invoice_source: "",
        order_nos: [],
        invoice_title: "信息技术服务",
        invoice_title_type: "1",
        invoice_amount: 0,
        invoice_amount_type: null,
        invoice_type: "1",
        invoice_company_name: "",
        invoice_company_tax_number: "",
        address: "",
        mobile: "",
        bank_name: "",
        bank_no: "",
        invoice_receive_email: "",
        invoice_date: dayjs().format("YYYY/MM/DD"),
        invoice_no: "",
      },
      loading: false,
      isDis: false,
    };
  },
  props: {
    invoiceVisible: {
      type: Boolean,
      default: false,
    },
    selectArr: {
      type: Array,
      default() {
        return [];
      },
    },
    order_nos: {
      type: Array,
      default() {
        return [];
      },
    },
    init: {
      type: Function,
    },
    isPaypal: {
      type: Boolean,
      default: false,
    },
    invoice_source: {
      type: String,
      default: "1",
    },
  },
  watch: {
    selectArr: {
      immediate: true,
      handler(val) {
        this.dataObj.company_id = val[0].company_id;
        this.getInvoiceTitle(this.dataObj.company_id);
      },
    },
    isPaypal: {
      immediate: true,
      handler(val) {
        this.dataObj.invoice_amount_type = val ? "2" : "1";
        this.dataObj.invoice_type = val ? "3" : "1";
      },
    },
    "dataObj.invoice_type": {
      immediate: true,
      handler(val) {
        this.isDis = false;
        if (val == "1") {
          checkInvoiceSKU().then((res) => {
            if (res.data == 2) {
              this.isDis = true;
              this.$message.console.error(
                "电子普票已没有库存，无法开票，请联系客服或财务人员处理"
              );
            }
          });
        }
      },
    },
  },
  created() {},
  methods: {
    getInvoiceTitle(company_id) {
      invoiceTitleList({ page: 1, page_size: 5, company_id }).then((res) => {
        let { list } = res.data;
        if (list.length > 0) {
          let {
            invoice_company_name,
            invoice_company_tax_number,
            address,
            mobile,
            bank_name,
            bank_no,
            invoice_receive_email,
          } = res.data.list[0];
          this.dataObj = {
            ...this.dataObj,
            ...{
              invoice_company_name,
              invoice_company_tax_number,
              address,
              mobile,
              bank_name,
              bank_no,
              invoice_receive_email,
            },
          };
        } else {
          companyInfo({ id: company_id }).then((res) => {
            let { email } = res.data;
            this.dataObj.invoice_receive_email = email;
          });
        }
      });
    },
    simpleClose() {
      this.$emit("update:invoiceVisible", false);
    },
    submit() {
      this.dataObj = {
        ...this.dataObj,
        ...{
          order_nos: this.order_nos,
          invoice_source: this.invoice_source,
        },
      };
      let onePromise = this.$refs["one"].validateForm();
      let twoPromise = this.$refs["two"].validateForm();
      Promise.all([onePromise, twoPromise])
        .then((result) => {
          this.utils.deleConfig(
            this,
            "请确认开票信息无误后，点击确定",
            "提示",
            ["确定", "取消"],
            this.postInvoice()
          );
        })
        .catch((error) => {
          return;
        });
    },
    postInvoice() {
      return () => {
        this.loading = true;
        if (this.dataObj.invoice_source == "1") {
          createInvoice(this.dataObj)
            .then((res) => {
              this.loading = false;
              this.simpleClose();
              this.init();
              this.$message.success("开票成功");
            })
            .catch((err) => {
              this.loading = false;
            });
        } else if (
          this.dataObj.invoice_source == "2" ||
          this.dataObj.invoice_source == "3"
        ) {
          createWaterListInvoice(this.dataObj)
            .then((res) => {
              this.loading = false;
              this.simpleClose();
              this.init();
              this.$message.success("开票成功");
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      };
    },
  },
  computed: {
    totalMoney() {
      return (bool) => {
        let RMB = 0;
        let dor = 0;
        if (this.invoice_source == "1") {
          for (const {
            discount_after_commission_amount_rmb,
            discount_after_commission_amount,
          } of this.selectArr) {
            RMB += Number(discount_after_commission_amount_rmb);
            dor += Number(discount_after_commission_amount);
          }
        } else if (this.invoice_source == "2" || this.invoice_source == "3") {
          for (const { selling_price, selling_price_usd } of this.selectArr) {
            RMB += Number(selling_price);
            dor += Number(selling_price_usd);
          }
        }
        return bool ? dor.toFixed(2) : RMB.toFixed(2);
      };
    },
  },
};
</script>

<style scoped lang="scss"></style>
