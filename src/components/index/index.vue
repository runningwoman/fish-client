<template>
    <div class="novel">
        <div style="margin: 10px;">
            <Row>
                <Col span="4">
                    <Select v-model="progress" filterable placeholder="请选择小说状态" @on-change="change" clearable style="width:140px">
                        <Option v-for="item in progressList" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col span="4">
                    <Select v-model="status" filterable placeholder="请选择状态" @on-change="change" clearable style="width:140px">
                        <Option v-for="item in statusList" :value="item.id" :key="item">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col span="4" style="line-height: 32px;"><span>今日消费人数：{{today_person}} 人</span></Col>
                <Col span="4" style="line-height: 32px;"><span>今日消耗金额：{{today_money}} 元</span></Col>
                <Col span="4" style="line-height: 32px;"><span>本月消费人数：{{month_person}} 人</span></Col>
                <Col span="4" style="line-height: 32px;"><span>本月消费金额：{{month_money}} 元</span></Col>
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
                page: 1,
                total: 0,
                progress: '',
                progressList: [
                    {id: '0', name: '连载中'},
                    {id: '1', name: '已完结'}
                ],
                status: '',
                statusList: [
                    {id: '0', name: '下架'},
                    {id: '1', name: '上架'}
                ],
                tableData: [],
                today_money: '',
                today_person: '',
                month_money: '',
                month_person: '',
                tableColumns: [
                    {
                        title: '序号',
                        key: 'id',
                        align: 'center',

                    },
                    {
                        title: '小说名称',
                        align: 'center',
                        key: 'novel_name',
                    },
                    {
                        title: '小说作者',
                        align: 'center',
                        key: 'author_name',
                    },
                    {
                        title: '小说类别',
                        align: 'center',
                        key: 'class_name',
                    },
                    {
                        title: '字数',
                        align: 'center',
                        key: 'words',
                    },
                    {
                        title: '更新章节',
                        align: 'center',
                        key: 'rname',
                    },
                    {
                        title: '小说状态',
                        align: 'center',
                        key: 'progress',
                        render (row, column, index) {
                            if(row.progress == 0){
                                return '连载中';
                            }else if(row.progress == 1){
                                return '已完结';
                            }
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render (row, column, index) {
                            if(row.status == 0){
                                return '<font color="red">下架</font>';
                            }else if(row.status == 1){
                                return '<font color="green">上架</font>';
                            }
                        }
                    },
                    {
                        title: 'PV',
                        align: 'center',
                        key: 'pv',
                    },
                    {
                        title: 'UV',
                        align: 'center',
                        key: 'uv',
                    },
                    {
                        title: '总消耗书币',
                        align: 'center',
                        key: 'coin',
                    },
                    {
                        title: '总消费人数',
                        align: 'center',
                        key: 'count',
                    },
                    {
                        title: '更新时间',
                        align: 'center',
                        key: 'time',
                        render: function(row, column, index){
                        var time;
                        if(row.update_time == '0'){
                            time = row.time
                        }else{
                            time = row.update_time;
                        }
                        var times = parseInt(time * 1000)
                        var h = new Date(times).getHours();
                        var m = new Date(times).getMinutes();
                        var s = new Date(times).getSeconds();
                        if(h < 10){
                            h = '0' + h;
                        }
                        if(m < 10){
                            m = '0' + m;
                        }
                        if(s < 10){
                            s = '0' + s;
                        }
                        return `${(new Date(times)).getFullYear()}年${(new Date(times)).getMonth() + 1}月${(new Date(times)).getDate()}日 ${h}:${m}:${s}`
                        },
                        width: 144
                    },
                    {
                        title: '上传时间',
                        align: 'center',
                        key: 'time',
                        render: function(row, column, index){
                            if(!row.time) return ''
                        var times = parseInt(row.time * 1000)
                        var h = new Date(times).getHours();
                        var m = new Date(times).getMinutes();
                        var s = new Date(times).getSeconds();
                        if(h < 10){
                            h = '0' + h;
                        }
                        if(m < 10){
                            m = '0' + m;
                        }
                        if(s < 10){
                            s = '0' + s;
                        }
                        return `${(new Date(times)).getFullYear()}年${(new Date(times)).getMonth() + 1}月${(new Date(times)).getDate()}日 ${h}:${m}:${s}`
                        },
                        width: 150
                    },

                ]
            }
        },
        methods: {
            fetchInfos () {
                this.$http.fetchPost('/api/Index/copyRightNovelDatabase')
                    .then((response) => {

                        if (response.code == 200) {
                            this.today_person = response.data.today_consumption_num;
                            this.today_money = response.data.today_consumption_coin;
                            this.month_person = response.data.this_month_consumption_num;
                            this.month_money = response.data.this_month_consumption_coin;
                            this.fundAdList();
                        }else if(response.code == 300){
                            this.$Message.error(map.msg);
                            this.$router.push('/login?jump=/index');
                        }else{
                            this.$Message.error(map.msg);
                        }
                    })
            },
            fundAdList () {
                this.$Loading.start();
                this.$http.fetchPost('/api/Index/novelRank',{
                    page: this.page,
                    progress: this.progress,
                    status: this.status
                })
                    .then((response) => {
                        this.$Loading.finish();
                        if (response.code == 200) {
                            this.tableData = response.data.lists;
                            this.total = parseInt(response.data.total_page);
                        }else if(response.code == 300){
                            this.$Message.error(response.msg);
                            this.$router.push('/login?jump=/index');
                        }else{
                            this.$Message.error(response.msg);
                        }
                    })
            },
            change () {
                this.page = 1;
                this.fundAdList();
            },
            changePage (row) {
                this.page = row;
                this.fundAdList();
            }
        },
        mounted() {
            this.fetchInfos();
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

