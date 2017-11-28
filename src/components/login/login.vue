<template>
    <i-form ref="formLogin" :model="formLogin" :rules="formLoginRules" class="card-box">
        <Form-item class="formLogin-title">
            <h3>系统登录</h3>
        </Form-item>

        <Form-item prop="username">
            <i-input size="large" type="text" v-model="formLogin.user_name" placeholder="用户名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item prop="password">
            <i-input size="large" type="password" v-model="formLogin.password" placeholder="密码">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </i-input>
        </Form-item>
        <Form-item class="login-no-bottom">
            <Row>
                <i-col :xs="{ span: 4, offset: 6 }">
                    <i-button type="primary" @click="handleSubmit('formLogin')">登录</i-button>
                </i-col>
                <i-col :xs="{ span: 4, offset: 6 }">
                    <i-button type="primary" @click="formLoginReset('formLogin')">重置</i-button>
                </i-col>
            </Row>
        </Form-item>
    </i-form>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                formLogin: {
                    user_name: '',
                    password: ''
                },
                jump: this.$route.query.jump || '/index',
                formLoginRules: {
                    user_name: [{
                        required: true,
                        message: '请填写用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请填写密码',
                        trigger: 'blur'
                    },
                        {
                            type: 'string',
                            min: 6,
                            message: '密码长度不能小于6位',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http.fetchPost('/api/UserAccount/userLogin',this.formLogin)

                            .then((response) => {

                                var map = response;

                                if (map.code == 200) {
                                    this.$Message.success('提交成功!');
                                    sessionStorage.setItem('user', JSON.stringify(this.formLogin.user_name));
                                    this.$router.push({
                                        path: this.jump
                                    });
                                    
                                } else {
                                    this.$Message.error(map.msg);
                                }
                            })
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })


            },
            formLoginReset(name) {
                this.$refs[name].resetFields();
            }
        },
        mounted() {

        }
    }
</script>


<style scoped>
    .card-box {
        padding: 20px;
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin-bottom: 20px;
        background-color: #F9FAFC;
        margin: 180px auto;
        width: 400px;
        border: 2px solid #8492A6;
    }

    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .formLogin-title {
        text-align: center;
        font-seze: 28px;
    }

    .formLogin-title h3 {
        font-size: 18px;
    }

    .login-no-bottom {
        margin-bottom: 10px;
    }
</style>