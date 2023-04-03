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
          <span style="margin-left: 10px">{{ scope.row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="用户名"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="email"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.user_email }}</span>
        </template>
      </el-table-column>


      <el-table-column
          label="创建日期"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateChange(scope.row.user_creattime) }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="权限"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ changeStatus(scope.row.user_status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="remove(scope.row.user_id)">删除
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
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户昵称" :label-width="formLabelWidth">
          <el-input v-model="form.user_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.user_email" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="" @click="insert">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'UsersList',
  data() {
    return {
      list: [],
      loading: true,
      page: 1,
      current_page: 1,
      last_page: 1,
      dialogFormVisible: false,

      form: {
        user_name: '',
        user_email: '',
      },
      formLabelWidth: '120px',
    }
  },
  methods: {
    add() {
      this.dialogFormVisible = true
    },
    change(page) {
      this.current_page = page
      this.getArticleList()
    },
    getUserList() {
      let that = this
      that.loading = true
      axios({
        method: 'get',
        url: '/apis/users/admin/getAll/' + this.current_page + '/' + 10
      })
          .then(function (res) {
            that.list = res.data.data.records;
            that.loading = false
            that.last_page = Math.ceil(res.data.data.total/10)
            that.current_page = res.data.data.current
          })
          .catch(function (error) {
          })
    },
    insert() {
      axios({
        method: 'post',
        url: '/apis/users/admin/add',
        data: {
          user_name: this.form.user_name,
          user_email: this.form.user_email
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.getUserList();
      })
    },
    remove(user_id) {
      axios({
        method: "delete",
        url: "/apis/users/admin/" + user_id
      }).then(res => {
        if (res.data.data === true) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      })
    }

  },
  created() {
    this.getUserList()
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
    changeStatus() {
      return (user_status) => {
        if (user_status === 1) return "访客";
        else if (user_status === 3) return "管理员";
        else return "普通用户";
      }
    }
  }

}
</script>
<style lang="stylus" scoped>

</style>