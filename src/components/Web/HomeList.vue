<template>
  <div>
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
          label="轮播背景"
      >
        <template slot-scope="scope">
          <el-image
              style="width: 50px; height: 50px"
              :src="changeImgUrl(scope.row.imgurl)"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column
          label="轮播标题"
      >
        <template slot-scope="scope">
          <el-link :href="scope.row.link" type="success">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>

      <el-table-column
          label="轮播介绍"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.info }}</span>
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
              v-model="scope.row.home_show"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setDelete(scope.$index)">
          </el-switch>
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
    <el-dialog title="添加轮播图片" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.info"
              autocomplete="off"></el-input>
        </el-form-item>

        <!--              添加图片-->
        <!--                  图片上传-->
        <el-form-item label="图片" class="avatar-img">
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
        <!--                  图片上传-->


        <el-form-item label="链接地址" :label-width="formLabelWidth">
          <el-input v-model="form.link" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="" @click="addImg">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'HomeList',
  data() {
    return {
      list: [],
      page: 1,
      current_page: 1,
      last_page: 1,
      dialogFormVisible: false,
      form: {
        title: '',
        link: '',
        imgurl: '',
        info: '',
      },
      formLabelWidth: '120px',
    }
  },
  methods: {
    add() {
      this.dialogFormVisible = true
    },
    // 是否首页显示
    setDelete(index) {
      let id = this.list[index].id;
      let home_show = this.list[index].home_show;
      axios({
        method: 'post',
        url: '/apis/home/' + id + '/' + home_show
      }).then(res => {
        if (res.data.data === true) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
      })

    },
    // 换页
    change(page) {
      this.current_page = page
      this.getArticleList()
    },
    getShowList() {
      axios({
        method: 'get',
        url: '/apis/home/' + this.current_page + '/' + 10
      }).then(res => {

        this.list = res.data.data.records;
        this.last_page = Math.ceil(res.data.data.total / 10);
      })
    },
    // 添加轮播图片
    addImg() {
      axios({
        method: 'post',
        url: '/apis/home',
        data: {
          title: this.form.title,
          info: this.form.info,
          imgurl: this.form.imgurl,
          link: this.form.link
        }
      }).then(res => {
        if (res.data.data === true) {
          this.$message.success("添加成功");
          this.getShowList();
          this.dialogFormVisible = false;
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
  mounted() {
    this.getShowList()
  },
  computed: {
    changeImgUrl() {
      return (url) => {
        return "/apis" + "/blog/static/img/" + url;
      }
    }
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