<template>
  <div :id="id" class="line-chart" :style="ownStyle"></div>
</template> 
<script>
import echarts from "echarts";
export default {
  name: "lineChart",
  props: {
    id: {
      type: String,
      default: "line-chart",
    },
    option: {
      type: Object,
    },
    ownStyle: {
      type: Object,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    option: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.xAxis.data.length) {
          this.initData(val);
        }
      },
    },
  },
  created() {},
  methods: {
    initData(val) {
      this.$nextTick(() => {
        this.chart.resize();
        this.chart.hideLoading();
        this.chart.setOption(val, true);
      });
    },
  },
  mounted() {
    const chartDiv = document.getElementById(this.id);
    this.chart = echarts.init(chartDiv);
    this.chart.showLoading({
      text: "加载中",
      textColor: "#2E37A4",
      color: "#2E37A4",
      maskColor: "rgba(0,0,0,0.04)",
    });
  },
};
</script>
<style lang="scss" scoped>
.line-chart {
}
</style>