<template>
<div class="logPage" >
  <div style="margin-top:50px">
  <font class="bigTitle">
    UGV监控平台
  </font>
  <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h2 class="title">系统登录</h2>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->

    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button>
      <el-button type="primary" style="width:48%;" @click.native.prevent="login" :loading="logining">登 录</el-button>

    </el-form-item>
  </el-form>
  </div>
</div>
</template>

<script>
  import Cookies from "js-cookie";
  import qs from 'qs';
  export default {
    name: 'Login',
    data() {
      return {
        logining: false,
        loginForm: {
          username: 'bishe',
          password: 'bishe_527'
        },
        fieldRules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      login() {
        let userInfo = {"username":this.loginForm.username, "password":this.loginForm.password}
      
        this.$api.login.login(qs.stringify(userInfo)).then((res) => {
   /*      this.$api.login.login(JSON.stringify(userInfo)).then((res) => { */
          console.log(res)
      //    this.$axios.post('api/login1', JSON.stringify(userInfo)).then((res) => {
         //   Cookies.set('token', res.level) // 放置token到Cookie

            sessionStorage.setItem('user', res) // 保存用户到本地会话
            this.$router.push('/')  // 登录成功，跳转到主页
          }).catch(function(res) {
            alert(res);
          });
      },
      
      reset() {
        this.$api.login.logCheck().then((res) => {
          console.log(res)
        })
        this.$refs.loginForm.resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .logPage {
    background-image: url('../assets/backGround.jpg');
    overflow: hidden;
    position: absolute;
    top: 0px;
    left:0px;
    width:100%;
    height:100%;
    background-size:cover;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .bigTitle{
    font-family: "微软雅黑";
    font-size: 45px;
    font-weight: bold;
    color: #fff;
  }
</style>