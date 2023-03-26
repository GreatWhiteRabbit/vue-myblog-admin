<template>
  <div v-loading="loading">
    <el-button @click="addRoute">添加</el-button>
    <el-table v-if="list" :data="list" style="width: 100%">
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="是否首页显示"
      >
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.sys_show"
              :active-value=true
              :inactive-value=false
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="setDelete(scope.$index)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeInfo(scope.$index)">删除
          </el-button>
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
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-if="list"
        background
        layout="prev, pager, next"
        :page-size="last_page"
        :page-count="last_page"
        :current-page="current_page"
        @current-change="change"
        style="display: flex;justify-content: center;margin-bottom:10px"
    ></el-pagination>

    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="公告标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.content"
              autocomplete="off"
              placeholder="请输入公告内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false; update = true">取 消</el-button>
        <el-button v-if="update" type="primary" @click="updateInfo ">确 定</el-button>
        <el-button v-if="!update" type="primary" @click="addInfo">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "SysMessList",
  data() {
    return {
      list: [],
      page: 1,
      current_page: 1,
      loading: true,
      last_page: 1,
      update: true, // 输入框是用作添加还是修改
      title: "",
      dialogFormVisible: false,
      form: {
        title: "",
        content: "",
        id: ''
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    handleEdit(index) {
      this.form.id = this.list[index].id;
      this.form.title = this.list[index].title;
      this.form.content = this.list[index].content;
      this.update = true;
      this.title = "修改公告";
      this.dialogFormVisible = true;
    },
    addRoute() {
      this.$data.form = this.$options.data().form;
      this.title = "添加公告";
      this.update = false;
      this.dialogFormVisible = true;
    },
    // 公共方法，添加和修改公用
    updateInfo() {
      axios({
        method: 'put',
        url: '/apis/system/update',
        data: {
          id: this.form.id,
          title: this.form.title,
          content: this.form.content
        }
      }).then(res => {
        this.dialogFormVisible = false;
        if (res.data.data === true) {
          this.$message.success("修改成功");
          this.getList();
        } else {
          this.$message.error("修改失败");
        }
      })
    },
    addInfo() {
      axios({
        method: 'post',
        url: '/apis/system',
        data: {
          title: this.form.title,
          content: this.form.content
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.update = true;
        if (res.data.data === true) {
          this.$message.success("添加成功");
          this.getList();
        } else {
          this.$message.error("添加失败");
        }
      })
    },
    setDelete(index) {
      let id = this.list[index].id;
      let sys_show = this.list[index].sys_show;
      axios({
        method: "post",
        url: '/apis/system/' + id + '/' + sys_show
      }).then(res => {
        if (res.data.data === true) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
      })
    },
    change(page) {
      this.page = page;
      this.getList();
    },
    getList() {
      let that = this;
      that.loading = true;
      axios({
        method: 'get',
        url: '/apis/system/get/' + this.current_page + '/' + 10
      }).then(function (res) {

        that.loading = false;
        that.list = res.data.data.records;
        that.last_page = Math.ceil(res.data.data.total / 10);
      })
          .catch(function (error) {
          });
    },
    removeInfo(index) {
      let id = this.list[index].id;
      axios({
        method:'delete',
      url:'/apis/system/' + id
      }).then(res => {
        if (res.data.data === true) {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.error("删除失败");
        }
      })
    }
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="stylus" scoped></style>