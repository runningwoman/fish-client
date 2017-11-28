<template>
  <div>
    <Table :context="self" :data="tableData" :columns="tableColumns" stripe border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right">
        <Page :total="total" :current="page" @on-change="changePage" show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
  const base = 'http://xs.oneweone.cn';
  export default {
    data () {
      return {
        self: this,
        novel_id: this.$route.query.novel_id,
        time: this.$route.query.time,
        tableData: [],
        total: 0,
        page: 1,
        tableColumns: [
          {
            title: '日期',
            key: 'time',
            align: 'center',
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
          {
            title: '昵称',
            align: 'center',
            key: 'user_name',
          },
          {
            title: '书名',
            align: 'center',
            key: 'novel_name',
          },
          {
            title: '章节',
            align: 'center',
            key: 'chapter_name'
          },
          {
            title: '消耗书币',
            align: 'center',
            key: 'coin'
          },
          {
              title: '更新章节',
              align: 'center',
              key: 'rname',
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
        ]
      }
    },
    methods: {
      mockTableData () {
          this.$Loading.start();
          this.$http.fetchPost('/api/DatabaseSummary/detailed',{
              page: this.page,
              time: this.time,
              novel_id: this.novel_id
          })
              .then((response) => {
                  this.$Loading.finish();
                  if (response.code == 200) {
                      this.tableData = response.data.lists;
                      this.total = parseInt(response.data.total_page);
                  }else if(response.code == 300){
                      this.$Message.error(response.msg);
                      this.$router.push('/login?jump=/datainfos');
                  }else{
                      this.$Message.error(response.msg);
                  }
              })
      },
      changePage (row) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        console.log(row);
        this.page = row;
        this.mockTableData();
      }
    },
    mounted() {
      this.mockTableData();
    }
  }
</script>
<style>
.ivu-table-cell{
  padding-left: 4px;
  padding-right: 4px;
}
</style>

