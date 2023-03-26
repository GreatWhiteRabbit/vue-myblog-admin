<template>
    <div v-loading="loading" class="route">
        <el-row>
            <el-col :md="{span:12,offset:6}" :sm="24" style="background-color:#fff;padding:30px 0">
                <el-form :model="userInfo" status-icon style="max-width:500px;margin-right:20px" ref="userInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户昵称" prop="name">
                <el-input v-model="userInfo.user_name"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
                <el-input type="email" v-model="userInfo.user_email"></el-input>
            </el-form-item>
            <el-form-item label="用户描述" prop="description">
                <el-input type="textarea" v-model="userInfo.user_description" ></el-input>
            </el-form-item>
<!--                  图片上传-->
                  <el-form-item label="头像" class="avatar-img">
                    <el-upload
                        class="avatar-uploader"
                        action="/apis/image/uploadAvatar"
                        list-type="picture-card"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :onError="uploadError"
                        :name="file"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <img height="60" v-if="avatar_url" :src="avatar_url" class="avatar" />
                  </el-form-item>
<!--                  图片上传-->
                  <el-form-item label="用户出生日期" prop="birthday">
                    <el-date-picker
                        v-model="userInfo.user_birthday"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                       >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="用户账号" prop="account">
                    <el-input type="account" v-model="userInfo.user_account"></el-input>
                  </el-form-item>

            <el-form-item label="原密码" prop="password" class="password">
                <el-input type="password" v-model="userInfo.user_password"></el-input>
                <el-button icon="el-icon-edit" class="password-edit" @click="update" style="background: none;
    border: none;"></el-button>
            </el-form-item>
            <el-collapse-transition>
                <div v-if="isUpdate">
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="password.first" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="password.second" autocomplete="off"></el-input>
                    </el-form-item>
                </div>
             </el-collapse-transition>
             <el-row>
                    <el-button type="primary" @click="checkPassWord">修改</el-button>
                    <el-button  @click="cancel">取消</el-button>
             </el-row>
        </el-form>
            </el-col>
        </el-row>
        
    </div>
</template>
<script>
import axios from "axios";

export default {
    name:'UserInfo',
        data(){
        return {
            isUpdate:false,
            loading:true,
            userInfo:"",
            cloneInfo:{},
            rules: {
                name: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
                ],
                  email: [
                    { required: true, message: '请输入email', trigger: 'blur' },
                    { min: 3, max: 30, message: '长度在 3 到 30个字符', trigger: 'blur' }
                ],

                  password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
                ],
                 pass: [
                   { required: true, message: '请输入新的密码', trigger: 'blur' },
                   { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
                ],
                checkPass: [
                  { required: true, message: '请确认密码', trigger: 'blur' },
                  { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
                ],
            },
          avatar_url: "/apis" + "/blog/static/img/" + sessionStorage.getItem("avatar_img"),
          password:{
              first:"",
              second:""
          },
          //图片相对位置
          relativeURL:sessionStorage.getItem("avatar_img"),
        }
    },
    methods:{
      cancel(){
        this.userInfo = this.cloneInfo;
      },
        update(){
            this.isUpdate=!this.isUpdate
        },
      checkPassWord() {
        if(this.password.first === this.password.second ) {
          if(this.password.first !== "") {
            this.userInfo.user_password = this.password.first;
          }
          this.submitForm();
        } else {
          this.$message({
            message:'两次密码不一致',
            type: 'error'
          });
        }
      },
        submitForm() {
        let that = this;
               axios({
                 method:'put',
                 url:'/apis/userInfo',
                 data:{
                   user_id:this.userInfo.user_id,
                  user_description : this.userInfo.user_description,
                   user_password :this.userInfo.user_password,
                   user_birthday : this.userInfo.user_birthday,
                   user_sex : this.userInfo.user_sex,
                   user_image : this.relativeURL,
                   user_account : this.userInfo.user_account
                 }
               }).then(function(res){
                 console.log(res)
                    if(res.data.success === true) {
                      that.$message({
                        message:"修改成功",
                        type:'success'
                      })
                    } else {
                      that.$message({
                        message:'修改失败',
                        type: 'error'
                      });
                    }

                }).catch(function(error){
                  that.$message({
                    message:'服务器异常',
                    type: 'error'
                  });
                })
        },
        getUserInfo(){
          let that = this;
           this.loading = true;
           axios({
            url:"/apis/userInfo/get",
            method:'get',
            params:{
              user_id: sessionStorage.getItem("user_id")
            }
          }).then(res => {
               that.userInfo=res.data.data;
                that.loading=false;
            this.cloneInfo.user_id = res.data.data.user_id;
            this.cloneInfo.user_description = res.data.data.user_description;
            this.cloneInfo.user_password = res.data.data.user_password;
            this.cloneInfo.user_birthday = res.data.data.user_birthday;
            this.cloneInfo.user_sex = res.data.data.user_sex;
            this.cloneInfo.user_image = res.data.data.user_image;
            this.cloneInfo.user_account = res.data.data.user_account;
            this.cloneInfo.user_status   = res.data.data.user_status;
            this.cloneInfo.user_email = res.data.data.user_email;
            this.cloneInfo.user_creattime = res.data.data.user_creattime;
            this.cloneInfo.user_name = res.data.data.user_name;
            })
        },

      handleAvatarSuccess(res, file) {
        this.avatar_url= "/apis" + "/blog/static/img/" + res;

        this.relativeURL = res;
      },
      beforeAvatarUpload(file) {
        const arr = [
          "image/jpeg",
          "image/gif",
          "image/jpg",
          "image/png",
          "image/x-png",
          "image/pjpeg",
        ];
        const isJPG = arr.indexOf(file.type) >= 0;
        const isLt2M = file.size / 1024 / 1024 < 4;

        if (!isJPG) {
          this.$message.error("上传头像格式不正确格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      uploadError() {
          console.log("上传失败");
      },
    },
    mounted(){
        this.getUserInfo()
    }

}
</script>
<style lang="stylus" scoped>
    .password
        position relative
        .password-edit
            position:absolute
            right:30px
            top:0
    .avatar-img {

      top: 0;
      right: 150px;
    }
    .avatar {
      position: absolute;
      top: 0;
      left: 160px;
      height: 148px;
      max-width: 148px;
      border-radius: 5px;
      display: block;
    }
</style>