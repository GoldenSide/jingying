export default {
    mounted () {
        this.activateTooltip = this.utils.debounce(tooltip => tooltip.handleShowPopper(), 50);
    },
    data(){
        return {
            progresses_status: {
                status_1: {
                  name: '未开始',
                  color: '#FF4D4F'
                },
                status_2: {
                  name: '进行中',
                  color: '#FFC53D'
                },
                status_3: {
                  name: '已完成',
                  color: '#52C41A'
                }
            },
            progresses_status_task: [
                {key: 'set_theme', name: '店铺装修', icon: 'icon-shop_Information'},
                {key: 'set_product', name: '上传商品', icon: 'icon-picture'},
                {key: 'set_logistics', name: '设置物流方式', icon: 'icon-car'},
                {key: 'set_domain', name: '绑定域名', icon: 'icon-Domain_setting'},
                {key: 'set_payment', name: '设置支付帐号', icon: 'icon-checkout'},
            ],
            toolTipHtml: '',
        }
    },
    methods: {
        handleCellMouseEnter(event, row){
            const tooltip = this.$refs.tooltip;
            this.toolTipHtml = ''
            if (tooltip) {
                this.toolTipHtml = this.getStatusHtml(row)
                tooltip.referenceElm = event.target;
                tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
                tooltip.doDestroy();
                tooltip.setExpectedState(true);
                this.activateTooltip(tooltip)
            }
        },
        handleCellMouseLeave(event){
            const tooltip = this.$refs.tooltip;
            if (tooltip) {
                tooltip.setExpectedState(false);
                tooltip.handleClosePopper();
            }
        },
        getStatusHtml(row){
            let liHtml = '<ul class="status-item-ul" >', task = row.task || {}
            this.progresses_status_task.forEach(item=>{
                let isOk = row.progresses_status == 3 || task[item.key] == 1
                liHtml += `
                <li class="status-item ${isOk ? 'status-item-ok' : ''}" >
                    <i class="iconfont ${isOk ? 'icon-status_ok' : item.icon}"></i>${item.name}
                </li>
                `
            })
            return liHtml+'</ul>'
        }
    },
}