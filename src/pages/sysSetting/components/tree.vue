<!--
* @description 项目总览 树结构
* @fileName projectTree.vue
* @author 叶金龙
* @date 2019/07/17 14:08:08
* @version V1.0.0
!-->
<template>
  <el-tree
    ref="menuList"
    :data="treeData"
    :default-expanded-keys="expandArr"
    :props="{
      children: 'child',
      label: 'title',
    }"
    :render-content="renderContent"
    :filter-node-method="filterNode"
    check-strictly
    node-key="menu_id"
    highlight-current
    accordion
    @node-click="handleNodeClick"
  />
</template>

<script>
export default {
  name: "tree",
  components: {},
  props: {
    // searchNodeText: {
    //   type: [String, Number],
    //   default: "",
    // },
    // treeType: {
    //   type: String,
    //   default() {
    //     return null;
    //   },
    // },
    menuData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      treeData: null,
      parentIds: [],
      expandArr: [],
    };
  },
  watch: {
    searchNodeText: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.menuList.filter(val);
        });
      },
    },
    menuData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.treeData = val;
          this.expandArr = [];
          val[0].child.forEach((v) => {
            this.expandArr.push(v.menu_id);
          });
          this.$nextTick(() => {
            this.$refs.menuList.setCurrentKey(val[0].menu_id);
            this.$emit("getNodeObj", this.$refs.menuList.data[0]);
            this.$emit("parentIdsPath", null);
          });
        }
      },
    },
  },
  created() {
    // this.getTreeData();
  },
  mounted() {},
  methods: {
    // default-expand-all
    // 节点点击事件
    handleNodeClick(obj, Node, self) {
      Node.expanded = true;
      this.$emit("getNodeObj", obj);
    },

    renderContent(h, { node, data, store }) {
      return h(
        "div",
        {
          style: {
            fontSize: "14px",
          },
        },
        [
          node.level !== 4 &&
            h("svg-icon", {
              props: {
                iconClass: "tree",
              },
              style: {
                color: "#409eff",
              },
            }),
          h("span", {
            style: {
              paddingLeft: "10px",
            },
            domProps: {
              innerHTML: node.label,
            },
          }),
        ]
      );
    },
    // 搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="scss"></style>
