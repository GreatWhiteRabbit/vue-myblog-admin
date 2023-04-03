<template>
  <div v-loading="loading">
    <el-button @click="addRoute">添加</el-button>
    <el-table v-if="list" :data="list" style="width: 100%">
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新说明">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.update_info }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateChange(scope.row.update_time) }}</span>
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
        <el-form-item label="更新内容说明" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.update_info"
              autocomplete="off"
              placeholder="请输入更新内容说明"
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
  /*
  * 更新日志
  * */
  name: "UpdateLogList",
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
        update_info: "",
        id: '',
        update_time:''
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    handleEdit(index) {
      this.form.id = this.list[index].id;
      this.form.update_info = this.list[index].update_info;
      this.form.update_time = this.list[index].update_time;
      this.update = true;
      this.title = "修改更新内容";
      this.dialogFormVisible = true;
    },
    addRoute() {
      this.$data.form = this.$options.data().form;
      this.title = "添加更新内容";
      this.update = false;
      this.dialogFormVisible = true;
    },
    // 公共方法，添加和修改公用
    updateInfo() {
      axios({
        method: 'put',
        url: '/apis/updateLog',
        data: {
          id: this.form.id,
          update_info: this.form.update_info,
          update_time: this.form.update_time
        }
      }).then(res => {
        this.dialogFormVisible = false;
        if (res.data.data === true) {
          this.$notify({
            type:'success',
            title:'修改操作',
            message:'修改成功'
          })
          this.getUpdateLogList();
        } else {
          this.$notify({
            type:'error',
            title:'修改操作',
            message:'修改失败'
          });
        }
      })
    },
    addInfo() {
      axios({
        method: 'post',
        url: '/apis/updateLog',
        data: {
         update_info:this.form.update_info
        }
      }).then(res => {
        this.dialogFormVisible = false;
        this.update = true;
        if (res.data.data === true) {
          this.$notify({
            type:'success',
            title:'添加操作',
            message:"添加成功"
          });
          this.getUpdateLogList();
        } else {
          this.$notify({
            type:'error',
            title:"添加操作",
            message:'添加失败'
          })
        }
      })
    },

    change(page) {
      this.current_page = page;
      this.getUpdateLogList();
    },
    getUpdateLogList() {
      let that = this;
      that.loading = false;
      axios({
        method: 'get',
        url: '/apis/updateLog/getAll',
        params:{
      page:this.current_page,
          size:10
        }
      }).then(res => {
        that.loading = false;
        that.list = res.data.data.updateLogList;
        that.last_page = Math.ceil(res.data.data.total / 10);
      })
          .catch(function (error) {
          });
    },
    removeInfo(index) {
      let id = this.list[index].id;
      axios({
        method:'delete',
        url:'/apis/updateLog/' + id
      }).then(res => {
        this.getUpdateLogList();
        if (res.data.data === true) {
          this.$notify({
            type:'success',
            title:'删除操作',
            message:'删除成功'
          })
        } else {
          this.$notify({
            type:'error',
            title:'删除操作',
            message:'删除失败'
          })
        }
      })
    }
  },
  mounted() {
    this.getUpdateLogList();
  },
  computed: {
    dateChange() {
      return (time) => {
        var date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        return Y + M + D;
      }
    },
  }
};
</script>
<style lang="stylus" scoped></style>