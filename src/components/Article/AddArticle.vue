<template>
  <div  class="route">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <div class="article-title">
        <el-form-item label="文章封面" class="avatar-img">
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
          <img height="60" v-if="blog_cover" :src="blog_cover" class="avatar" />
        </el-form-item>

        <el-form-item label="文章标题" prop="title">
          <el-col :sm="13" :xs="24">
            <el-input v-model="form.title"></el-input>
          </el-col>
        </el-form-item>
      </div>

      <el-form-item label="文章摘要" prop="desc">
        <el-col :sm="13" :xs="24">
          <el-input v-model="form.desc" type="textarea" autosize></el-input>
        </el-col>
      </el-form-item>
      <el-row>
        <el-col :sm="7" :xs="24">
          <el-form-item label="文章类别" prop="classify">
            <el-input v-model="form.classify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="7" :xs="24">
          <el-form-item label="文章标签" prop="label">
            <el-input v-model="form.label"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :sm="4" :xs="12">
          <el-form-item label="首页显示">
            <el-switch
                v-model="form.is_show"
                :active-value="true"
                :inactive-value="false"
                active-color="#13ce66"
                inactive-color="#ccc"
            >
            </el-switch>
          </el-form-item>
        </el-col>

      </el-row>

      <div style="display: flex; justify-content: center; margin-bottom: 10px">
        <el-button type="primary" @click="onSubmit('form')">发布</el-button>
      </div>
    </el-form>
    <div>
      <v-md-editor
          v-model="HTMLtext"
          height="400px"
      ></v-md-editor>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import VueMarkdownEditor, {xss} from "@kangc/v-md-editor";
export default {
  name: "AddArticle",

  data() {
    return {
      checkboxGroup1: [],
      HTMLtext:"",
      blog_cover: "",
      relativeRUL: "",
      form: {
        title: "",
        desc: "",
        content: "",
        label: "",
        classify: "",
        click: "",
        is_show: true,
      },
      rules: {
        title: [{required: true, message: "标题不可为空", trigger: "blur"}],
        desc: [{required: true, message: "摘要不可为空", trigger: "blur"}],
        classify: [
          {required: true, message: "分类不可为空", trigger: "blur"},
        ],
        label: [{required: true, message: "标签不可为空", trigger: "blur"}],
      },
    };
  },
  methods:{

  onSubmit(formName) {
    // 为表单绑定验证功能
    let that = this;
    this.$refs[formName].validate((valid) => {
      if (valid) {
        that.submit();
      }
    });
  },
  submit() {

   const html = xss.process(VueMarkdownEditor.themeConfig.markdownParser.render(this.HTMLtext));
   var that = this;
   axios({
     url:"/apis/blog",
     method:"post",
     data:{
       blog_title: this.form.title,
       blog_content: html,
       blog_cover: this.relativeRUL,
       blog_description: this.form.desc,
       user_id: sessionStorage.getItem("user_id"),
       blog_show: this.form.is_show,
       category_name: this.form.classify,
       label_name: this.form.label,
       md_content: this.HTMLtext // 将markdown格式存储到数据库中
     }
   }).then(function (res) {

     if(res.data.data !== null){
       that.$message.success("发布成功");
       that.$router.push("/home/articles/list");
     }
        })

  },
  handleAvatarSuccess(res, file) {
    this.blog_cover = "/apis" + "/blog/static/img/" + res;
    this.relativeRUL = res;
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
    this.$message.error("上传失败");
  },
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