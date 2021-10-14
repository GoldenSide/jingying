<!---*
* @description 递归组件
* @fileName featureModule.vue
* @author 叶金龙
* @date 2020/10/12 10:46:38
*--->
<template>
  <div :class="[{ featureItem: level < 4 }, 'box' + level]">
    <div :class="[level < 4 ? 'menu' : 'feature']">
      <div class="item">
        <el-checkbox
          v-model="featureline.is_select"
          @change="(checked) => checkChange(checked, featureline)"
        >
          {{
            featureline.hasOwnProperty("meta")
              ? featureline.meta.title
              : featureline.title
          }}</el-checkbox
        >
      </div>
    </div>
    <div
      class="recursive"
      :style="styleObj"
      v-if="featureline.hasOwnProperty('meta')"
    >
      <featureModule
        v-for="(line, index) in featureline.level <= 3 &&
        featureline.children.length > 0
          ? featureline.children
          : featureline.event_list"
        :key="index"
        :featureline="line"
        :level="line.level"
        :selectObject.sync="selectObject"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "featureModule",
  components: {},
  data() {
    return {};
  },

  props: {
    featureline: {
      type: Object,
      default() {
        return {};
      },
    },
    level: {
      type: [Number, String],
      default: 4,
    },
    selectObject: {
      type: Object,
    },
    panelWidth: {
      type: Number,
    },
  },
  watch: {
    selectObject: {
      immediate: true,
      deep: true,
      handler(val) {},
    },
    panelWidth: {
      immediate: true,
      deep: true,
      handler(val) {},
    },
  },
  created() {},
  methods: {
    checkChange(checked, { parentsIds, level = 4, menu_id }) {
      this.SET_CURRENT_TARGET({
        bool: checked,
        arr: parentsIds,
        level,
        menu_id,
      });
    },
    ...mapMutations("permission", ["SET_CURRENT_TARGET"]),
  },
  computed: {
    styleObj() {
      if (this.featureline.level < 3) {
        return {
          flexGrow: 1,
          flexWrap: "nowrap",
          flexShrink: 0,
        };
      } else {
        return {
          flexShrink: 1,
          flexWrap: "wrap",
        };
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.box1,
.box2,
.box3 {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
}
.box1 {
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  border-left: 1px solid #f0f0f0;
  .menu {
    .item {
    }
  }
}
.box2 {
  > .recursive:empty {
    border-left: 1px solid #f0f0f0;
  }
  &:not(:first-child) {
    border-top: 1px solid #f0f0f0;
  }
  .menu {
    border-left: 1px solid #f0f0f0;
  }
}
.box3 {
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
  .menu {
    border-right: 1px solid #f0f0f0;
  }
  .recursive {
    display: flex;
    justify-content: flex-start;
    padding: 16px;
    flex-grow: 0;
    flex-wrap: wrap;
    width: 32vw;
    .box4 {
      flex-shrink: 0;
      margin: 5px;
      width: 8.6vw;
      .feature {
        .item {
          border: none;
        }
      }
    }
  }
}

.featureItem {
  .menu {
    width: 12vw;
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .item {
      box-sizing: border-box;
      padding: 16px;
      width: 100%;
      flex-shrink: 0;
    }
  }
}
</style>
