import Vue from "vue";
import Router from "vue-router";
import Layout from "@/components/layout/layout";
import Content from "@/components/layout/content";
import { MessageBox } from "element-ui";
Vue.use(Router);
export const commonRoute = [
  {
    path: "/login",
    name: "login",
    hidden: true,
    alias: "/",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/login/index")
  }
];

export const extendsRoutes = [
  //扩展业务
  //客服管理
  {
    path: "/index",
    hidden: true,
    component: Layout,
    meta: {
      title: "客户管理",
      icon: ""
    },
    children: [
      {
        path: "serviceMana",
        hidden: true,
        component: Content,
        children: [
          {
            path: "noticeInfo",
            name: "noticeInfo",
            hidden: true,
            component: () =>
              import(/* webpackChunkName: "noticeInfo" */ "@/pages/serviceManage/customerManage/notice/detail"),
            meta: {
              title: "公告详情",
              icon: "",
              jumpPath: "/index/serviceMana/sysNotice",
              isback: "sysNotice"
            }
          },
          {
            path: "noticeCreate",
            name: "noticeCreate",
            hidden: true,
            component: () =>
              import(/* webpackChunkName: "noticeCreate" */ "@/pages/serviceManage/customerManage/notice/create"),
            meta: {
              title: "创建公告",
              icon: "",
              jumpPath: "/index/serviceMana/sysNotice",
              isback: "sysNotice"
            }
          },
          {
            path: "noticeEdit",
            name: "noticeEdit",
            hidden: true,
            component: () =>
              import(/* webpackChunkName: "noticeEdit" */ "@/pages/serviceManage/customerManage/notice/create"),
            meta: {
              title: "编辑公告",
              icon: "",
              jumpPath: "/index/serviceMana/sysNotice",
              isback: "sysNotice"
            }
          },
          {
            path: "historyOrder",
            name: "historyOrder",
            hidden: true,
            component: () =>
              import(/* webpackChunkName: "historyOrder" */ "@/pages/serviceManage/customerManage/overdueBillFollow/historyOrder"),
            meta: {
              title: "逾期账单跟进列表-历史工单",
              icon: "",
              jumpPath: "/index/serviceMana/overdueBillFollow",
              isback: "overdueBillFollow"
            }
          }
        ]
      },
      {
        path: "leadManagement",
        hidden: true,
        component: Content,
        meta: {
          title: "商家列表",
          icon: ""
        },
        children: [
          {
            path: "msgInfo",
            name: "msgInfo",
            component: () =>
              import(/* webpackChunkName: "msgInfo" */ "@/pages/serviceManage/customerManage/notice/detail"),
            meta: {
              title: "消息详情",
              icon: "",
              jumpPath: "/index/leadManagement/msgList"
              // isback: "sysNotice"
            }
          },
          {
            path: "customerReview",
            name: "customerReview",
            hidden: true,
            component: () =>
              import(/* webpackChunkName: "customerReview" */ "@/pages/serviceManage/leadManagement/customerLeads/leadDetails/details"),
            meta: {
              title: "审核",
              icon: "",
              jumpPath: "/index/leadManagement/customerLeads",
              isback: "customerLeads"
            }
          },
          {
            path: "companyInfo",
            name: "companyInfo",
            component: () =>
              import(/* webpackChunkName: "companyInfo" */ "@/pages/serviceManage/leadManagement/companyList/listDetails/details"),
            meta: {
              title: "详情",
              icon: "",
              jumpPath: "/index/leadManagement/companyList",
              isback: "companyList"
            }
          },
          {
            path: "editModify",
            name: "editModify",
            component: () =>
              import(/* webpackChunkName: "editModify" */ "@/pages/serviceManage/leadManagement/companyList/listDetails/edit"),
            meta: {
              title: "编辑",
              icon: "",
              jumpPath: "/index/leadManagement/companyList",
              isback: "companyList"
            }
          },
          {
            path: "commodityDetail",
            name: "commodityDetail",
            component: () =>
              import(/* webpackChunkName: "commodityDetail" */ "@/pages/serviceManage/leadManagement/commodityControl/list"),
            meta: {
              title: "店铺商品风控列表--商品风控详情",
              icon: "",
              jumpPath: "/index/leadManagement/commodity",
              isback: "commodity"
            }
          },
          {
            path: "shopListReview",
            name: "shopListReview",
            component: () =>
              import(/* webpackChunkName: "shopListReview" */ "@/pages/serviceManage/leadManagement/shopManagementList/shopDetails/details"),
            meta: {
              title: "店铺详情",
              icon: "",
              jumpPath: "/index/leadManagement/shopManagementList",
              isback: "shopManagementList"
            }
          }
        ]
      },
      {
        path: "bankCount",
        component: Content,
        hiddenL: true,
        meta: {
          title: "申请审批",
          icon: ""
        },
        children: [
          {
            path: "countInfo",
            name: "countInfo",
            component: () =>
              import(/* webpackChunkName: "countInfo" */ "@/pages/serviceManage/bankCount/checkApply/detail"),
            meta: {
              title: "赛凌科技开通服务申请",
              icon: "",
              jumpPath: "/index/bankCount/checkApply",
              isback: "checkApply"
            }
          },
          {
            path: "discountReview",
            name: "discountReview",
            component: () =>
              import(/* webpackChunkName: "discountReview" */ "@/pages/serviceManage/leadManagement/discountAppList/discountDetails/details"),
            meta: {
              title: "客户优惠申请单详情",
              icon: "",
              jumpPath: "/index/bankCount/discountAppList",
              isback: "discountAppList"
            }
          }
        ]
      }
    ]
  },
  //客户管理end

  //财务管理strat
  {
    path: "/financeMana",
    component: Layout,
    hidden: true,
    meta: {
      title: "财务管理",
      icon: ""
    },
    children: [
      {
        path: "settlement",
        component: Content,
        meta: {
          title: "结算服务",
          icon: ""
        },
        children: [
          {
            path: "commissionBillDetail",
            name: "commissionBillDetail",
            hidden: true,
            component: () =>
              import(/* webpackChunkName: "commissionBillDetail" */ "@/pages/financialManage/itemList"),
            meta: {
              title: "交易佣金总览",
              icon: "",
              jumpPath: "/financeMana/settlement/billOverview",
              isback: "billOverview"
            }
          },
          {
            path: "detail",
            name: "detail",
            hidden: true,
            component: () =>
              import(/* webpackChunkName: "billItem" */ "@/pages/financialManage/detail"),
            meta: {
              title: "账单信息",
              icon: "",
              jumpPath: "/financeMana/settlement/billList",
              isback: "billList"
            }
          }
        ]
      }
    ]
  }
];

