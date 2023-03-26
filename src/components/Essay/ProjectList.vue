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
          label="项目图片"
      >
        <template slot-scope="scope">
          <el-image
              style="width: 50px; height: 50px"
              :src="changeImgUrl(scope.row.imgurl)"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column
          label="项目名称"
      >
        <template slot-scope="scope">
          <el-link :href="scope.row.link" type="success">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>

      <el-table-column
          label="项目介绍"
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
              v-model="scope.row.project_show"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setDelete(scope.row.id,scope.row.project_show)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeProject(scope.row.id)">删除
          </el-button>
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
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目地址" :label-width="formLabelWidth">
          <el-input v-model="form.link" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="项目图片" class="avatar-img">
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

        <el-form-item label="项目信息" :label-width="formLabelWidth" type="textarea">
          <el-input v-model="form.info" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; update = true">取 消</el-button>
        <el-button v-if="!update" type="primary" @click="addProject">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'ProjectList',
  data() {
    return {
      list: [],
      page: 1,
      current_page: 1,
      last_page: 1,
      loading: false,
      dialogFormVisible: false,
      update: true, // 输入框是用作添加还是修改
      title: "修改",
      form: {
        name: '',
        link: '',
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
    setDelete(id, project_show) {
      let that = this
      axios({
        method: 'get',
        url: '/apis/project/updateShow/',
        params: {
          id: id,
          project_show: project_show
        }
      })
          .then(function (res) {
            if (res.data.data === true) {
              that.$message.success("操作成功");
              this.getProjectList();
            } else {
              that.$message.error("操作失败")
            }
          })
          .catch(function (error) {

          })

    },

    getProjectList() {
      let that = this
      that.loading = false
      axios({
        url: '/apis/project/getAll',
        method: 'get'
      })
          .then(function (res) {
            that.list = res.data.data;
            that.loading = false
          })
          .catch(function (error) {
          })
    },
    removeProject(id) {
      axios({
        method: 'delete',
        url: '/apis/project/',
        params: {
          id: id
        }
      }).then(res => {
        if (res.data.data === true) {
          this.$message.success("删除成功");
          this.getProjectList();
        } else {
          this.$message.error("删除失败");
        }
      })
    },
    addProject() {
      axios({
        method: 'post',
        url: '/apis/project',
        data: {
          imgurl: this.form.imgurl,
          link: this.form.link,
          name: this.form.name,
          info: this.form.info
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.update = true;
        if (res.data.data === true) {
          this.$message.success("添加成功");
          this.getProjectList();
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
    this.getProjectList()
  }
}
</script>
<style lang="stylus" scoped>
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