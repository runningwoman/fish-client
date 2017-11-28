<template>
  <div class="novel">
    <div style="margin: 10px;">
      <Row style="margin-bottom: 16px;">
        <Col span="6" class="opt">
            <select id="list-category" style="width: 200px;">
                <option v-for="item in novelList"  :value="item.id">{{item.name}}</option>
            </select>
          </Col>
        <Col span="4">
            <Select v-model="status" filterable placeholder="请选择状态" @on-change="change" clearable style="width:140px">
                <Option v-for="item in statusList" :value="item.id" :key="item">{{ item.name }}</Option>
            </Select>
        </Col>
      </Row>
    </div>

    <Table :context="self" :data="tableData" :columns="tableColumns" stripe border></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right">
        <Page :total="total" :current="page" @on-change="changePage" show-total></Page>
      </div>
    </div>
    <Modal
        v-model="modal1"
        width="900"
        >
        <p slot="header" style="color:#333;text-align:center">
            <span>推广文案</span>
        </p>
        <div style="color: #666; font-size: 14px;">
            <Row style="margin-bottom: 16px;">
                <Col span="5">副标题： </Col>
                <Col span="12">
                  <Input v-model="formFun.second_title" placeholder="请输入副标题" style="width: 200px;"></Input>  
                </Col>  
            </Row>
            <Row style="margin-bottom: 16px;">
                <Col span="5">推广章节： </Col>
                <Col span="12">
                  <Input v-model="formFun.spread_cid" placeholder="请输入推广章节" style="width: 200px;"></Input>  
                </Col>  
            </Row>
            <Row style="margin-bottom: 16px;">
              <Col span="5">推广图片： </Col>
              <Col span="12">
                <div class="demo-upload-list" v-for="item in uploadList">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    multiple
                    type="drag"
                    name="Filedata"
                    action="/file/Index/spread_uploadfile"
                    style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="camera" size="20"></Icon>
                    </div>
                </Upload>
                <Modal title="查看图片" v-model="visible">
                    <img :src="'http://file.jinyindao18.com/Public/home/spread/'+ imgName" v-if="visible" style="width: 100%">
                </Modal>
              </Col>
            </Row>
            <Row style="margin-bottom: 16px;">
                <Col span="5">推广文案： </Col>
                <Col span="18"><UE :defaultMsg="formFun.spread_content" :config="config" ref="ue"></UE></Col>
            </Row>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" @click="saveFun">保存</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
  import UE from '../ue/ue.vue';
  export default {
    data () {
      return {
        novelList: [],
        novel_id: '',
        status: '',
        statusList: [
            {id: '0', name: '下架'},
            {id: '1', name: '上架'}
        ],
        formFun: {
          novel_id: '',
          second_title: '',
          spread_cid: '',
          spread_litpic: '',
          spread_content: ''
        },
        modal1: false,
        self: this,
        tableData: [],
        total: 0,
        page: 1,
        defaultList: [
            
        ],
        imgName: '',
        visible: false,
        uploadList: [],
        tableColumns: [
          {
            title: '序号',
            key: 'id',
            align: 'center',
            width: 40

          },
          {
            title: '小说名称',
            align: 'center',
            key: 'novel_name'
          },
          {
            title: '小说类别',
            align: 'center',
            key: 'class_name'
          },
          {
            title: '作者',
            align: 'center',
            key: 'author_name'
          },
          {
            title: '字数',
            align: 'center',
            key: 'words'
          },
          {
            title: '章节数',
            align: 'center',
            key: 'rid'
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
            title: '操作',
            key: 'action',
            width: 240,
            align: 'center',
            render (row, column, index) {
                return `<i-button type="primary" size="small" @click="show(${row.id})">推广文案</i-button>`;

            }
        }
        ],
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        }
      }
    },
    components: {
      UE
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
          this.$http.fetchPost('/api/NovelManage/novelManage',{
              page: this.page,
              novel_id: this.novel_id,
              status: this.status
          })
              .then((response) => {
                  this.$Loading.finish();
                  if (response.code == 200) {
                      this.tableData = response.data.lists;
                      this.total = parseInt(response.data.total_page);
                  }else if(response.code == 300){
                      this.$Message.error(response.msg);
                      this.$router.push('/login?jump=/novel');
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
      updateData(data){
          this.formFun.spread_content = data;
      },
      show (index) {
        this.$http.fetchPost('/api/SpreadContent/spreadContentInfo',{
              novel_id: index
          })
          .then((response) => {

              if (response.code == 200) {
                  this.modal1 = true;
                  if(response.data.spread_content == null){
                    response.data.spread_content = '';
                  }
                  this.$refs.ue.setUEContent(response.data.spread_content);
                  this.formFun = response.data;
                  this.formFun.novel_id = index;
                  if(response.data.spread_litpic != '' && response.data.spread_litpic != null){
                    let cobj = {};
                    cobj.name = response.data.spread_litpic;
                    cobj.url = 'http://file.jinyindao18.com/Public/home/spread/' + response.data.spread_litpic;
                    cobj.status = 'finished';
                    this.$refs.upload.fileList = [];
                    this.uploadList = [];
                    this.uploadList.push(cobj);
                  }else{
                    this.$refs.upload.fileList = [];
                    this.uploadList = [];
                  }
              }else if(response.code == 300){
                  this.$Message.error(response.msg);
                  this.$router.push('/login?jump=/novel');
              }else{
                  this.$Message.error(response.msg);
              }
          })
      },
      saveFun (name) {
          this.formFun.spread_content =  this.$refs.ue.getUEContent();
          this.$http.fetchPost('/api/SpreadContent/spreadContentUpdate',this.formFun)
              .then((response) => {

                  if (response.code == 200) {
                      this.$Message.success('提交成功!');
                      this.modal1 = false;
                      this.$Loading.start();
                      this.mockTableData();
                  }else if(response.code == 300){
                      this.$Message.error(response.msg);
                      this.$router.push('/login?jump=/novel');
                  }else{
                      this.$Message.error(response.msg);
                  }
              })
      },
      change () {
            this.page = 1;
            this.mockTableData();
      },
      changePage (row) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        console.log(row);
        this.page = row;
        this.mockTableData();
      },
      handleView (name) {
          this.imgName = name;
          this.visible = true;
      },
      handleRemove (file) {
          // 从 upload 实例删除数据
          this.$refs.upload.fileList = this.uploadList;
          const fileList = this.$refs.upload.fileList;
          this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess (res, file) {
          // 因为上传过程为实例，这里模拟添加 url
          file.url = 'http://file.jinyindao18.com/Public/home/spread/' + res.filename;
          this.formFun.spread_litpic = res.filename;
          file.name = res.filename;
          this.uploadList = this.$refs.upload.fileList;
      },
      handleFormatError (file) {
          this.$Notice.warning({
              title: '文件格式不正确',
              desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
          });
      },
      handleMaxSize (file) {
          this.$Notice.warning({
              title: '超出文件大小限制',
              desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
          });
      },
      handleBeforeUpload () {
          const check = this.uploadList.length < 1;
          if (!check) {
              this.$Notice.warning({
                  title: '最多只能上传 1 张图片。'
              });
          }
          return check;
      },
    },
    mounted() {
      this.mockNovelList();
      this.addChangeEvent();
    }
  }
</script>
<style>
    .ivu-table-cell{
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
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
</style>