export const devRoutes = [
  {
    path: "/index",
    name: "index",
    component: Layout,
    redirect: "/index/serviceMana/overdueBillFollow",
    meta: {
      title: "客户管理",
      icon: ""
    },
    children: [
      {
        path: "serviceMana",
        name: "serviceMana",
        component: Content,
        meta: {
          title: "客服管理",
          icon: "customerservice"
        },
        children: [
          // {
          //   path: "overdueSellers",
          //   name: "overdueSellers",
          //   component: () =>
          //     import(/* webpackChunkName: "overdueSellers" */ "@/pages/serviceManage/customerManage/overdueBillOverview/list"),
          //   meta: {
          //     title: "逾期买家总览",
          //     icon: ""
          //   }
          // },
          // {
          //   path: "sellerFollow",
          //   name: "sellerFollow",
          //   component: () =>
          //     import(/* webpackChunkName: "sellerFollow" */ "@/pages/serviceManage/customerManage/sellerFollow/list"),
          //   meta: {
          //     title: "卖家跟进",
          //     icon: ""
          //   }
          // },
          {
            path: "overdueBillFollow",
            name: "overdueBillFollow",
            component: () =>
              import(/* webpackChunkName: "overdueBillFollow" */ "@/pages/serviceManage/customerManage/overdueBillFollow/list"),
            meta: {
              title: "逾期账单跟进",
              icon: "",
              cache: true
            }
          },
          // {
          //   path: "badDebtApplicationForm",
          //   name: "badDebtApplicationForm",
          //   component: () =>
          //     import(/* webpackChunkName: "badDebtApplicationForm" */ "@/pages/serviceManage/customerManage/badDebtList/list"),
          //   meta: {
          //     title: "坏账申请单",
          //     icon: ""
          //   }
          // },
          {
            path: "sysNotice",
            name: "sysNotice",
            component: () =>
              import(/* webpackChunkName: "sysNotice" */ "@/pages/serviceManage/customerManage/notice/list"),
            meta: {
              title: "公告",
              icon: "",
              cache: true
            }
          },
          {
            path: "msgList",
            name: "msgList",
            component: () =>
              import(/* webpackChunkName: "msgList" */ "@/pages/serviceManage/customerManage/notice/list"),
            meta: {
              title: "mgr历史消息列表",
              icon: ""
              // cache: true
            }
          }
        ]
      },
      {
        path: "leadManagement",
        name: "leadManagement",
        component: Content,
        meta: {
          title: "商家管理",
          icon: "merchantList"
        },
        children: [
          {
            path: "customerLeads",
            name: "customerLeads",
            component: () =>
              import(/* webpackChunkName: "customerLeads" */ "@/pages/serviceManage/leadManagement/customerLeads/customerLeads"),
            meta: {
              title: "入驻申请单",
              icon: "",
              cache: true
            }
          },
          {
            path: "companyList",
            name: "companyList",
            component: () =>
              import(/* webpackChunkName: "companyList" */ "@/pages/serviceManage/leadManagement/companyList/companyList"),
            meta: {
              title: "客户线索池",
              icon: "",
              cache: true
            }
          },
          {
            path: "levelManagement",
            name: "levelManagement",
            component: () =>
              import(/* webpackChunkName: "levelManagement" */ "@/pages/serviceManage/leadManagement/levelManagement/level"),
            meta: {
              title: "客户级别管理",
              icon: ""
            }
          },
          {
            path: "followUp",
            name: "followUp",
            component: () =>
              import(/* webpackChunkName: "followUp" */ "@/pages/serviceManage/leadManagement/followUp/list"),
            meta: {
              title: "客户跟进列表",
              icon: "",
              cache: true
            }
          },
          {
            path: "shopManagementList",
            name: "shopManagementList",
            component: () =>
              import(/* webpackChunkName: "shopManagementList" */ "@/pages/serviceManage/leadManagement/shopManagementList/shopManagement"),
            meta: {
              title: "企业店铺管理",
              icon: "",
              cache: true
            }
          },
          {
            path: "superPwd",
            name: "superPwd",
            component: () =>
              import(/* webpackChunkName: "superPwd" */ "@/pages/serviceManage/leadManagement/superPwd/index"),
            meta: {
              title: "超级密码",
              icon: ""
            }
          },

          {
            path: "customerPortrait",
            name: "customerPortrait",
            component: () =>
              import(/* webpackChunkName: "customerPortrait" */ "@/pages/serviceManage/leadManagement/customerPortrait/list"),
            meta: {
              title: "客户画像管理",
              icon: ""
            }
          }
        ]
      },
      {
        path: "riskControlMn",
        name: "riskControlMn",
        component: Content,
        meta: {
          title: "风控管理",
          icon: "fengkongguanli"
        },
        children: [
          {
            path: "commodity",
            name: "commodity",
            component: () =>
              import(/* webpackChunkName: "commodity" */ "@/pages/serviceManage/leadManagement/commodityControl/index"),
            meta: {
              title: "店铺风控列表",
              icon: "",
              cache: true
            }
          },
          {
            path: "prohibited",
            name: "prohibited",
            component: () =>
              import(/* webpackChunkName: "prohibited" */ "@/pages/serviceManage/leadManagement/prohibitedWords/list"),
            meta: {
              title: "违禁词库",
              icon: ""
            }
          },
          {
            path: "goodsCheckMn",
            name: "goodsCheckMn",
            component: () =>
              import(/* webpackChunkName: "goodsCheckMn" */ "@/pages/serviceManage/leadManagement/goodsCheckMn/list"),
            meta: {
              title: "商品审核管理",
              icon: ""
            }
          },
          {
            path: "riskControlPanel",
            name: "riskControlPanel",
            component: () =>
              import(/* webpackChunkName: "riskControlPanel" */ "@/pages/serviceManage/leadManagement/riskControlPanel/list"),
            meta: {
              title: "风控审核关键数据",
              icon: ""
            }
          }
        ]
      },
      {
        path: "bankCount",
        name: "bankCount",
        component: Content,
        meta: {
          title: "审批管理",
          icon: "checkMn"
        },
        children: [
          {
            path: "checkApply",
            name: "checkApply",
            component: () =>
              import(/* webpackChunkName: "checkApply" */ "@/pages/serviceManage/bankCount/checkApply"),
            meta: {
              title: "客户银行账户开通",
              icon: "",
              cache: true
            }
          },
          {
            path: "servicesApplyMn",
            name: "servicesApplyMn",
            component: () =>
              import(/* webpackChunkName: "servicesApplyMn" */ "@/pages/serviceManage/leadManagement/servicesApplyMn/list"),
            meta: {
              title: "服务申请单管理",
              icon: "",
              cache: true
            }
          },
          {
            path: "discountAppList",
            name: "discountAppList",
            component: () =>
              import(/* webpackChunkName: "discountAppList" */ "@/pages/serviceManage/leadManagement/discountAppList/discountAppList"),
            meta: {
              title: "客户优惠申请单",
              icon: "",
              cache: true
            }
          },

          {
            path: "paymentOrder",
            name: "paymentOrder",
            component: () =>
              import(/* webpackChunkName: "paymentOrder" */ "@/pages/serviceManage/leadManagement/paymentOrder/list"),
            meta: {
              title: "催款工单管理",
              icon: ""
            }
          }
        ]
      }
    ]
  },

  {
    path: "/financeMana",
    name: "financeMana",
    component: Layout,
    redirect: "/financeMana/settlement/billOverview",
    meta: {
      title: "财务管理",
      icon: ""
    },
    children: [
      {
        path: "settlement",
        name: "settlement",
        component: Content,
        redirect: "/financeMana/settlement/billOverview",
        meta: {
          title: "结算服务",
          icon: "settlementServices"
        },
        children: [
          {
            path: "billOverview",
            name: "billOverview",
            component: () =>
              import(/* webpackChunkName: "billOverview" */ "@/pages/financialManage/index"),
            meta: {
              title: "交易佣金总览",
              icon: "",
              cache: true
            }
          },
          {
            path: "billList",
            name: "billList",
            component: () =>
              import(/* webpackChunkName: "commissionBillList" */ "@/pages/financialManage/list"),
            meta: {
              title: "交易佣金账单列表",
              icon: "",
              cache: true
            }
          },
          {
            path: "revenue",
            name: "revenue",
            component: () =>
              import(/* webpackChunkName: "revenue" */ "@/pages/financialManage/revenue/revenue"),
            meta: {
              title: "套餐收入流水",
              icon: "",
              cache: true
            }
          },
          {
            path: "payment",
            name: "payment",
            component: () =>
              import(/* webpackChunkName: "payment" */ "@/pages/financialManage/payment/payment"),
            meta: {
              title: "账单线下支付流水",
              icon: "",
              cache: true
            }
          },
          {
            path: "invoiceTitle",
            name: "invoiceTitle",
            component: () =>
              import(/* webpackChunkName: "invoiceTitle" */ "@/pages/financialManage/invoiceTitle/list"),
            meta: {
              title: "客户发票抬头信息",
              icon: "",
              cache: true
            }
          },
          {
            path: "invoiceList",
            name: "invoiceList",
            component: () =>
              import(/* webpackChunkName: "invoiceList" */ "@/pages/financialManage/invoiceList/list"),
            meta: {
              title: "发票查询管理",
              icon: "",
              cache: true
            }
          }
        ]
      }
    ]
  },

  {
    path: "/sysSetting",
    name: "sysSetting",
    component: Layout,
    redirect: "/sysSetting/featureMn/rolesMana",
    meta: {
      title: "系统设置",
      icon: ""
    },
    children: [
      {
        path: "featureMn",
        name: "featureMn",
        component: Content,

        meta: {
          title: "权限管理",
          icon: "featureMn"
        },
        children: [
          {
            path: "rolesMana",
            name: "rolesMana",
            component: () =>
              import(/* webpackChunkName: "rolesMana" */ "@/pages/sysSetting/rolesMn/list"),
            meta: {
              title: "角色管理",
              icon: ""
            }
          },
          {
            path: "usersMana",
            name: "usersMana",
            component: () =>
              import(/* webpackChunkName: "usersMana" */ "@/pages/sysSetting/userMn/list"),
            meta: {
              title: "用户管理",
              icon: ""
            }
          },
          {
            path: "menuMana",
            name: "menuMana",
            component: () =>
              import(/* webpackChunkName: "menuMana" */ "@/pages/sysSetting/menusMn/list"),
            meta: {
              title: "菜单管理",
              icon: ""
            }
          }
        ]
      }
    ]
  },
  {
    path: "/404",
    name: "404",
    hidden: true,
    component: () => import(/* webpackChunkName: "404" */ "@/pages/404")
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
].concat(commonRoute, extendsRoutes);

export const asyncRouter = [].concat(commonRoute, extendsRoutes);
export default new Router({
  mode: "hash",
  scrollBehavior: () => ({
    x: 0,
    y: 0
  }),
  routes: process.env.NODE_ENV == "development" ? devRoutes : asyncRouter
  // routes: process.env.NODE_ENV == "development" ? devRoutes : asyncRouter
});
