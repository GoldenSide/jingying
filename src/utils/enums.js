export default {
  searchTypeArr: [
    //业务搜索类型
    {
      value: 1,
      text: "公司名称"
    }
    // {
    //   value: 21,
    //   text: "账单编号"
    // }
  ],

  payStatusArr: [
    //支付状态
    {
      value: "w",
      name: "待支付"
    },
    {
      value: "s",
      name: "已支付"
    },
    {
      value: "f",
      name: "支付失败"
    }
  ],
  billStatusArr: [
    //   账单状态
    {
      value: "1",
      name: "正常"
    },
    {
      value: "2",
      name: "逾期"
    },
    {
      value: "3",
      name: "坏账"
    }
  ],
  isSendArr: {
    // 是否发送
    N: "否",
    Y: "是"
  },

  // 菜单层级
  menuLevelArr: [
    {
      value: 1,
      text: "一级菜单"
    },
    {
      value: 2,
      text: "二级菜单"
    },
    {
      value: 3,
      text: "三级菜单"
    }
  ],
  // 公告状态
  noticeStatus: [
    {
      value: "1",
      text: "草稿",
      checked: false
    },
    {
      value: "2",
      text: "已发布",
      checked: false
    },
    {
      value: "3",
      text: "已撤回",
      checked: false
    },
    {
      value: "4",
      text: "失败",
      checked: false
    }
  ],

  pickerOptions: {
    shortcuts: [
      {
        text: "过去7天",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "过去30天",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "过去90天",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
        }
      }
    ]
  },
  // 账单和佣金等支付方式枚举
  payWayEnums: [
    {
      value: "alipay",
      name: "支付宝"
    },
    {
      value: "paypal",
      name: "贝宝"
    },
    {
      value: "xshoppy",
      name: "系统赠送"
    },
    {
      value: "TongLian",
      name: "通联信用卡支付"
    },
    {
      value: "auto_paypal",
      name: "paypal自动扣款"
    },
    {
      value: "auto_TongLian",
      name: "通联自动扣款"
    },
    {
      value: "offline-alipay",
      name: "支付宝（线下支付）"
    },
    {
      value: "offline-bank",
      name: "银行卡（线下支付）"
    }
  ],
  // 开票类型
  invoiceType: [
    {
      value: "1",
      name: "电子普票"
    },
    {
      value: "2",
      name: "纸质专票"
    },
    {
      value: "3",
      name: "invoice"
    },
    {
      value: "4",
      name: "电子普票-手工"
    }
  ]
};
