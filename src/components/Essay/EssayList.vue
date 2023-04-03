<template>
  <div v-loading="loading">
    <el-button @click="add">添加</el-button>
    <el-table v-if="list"
              :data="list"
              style="width: 100%">
      <el-table-column
          label="ID"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="随笔背景"
      >
        <template slot-scope="scope">
          <el-image
              style="width: 50px; height: 50px"
              :src="changeImgUrl(scope.row.imgurl)"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column
          label="随笔标题"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="随笔信息"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="创建日期"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateChange(scope.row.create_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="是否显示"
          prop="apply"
          width="100"
          filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.essay_show"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setDelete(scope.row.id,scope.row.essay_show)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeEssay(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="修改">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index)"
              icon="el-icon-edit"
              type="primary"
              circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="list"
                   background
                   layout="prev, pager, next"
                   :page-size="last_page"
                   :page-count="last_page"
                   :current-page="current_page"
                   @current-change="change"
                   style="display: flex;justify-content: center;margin-bottom:10px"
    >
    </el-pagination>
    <el-dialog :title="title+'信息'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="随笔标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="随笔信息" :label-width="formLabelWidth" style="height: 60px">
          <el-input v-model="form.info" autocomplete="off" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="随笔背景" class="avatar-img">
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
          <img height="60"
               v-if="this.form.imgurl"
               :src="changeImgUrl(this.form.imgurl)" class="avatar"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; update = true">取 消</el-button>
        <el-button v-if="update" type="primary" @click="updateEssay ">确 定</el-button>
        <el-button v-if="!update" type="primary" @click="addEssay">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'EssayList',
  data() {
    return {
      list: [],
      page: 1,
      current_page: 1,
      last_page: 1,
      loading: true,
      dialogFormVisible: false,
      update: true, // 输入框是用作添加还是修改
      title: "修改",
      form: {
        title: '',
        imgurl: '',
        info: '',
        create_time: '',
        id: ''
      },
      formLabelWidth: '120px',
    }
  },
  computed: {

    dateChange() {
      return (time) => {
        var date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s
      }
    },
    changeImgUrl() {
      return (url) => {
        return "/apis" + "/blog/static/img/" + url;
      }
    }
  },
  methods: {
    add() {
      this.form = this.$options.data().form
      this.title = "添加";
      this.update = false;
      this.dialogFormVisible = true
    },
    handleEdit(index) {
      this.form.id = this.list[index].id
      this.form.title = this.list[index].title
      this.form.imgurl = this.list[index].imgurl
      this.form.info = this.list[index].info
      this.form.create_time = this.list[index].create_time;
      this.form.essay_show = this.list[index].essay_show;
      this.dialogFormVisible = true
      this.title = "修改"
    },
    updateEssay() {
      axios({
        method: 'put',
        url: '/apis/essay',
        data: {
          id: this.form.id,
          imgurl: this.form.imgurl,
          title:this.form.title,
          info: this.form.info,
          essay_show: this.form.essay_show,
          create_time: this.form.create_time
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.update = true;
        if (res.data.data === true) {
          this.$message.success("修改成功");
          this.getEssayList()
        } else {
          this.$message.error("修改失败");
        }

      })

    },
    setDelete(id, essay_show) {
      let that = this
      axios({
        method: 'get',
        url: '/apis/essay/updateShow/',
        params:{
          id:id,
          essay_show:essay_show
        }
      })
          .then(function (res) {
            if (res.data.data === true) {
              that.$message.success("操作成功");
              this.getEssayList();
            } else {
              that.$message.error("操作失败")
            }
          })
          .catch(function (error) {

          })

    },
    change(page) {
      this.current_page = page
      this.getEssayList()
    },
    getEssayList() {
      let that = this
      that.loading = true
      axios({
        url: '/apis/essay/getAll/',
        method: 'get',
        params:{
          page:this.current_page,
          size:10
        }
      })
          .then(function (res) {
            console.log(res.data.data.records)
            that.list = res.data.data.records;
            that.loading = false
            that.last_page = Math.ceil(res.data.data.total / 10)
            that.current_page = res.data.data.current
          })
          .catch(function (error) {
          })
    },
    removeEssay(id) {
      axios({
        method: 'delete',
        url: '/apis/essay/',
        params:{
          id: id
        }
      }).then(res => {

        if (res.data.data === true) {
          this.$message.success("删除成功");
          this.getEssayList();
        } else {
          this.$message.error("删除失败");
        }
      })
    },
    addEssay() {
      axios({
        method: 'post',
        url: '/apis/essay',
        data: {
          imgurl: this.form.imgurl,
          title:this.form.title,
          info: this.form.info
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.update = true;
        if (res.data.data === true) {
          this.$message.success("添加成功");
          this.getEssayList();
        } else {
          this.$message.error("添加失败");
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.imgurl = res;
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
  },
  created() {
    this.getEssayList()
  }
}
</script>
<style lang="stylus" scoped>
.avatar-img {

  top:40px;
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