<template>
  <div v-loading="loading" v-show="showThisComponent">
    <el-table v-if="list"
              :data="list"
              style="width: 100%">
      <el-table-column
          label="ID"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.message.reply_id }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="回复内容"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.message.reply_content }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="用户ID"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.message.reply_user }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="用户昵称"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.message.first_name }}</span>
        </template>
      </el-table-column>


      <el-table-column
          label="回复时间"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateChange(scope.row.message.reply_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.$index)"
              icon="el-icon-edit"
              type="primary"
              circle
          ></el-button>
          <el-button
              v-if="scope.row.replyed"
              type="warning"
              icon="el-icon-message"
              size="mini"
              @click="replyList(scope.$index)"
              circle
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeMessage(scope.$index)">删除
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
    <!-- 添加评论对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="回复内容" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :rows="2"
              v-model="form.reply_content"
              autocomplete="off"
              placeholder="请输入回复内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReply ">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看评论对话框 -->
    <el-dialog title="评论查看" :visible.sync="dialogReplyVisible">
      <el-table v-if="list"
                :data="reply"
                height="350"
                style="width: 100%">
        <el-table-column
            label="ID"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.reply_id }}</span>
          </template>
        </el-table-column>

        <el-table-column
            label="评论内容"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.reply_content }}</span>
          </template>
        </el-table-column>

        <el-table-column
            label="用户昵称"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.first_name }}</span>
          </template>
        </el-table-column>

        <el-table-column
            label="回复昵称"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.second_name }}</span>
          </template>
        </el-table-column>

        <el-table-column
            label="评论日期"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ dateChange(scope.row.reply_time) }}</span>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'BlogMessageList',
  data() {
    return {
      list: [],
      page: 1,
      current_page: 1,
      loading: true,
      last_page: 1,
      title: '回复评论',
      dialogFormVisible: false,
      dialogReplyVisible: false,
      reply: [],
      form: {
        reply_user: '',
        response_user: '',
        first_name: '',
        second_name: '',
        reply_content: '',
        replyed_id: '',
        blog_id:''
      },
      formLabelWidth: '120px',
      blog_id :'',
      showThisComponent:false
    }
  },
  methods: {
    handleEdit(index) {
      this.form.replyed_id = this.list[index].message.reply_id;
      this.form.response_user = this.list[index].message.reply_user;
      this.form.second_name = this.list[index].message.first_name;
      this.form.reply_user = 1;
      this.form.first_name = "大白兔";
      this.form.blog_id = this.list[index].message.blog_id;
      this.dialogFormVisible = true
    },
    // 回复评论
    addReply() {
      let that = this
      that.$post('/apis/reply', that.form)
          .then(function (res) {
          })
          .catch(function (error) {
          })
      that.dialogFormVisible = false
      that.getList()
    },

    // 换页
    change(page) {
      this.current_page = page
      this.getList()
    },
    replyList(index) {
      this.reply = this.list[index].replyed;
      this.dialogReplyVisible = true
    },
    getList() {
      let that = this
      that.loading = true
      axios({
        method: 'get',
        url: "/apis/reply/getBlogReply",
        params: {
          blog_id: this.blog_id,
          page: this.current_page,
          size: 10
        }
      }).then(function (res) {
            that.list = res.data.data.replyList
            that.loading = false
            that.last_page = Math.ceil(res.data.data.total / 10)
          })

    },
    removeMessage(index) {
      console.log(index);
      axios({
        method: 'delete',
        url: '/apis/reply',
        data: {
          reply_id: this.list[index].message.reply_id,
          reply_content: this.list[index].message.reply_content,
          reply_user: this.list[index].message.reply_user,
          response_user: this.list[index].message.response_user,
          blog_id: this.list[index].message.blog_id,
          reply_time: this.list[index].message.reply_time,
          first_name: this.list[index].message.first_name,
          second_name: this.list[index].message.second_name,

        }
      }).then(res => {
        if (res.data.success === true) {
          this.getList();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message.error("删除失败");
        }
      })
    }

  },
  created() {
    this.blog_id = sessionStorage.getItem("blog_id");
    if(this.blog_id === undefined) {

    } else {
      this.getList();
      this.showThisComponent = true;
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
    }
  },
}
</script>
<style lang="stylus" scoped>

</style>