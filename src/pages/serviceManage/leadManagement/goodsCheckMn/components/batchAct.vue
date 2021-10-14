<!---*
* @description 批量操作
* @fileName batchAct.vue
* @author 叶金龙
* @date 2020/12/16 17:11:48
*--->
<script>
export default {
  functional: true,
  props: {
    btns: Array,
    render: Function,
  },
  render: (h, ctx) => {
    let btns = ctx.props.btns;

    let render = ctx.props.render({ h, btns });
    if (typeof render != "object") {
      return <div>{render}</div>;
    } else {
      return render;
    }
  },
};
</script>