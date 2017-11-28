<template>
    <div class="novel" style="min-height: 300px;">
        <div style="margin: 10px;">
            <Row style="margin-bottom: 16px;">
                <Col span="5">
                    <Date-picker type="month" :value="begin" @on-change="changeBeginTime" @on-clear="clearBeginTime" placement="bottom-start" placeholder="选择开始时间" style="width: 200px"></Date-picker>
                </Col>
                <Col span="1">
                ~
                </Col>
                <Col span="5">
                    <Date-picker type="month" :value="end" @on-change="changeEndTime" @on-clear="clearEndTime" placement="bottom-start" placeholder="选择结束时间" style="width: 200px"></Date-picker>
                </Col>
                <Col span="3">
                    <i-button type="success" size="large" @click="search">搜索</i-button>
                </Col>
                <Col span="5" style="line-height: 32px;"><span>总消费人数：{{month_person}} 人</span></Col>
                <Col span="5" style="line-height: 32px;"><span>总收益：{{month_money}} 元</span></Col>
                <!--<Col span="3" style="float: right;">
                    <i-button style="float: right; "type="success" size="large" @click="exportExcel">导出</i-button>
                </Col>-->
            </Row>
        </div>
        <Table :context="self" :data="tableData" :columns="tableColumns" stripe border></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right">
                <Page :total="total" :current="page" @on-change="changePage" show-total></Page>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                self: this,
                start_time: '',
                end_time: '',
                begin: '',
                end: '',
                page: 1,
                total: 0,
                month_person: 0,
                month_money: 0,
                tableData: [],
                url: 'http://xs.oneweone.cn',
                tableColumns: [
                    {
                        title: '版权商',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '收益(元)',
                        align: 'center',
                        key: 'money',
                    },
                    {
                        title: '消费人数',
                        align: 'center',
                        key: 'pay_count',
                    },
                    {
                        title: '时间',
                        align: 'center',
                        key: 'time',
                        render: function(row, column, index){
                            if(!row.time) return ''
                        var times = parseInt(row.time * 1000)
                        return `${(new Date(times)).getFullYear()}年${(new Date(times)).getMonth() + 1}月`
                        },
                        width: 150
                    },

                ]
            }
        },
        methods: {
            fundAdList () {
                let _this = this;
                this.$Loading.start();
                this.$http.fetchPost('/api/CopyRightProfit/copyrightProfitList',{
                    page: this.page,
                    copyright: this.copyright,
                    start_time: this.start_time,
                    end_time: this.end_time
                })
                    .then((response) => {
                        var map = response;
                        this.$Loading.finish();
                        if (response.code == 200) {
                            this.tableData = map.data.lists;
                            this.total = parseInt(map.data.total_page);
                            this.month_money = map.data.money;
                            this.month_person = map.data.pay_count;
                        }else if(response.code == 300){
                            this.$Message.error(response.msg);
                            this.$router.push('/login?jump=/copyrightprofit');
                        }else{
                            this.$Message.error(response.msg);
                        }
                    })
            },
            // exportExcel () {
            //     location.href = this.url + '/CopyrightMerchant/exportDiscountNovelDatabase?companytype='+this.companytype+'&end_time='+this.end_time+'&start_time='+this.start_time+'&progress='+this.progress;
            // },
            changeBeginTime (dates) {
                this.begin = dates;
                if(this.begin == ''){
                    this.start_time = '';
                }else{
                    this.start_time = new Date(this.begin).getTime()/1000;
                }
            },
            changeEndTime (dates) {
                this.end = dates;
                if(this.end == ''){
                    this.end_time = '';
                }else{
                    this.end_time = new Date(this.end).getTime()/1000;
                }
            },
            clearBeginTime () {
                this.begin = '';
                this.start_time = '';
            },
            clearEndTime () {
                this.end = '';
                this.end_time = '';
            },
            search () {
                if(this.start_time > this.end_time){
                    this.$Message.error('结束时间要大于开始时间');
                }else{
                    if(this.end_time == ''){
                        this.end_time = '';
                    }else{
                        this.end_time = new Date(this.renderDate(this.end)).getTime()/1000;
                    }
                    this.page = 1;
                    this.fundAdList();
                }
            },
            renderDate (date) {
                let day = new Date(date);
                let y = day.getFullYear();
                let m = day.getMonth() + 1;
                if(m == 12){
                y = y + 1;
                m = 1;
                }else {
                m++;
                }
                let time = y + '-' + m + '-01 08:00';
                return time;
            },
            changePage (row) {
                this.page = row;
                this.fundAdList();
            }
        },
        mounted() {
            let day = new Date();
            let y = day.getFullYear();
            let m = day.getMonth();
            let time = y + '-' + m + '-01 08:00'; 
            let time1 = y + '-' + (m+1) + '-01 08:00';
            this.begin = new Date(time).getTime();
            this.end = new Date(time).getTime();
            this.start_time = new Date(time).getTime()/1000;
            this.end_time = new Date(time1).getTime()/1000;
            this.fundAdList();
        }
    }
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .ivu-table-cell{
        padding-left: 4px;
        padding-right: 4px;
    }
</style>

