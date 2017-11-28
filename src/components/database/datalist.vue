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
          <Date-picker type="daterange" :value="time" @on-change="changeTime" placement="bottom-start" placeholder="选择日期" style="width: 200px"></Date-picker>
        </Col>
        <Col span="3" style="line-height: 32px;float: right;"><span>总消耗书币：{{total_money}}</span></Col>
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
        time: [new Date().getTime()-86400000,new Date().getTime()-86400000],
        start_time: '',
        end_time: '',
        novel_id: '',
        novelList: [],
        tableData: [],
        total_money: '0',
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
              return `${(new Date(times)).getFullYear()}年${(new Date(times)).getMonth() + 1}月${(new Date(times)).getDate()}日`
            },
            width: 150
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
            title: '消耗用户数',
            align: 'center',
            key: 'pay_count'
          },
          {
            title: '消耗书币',
            align: 'center',
            key: 'coin_num'
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
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render (row, column, index) {
              return `<i-button type="primary" size="small" @click="look(${index})">查看明细</i-button>`;
            }
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
                      this.$router.push('/login?jump=/data');
                  }else{
                      this.$Message.error(response.msg);
                  }
              })
      },
      mockTableData () {
          this.$Loading.start();
          this.$http.fetchPost('/api/DatabaseSummary/databaseList',{
              page: this.page,
              start_time: this.start_time,
              end_time: this.end_time,
              novel_id: this.novel_id
          })
              .then((response) => {
                  this.$Loading.finish();
                  if (response.code == 200) {
                      this.total_money = response.data.sum;
                      this.tableData = response.data.lists;
                      this.total = parseInt(response.data.total_page);
                  }else if(response.code == 300){
                      this.$Message.error(response.msg);
                      this.$router.push('/login?jump=/data');
                  }else{
                      this.$Message.error(response.msg);
                  }
              })
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
      changeTime (date) {
        this.time = date;
        this.start_time = new Date(this.time[0]).getTime()/1000;
        this.end_time = new Date(this.time[1]).getTime()/1000;
        this.page = 1;
        this.mockTableData();
      },
      look (index) {
        this.$router.push({path: 'datainfos',query: {novel_id: this.tableData[index].nid,time: this.tableData[index].time}});
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
      this.start_time = new Date(time).getTime()/1000 - 86400;
      this.end_time = new Date(time).getTime()/1000 - 86400;
      this.mockNovelList();
      this.addChangeEvent();
    }
  }
</script>

