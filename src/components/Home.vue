<style scoped>
    .layout{
        background: #f5f7f9;
        position: relative;
        overflow: scroll;
        height: 100%;
        min-width: 1400px;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: auto;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;

    }
    .layout-logo-left{
        width: 90%;
        height: 60px;
        line-height: 60px;
        font-size: 28px;
        text-align: center;
        /*  background: #5b6270;
          border-radius: 3px;
          margin: 15px auto;*/
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .ivu-row-flex{
        height: 100%;
    }
    .userinfo{
        display: inline-block;
        float: right;
    }
    .userinfo .ivu-dropdown{
        margin-top: 50px;
    }
    .ivu-dropdown {
        margin-right: 25px;
        margin-top: 22px;
    }
    .ivu-menu-submenu-title{
        padding: 14px;
    }

    .head-img {
        width: 100%;
        height: 60px;
        line-height: 60px;
        float: right;
        margin-top: -50px;
    }
    .head-img img{
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
        width: 40px;
        height: 40px;
        float: right;
    }


</style>
<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu :mode="modeType" theme="dark" width="auto" :active-name="this.$route.path" :open-names="['2']" @on-select="menuSelect" accordion>
                    <div class="layout-logo-left">
                        <Icon type="paper-airplane" :size="logoSize" v-show="logoIsDisplay"></Icon>
                        <span class="layout-text"> 小说版权商  管理系统</span>
                    </div>
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                        <Submenu :name="index" v-if="!item.leaf">
                            <template slot="title">
                                <Icon :type="item.iconCls" :size="iconSize"></Icon>
                                <span class="layout-text" >{{item.name}}</span>
                            </template>
                            <template v-for="(child,childIndex) in item.children" v-if="!child.hidden">
                                <Menu-item :name="child.path">{{child.name}}</Menu-item>
                            </template>
                        </Submenu>
                        <template  v-if="item.leaf&&item.children.length>0">
                            <Menu-item :name="item.children[0].path">
                                <Icon :type="item.iconCls" :size="iconSize"></Icon>
                                <span class="layout-text" >{{item.children[0].name}}</span>
                            </Menu-item>
                        </template>
                        <!-- <Submenu :name="index" v-if="item.leaf&&item.children.length>0">
                            <template slot="title">
                                    <Icon type="ios-navigate" :size="iconSize"></Icon>
                                    <span class="layout-text">{{item.children[0].name}}</span>
                               <Menu-item :name="item.children[0].path">{{item.children[0].name}}</Menu-item>
                            </template>
                        </Submenu>-->
                    </template>
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-header">
                    <div class="userinfo">
                        <Dropdown placement="bottom-end">
                            <!--  <a href="javascript:void(0)">
                                  Admin
                                  <Icon type="arrow-down-b"></Icon>
                              </a>-->
                        <span class="head-img">
                            {{user_name}}
                            <img src="../assets/user.png">
                        </span>
                            <Dropdown-menu slot="list">
                                <!--<Dropdown-item @click.native="modifyPassWord()">修改密码</Dropdown-item>-->
                                <Dropdown-item  @click.native="logout()">退出</Dropdown-item>
                            </Dropdown-menu>
                        </Dropdown>
                        <!--       <Menu mode="horizontal" theme="light">
                                <Submenu name="4">
                                   <template slot="title">
                                       Admin
                                   </template>
                                       <Menu-item name="4-1" @click.native="modifyPassWord()">修改密码</Menu-item>
                                       <Menu-item name="4-2" @click.native="logout()">退出登录</Menu-item>
                               </Submenu>
                             </Menu>  -->
                    </div>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item href="#">{{$route.matched[0].name}}</Breadcrumb-item>
                        <Breadcrumb-item>{{$route.name}}</Breadcrumb-item>
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                        <router-view></router-view>
                    </div>
                </div>
                <!--    <div class="layout-copy">
                        2011-2016 &copy; TalkingData
                    </div>
                    -->
            </i-col>
        </Row>

        <Modal
                v-model="modal1"
        >
            <p slot="header" style="color:#333;text-align:center">
                <span>修改密码</span>
            </p>
            <div style="color: #666; font-size: 14px;">
                <Row style="margin-bottom: 16px;">
                    当前密码： <Input v-model="formFun.oldpwd" placeholder="请输入当前密码" style="width: 200px;"></Input>
                </Row>
                <Row style="margin-bottom: 16px;">
                    新&nbsp;&nbsp;密&nbsp;&nbsp;码： <Input v-model="formFun.pwd" placeholder="请输入新密码" style="width: 200px;"></Input>
                </Row>
                <Row style="margin-bottom: 16px;">
                    确认密码： <Input v-model="formFun.newpwd" placeholder="请确认密码" style="width: 200px;"></Input>
                </Row>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveFun">提交</Button>
            </div>
        </Modal>
    </div>
    <!-- 修改密码 模态框 -->

    <!-- 修改密码 模态框 -->
</template>

<script>
    export default {
        data () {
            return {
                modeType: "vertical",
                modal1: false,
                spanLeft: 5,
                spanRight: 19,
                logoIsDisplay: false,
                formFun: {
                    pwd: '',
                    oldpwd: '',
                    newpwd: ''
                },
                user_name: JSON.parse(sessionStorage.getItem('user'))
            }
        },
        computed: {
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            },
            logoSize(){
                if(this.spanLeft !== 5){
                    this.logoIsDisplay = true;
                    return 30;
                }else{
                    this.logoIsDisplay = false;
                    return 0;
                }
            }
        },
        methods: {
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 1;
                    this.spanRight = 23;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            },
            modifyPassWord() {
                this.modal1 = true;
            },
            saveFun () {
                let _this = this;
                if(this.formFun.oldpwd == ''){
                    this.$Message.error('请输入当前密码!');
                }else if(this.formFun.pwd == ''){
                    this.$Message.error('请输入新密码!');
                }else if(this.formFun.oldpwd != this.formFun.newpwd){
                    this.$Message.error('两次密码输入不一致!');
                }else{
                    this.$http.fetchPost('/api/Index/resetPassword',this.formFun).then(function(response){
                        if(response.code == 200){
                            _this.$Message.success('提交成功!');
                            _this.modal1 = false;
                            _this.$router.push('/login');
                        }else{
                            _this.$Message.error(map.msg);
                        }
                    });
                }
            },
            logout() {
                let _this = this;
                this.$http.fetchPost('/api/UserAccount/loginOut').then(function(response){
                        if(response.code == 200){
                            _this.$Message.success('退出成功!');
                            _this.$router.push('/login');
                        }else{
                            _this.$Message.error(map.msg);
                        }
                    });
                this.$router.push('/login');
            },
            comfirmModifyPS() {
                this.$Message.info('点击了确定');
            },
            menuSelect(name) {
                this.$router.push({ path: name });
            }

        },
        mounted(){

        }
    }
</script>