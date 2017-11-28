<template>
  <div style="min-height: 300px;">
    <div style="margin: 10px;">
      <Row>
        <Col span="6" class="opt">
            <select id="list-category" style="width: 200px;">
                <option v-for="item in novelList"  :value="item.id">{{item.name}}</option>
            </select>
          </Col>
        <Col span="5">
          <Date-picker type="date" :value="time" @on-change="changeTime" placement="bottom-start" placeholder="选择日期" style="width: 200px"></Date-picker>
        </Col>
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
  const base = 'http://xs.oneweone.cn';
  export default {
    data () {
      return {
        self: this,
        time: new Date().getTime(),
        start_time: '',
        novel_id: '',
        tableData: [],
        total: 0,
        page: 1,
        novelList: [],
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
            key: 'user_name'
          },
          {
            title: '书名',
            align: 'center',
            key: 'novel_name',
          },
          {
            title: '作者',
            align: 'center',
            key: 'author_name'
          },
          {
              title: '更新章节',
              align: 'center',
              key: 'rname',
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
      mockNovelList () {
          this.$http.fetchPost('/api/NovelManage/novelList')
              .then((response) => {

                  if (response.code == 200) {
                      this.novelList = [];
                      this.novelList[0] = {id: '',name: '请选择小说'};
                      var _this = this;
                      response.data.forEach(function(o,i){
                        _this.novelList.push(o);
                      });
                      $('#list-category').select2();
                      $('#select2-list-category-container').html(this.novelList[0].name);
                      this.mockTableData();
                  }else if(response.code == 300){
                      this.$Message.error(response.msg);
                      this.$router.push('/login?jump=/novel');
                  }else{
                      this.$Message.error(response.msg);
                  }
              })
      },
      mockTableData () {
          this.$Loading.start();
          this.$http.fetchPost('/api/ConsumptionDetail/consumptionDetail',{
              page: this.page,
              time: this.start_time,
              novel_id: this.novel_id
          })
              .then((response) => {
                  this.$Loading.finish();
                  if (response.code == 200) {
                      this.tableData = response.data.lists;
                      this.total = parseInt(response.data.total_page);
                  }else if(response.code == 300){
                      this.$Message.error(response.msg);
                      this.$router.push('/login?jump=/realdata');
                  }else{
                      this.$Message.error(response.msg);
                  }
              })
      },
      changeTime (date) {
        this.time = date;
        this.start_time = new Date(this.time).getTime()/1000;
        this.page = 1;
        this.mockTableData();
      },
      addChangeEvent () {
          let _this = this;
          $('#list-category').on('change',function(e){
            let $target = $(e.currentTarget);
            _this.novel_id = $target.val();
            _this.page = 1;
            _this.mockTableData();
          });
      },
      changePage (row) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        console.log(row);
        this.page = row;
        this.mockTableData();
      }
    },
    mounted() {
      let day = new Date();
      let y = day.getFullYear();
      let m = day.getMonth() + 1;
      let d = day.getDate();
      let time = y + '-' + m + '-' + d + ' 08:00';
      this.start_time = new Date(time).getTime()/1000;
      this.mockNovelList();
      this.addChangeEvent();
    }
  }
</script>
<style>
.ivu-table-cell{
  padding-left: 4px;
  padding-right: 4px;
}
</style>

