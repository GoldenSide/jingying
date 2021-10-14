<!---*
* @description  公告详情
* @fileName detail.vue
* @author 叶金龙
* @date 2020/10/27 10:56:54
*--->
<template>
  <div class="noticeInfo-container">
    <goBack />
    <contHeader :titleText="$route.meta.title" />
    <div class="noticeContainer">
      <ul class="lists">
        <li class="item" v-for="(item, index) in itemConfig" :key="index">
          <label>{{ item.label }}</label>
          <div
            :class="['text']"
            v-if="item.prop == 'content'"
            v-html="itemInfo[item.prop] || '--'"
          ></div>
          <div class="text" v-else>{{ itemInfo[item.prop] || "--" }}</div>
        </li>
      </ul>
      <div class="noticeLog" v-if="$route.name == 'noticeInfo'">
        <div class="logTitle">操作记录</div>
        <step :steps="logInfo">
          <template slot="item" slot-scope="{ row }">
            <div class="rightBox">
              <div class="action_user">
                {{ row.action_user_name }}
              </div>
              <div class="content">
                <div class="text">{{ row.action_str }}:{{ row.content }}</div>
                <div class="time">
                  {{ row.create_time }}
                </div>
              </div>
            </div>
          </template>
        </step>
      </div>
    </div>
  </div>
</template>
<script>
import step from "@/components/step/index";
import {
  noticeItemInfo,
  msgHistoryInfo,
} from "@/api/serviceMn/customerMn/notice";
export default {
  name: "noticeInfo",
  components: { step },
  data() {
    return {
      itemConfig: [
        { label: "消息类型", prop: "type_str" },
        { label: "推送平台", prop: "platform_id_str" },
        { label: "跳转链接", prop: "redict" },
        { label: "推送对象", prop: "is_send_all_target_str" },
        { label: "标题", prop: "title" },
        { label: "更新时间", prop: "update_time" },
        { label: "撤回时间", prop: "recall_time" },
        { label: "正文", prop: "content" },
      ],
      itemInfo: {},
      logInfo: [],
    };
  },
  props: {},
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler(val) {
        if (Object.keys(val.query).length > 0) {
          let pathLastName = val.path.split("/");
          pathLastName = pathLastName[pathLastName.length - 1];

          if (pathLastName == "noticeInfo") {
            noticeItemInfo(val.query).then((res) => {
              this.itemInfo = res.data.message;
              this.logInfo = res.data.message_logs.list;
            });
          } else {
            msgHistoryInfo(val.query).then((res) => {
              this.itemInfo = res.data;
            });
          }
        }
      },
    },
  },
  created() {},
  methods: {
    itemRender(item) {
      return <span>{item.create_time}</span>;
    },
  },
};
</script>

<style scoped lang="scss">
.noticeInfo-container {
  overflow-y: scroll;
  .noticeContainer {
    .lists {
      background-color: #fff;
      padding: 0 20px 20px;
      .item {
        font-size: 14px;
        display: flex;
        justify-content: flex-start;
        border-bottom: 1px solid #dfe3e8;
        label {
          height: 56px;
          display: block;
          flex-basis: 100px;
          font-weight: 600;
          line-height: 56px;
        }
        .text {
          flex: 1;

          line-height: 56px;
        }
        &:last-child {
          border-bottom: none;
        }
        &:nth-of-type(3) {
          letter-spacing: 1px;
        }
        &:nth-of-type(3),
        &:last-child {
          .text {
            line-height: 30px;
            padding-top: 12px;
            max-height: 300px;
            overflow-y: scroll;
          }
        }
      }
    }
    .noticeLog {
      .logTitle {
        font-size: 13px;
        font-weight: 800;
        margin: 28px 0 12px;
      }

      .rightBox {
        font-size: 14px;
        width: 60vw;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        .action_user {
          flex-basis: 100px;
          color: #8b9099;
        }
        .content {
          flex: 1;
          padding-left: 16px;
          border-left: 1px solid #e1e1ec;
          display: flex;
          justify-content: space-between;
          .text {
            font-weight: 600;
          }
          .time {
            color: #8b9099;
          }
        }
      }
    }
  }
}
p {
  width: 100%;
}
</style>
