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
          label="网站图标"
      >
        <template slot-scope="scope">
          <el-image
              style="width: 50px; height: 50px"
              :src="urlForm(scope.row.imgurl)"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column
          label="网站名称"
      >
        <template slot-scope="scope">
          <el-link :href="scope.row.link" type="success">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>

      <el-table-column
          label="网站介绍"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.info }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="申请日期"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateChange(scope.row.apply_time) }}</span>
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
              v-model="scope.row.link_show"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setDelete(scope.row.id,scope.row.link_show)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeLink(scope.row.id)">删除
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
        <el-form-item label="网站名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网站地址" :label-width="formLabelWidth">
          <el-input v-model="form.link" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="网站图片图片" class="avatar-img">
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

        <el-form-item label="网站信息" :label-width="formLabelWidth">
          <el-input v-model="form.info" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; update = true">取 消</el-button>
        <el-button v-if="update" type="primary" @click="updateLink ">确 定</el-button>
        <el-button v-if="!update" type="primary" @click="addLink">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'LinkList',
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
        name: '',
        link: '',
        imgurl: '',
        info: '',
        apply_time: '',
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
    },
    urlForm() {
      return (url) => {
        if(url.substring(0,4) === "http") return url;
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
      this.form.name = this.list[index].name
      this.form.link = this.list[index].link
      this.form.imgurl = this.list[index].imgurl
      this.form.info = this.list[index].info
      this.form.apply_time = this.list[index].apply_time;
      this.form.link_show = this.list[index].link_show;
      this.dialogFormVisible = true
      this.title = "修改"
    },
    updateLink() {
      axios({
        method: 'put',
        url: '/apis/link',
        data: {
          id: this.form.id,
          imgurl: this.form.imgurl,
          link: this.form.link,
          name: this.form.name,
          info: this.form.info,
          link_show: this.form.link_show,
          apply_time: this.form.apply_time
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.update = true;
            if (res.data.success === true) {
              this.$message.success("修改成功");
              this.getArticleList()
            } else {
              this.$message.error("修改失败");
            }

          })

    },
    setDelete(id, link_show) {
      let that = this
      axios({
        method: 'post',
        url: '/apis/link/remove/' + id + '/' + link_show
      })
          .then(function (res) {
            if (res.data.success === true) {
              that.$message.success("操作成功");
            } else {
              that.$message.error("操作失败")
            }
          })
          .catch(function (error) {

          })

    },
    change(page) {
      this.current_page = page
      this.getArticleList()
    },
    getLinkList() {
      let that = this
      that.loading = true
      axios({
        url: '/apis/link/getAll/' + this.current_page + "/" + 10,
        method: 'get'
      })
          .then(function (res) {
            that.list = res.data.data.records;
            that.loading = false
            that.last_page = Math.ceil(res.data.data.total / 10)
            that.current_page = res.data.data.current
          })
          .catch(function (error) {
          })
    },
    removeLink(id) {
      axios({
        method: 'delete',
        url: '/apis/link/delete/' + id
      }).then(res => {

        if (res.data.success === true) {
          this.$message.success("删除成功");
          this.getLinkList();
        } else {
          this.$message.error("删除失败");
        }
      })
    },
    addLink() {
      axios({
        method: 'post',
        url: '/apis/link',
        data: {
          imgurl: this.form.imgurl,
          link: this.form.link,
          name: this.form.name,
          info: this.form.info
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.update = true;
        if (res.data.success === true) {
          this.$message.success("添加成功");
          this.getLinkList();
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
    this.getLinkList()
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