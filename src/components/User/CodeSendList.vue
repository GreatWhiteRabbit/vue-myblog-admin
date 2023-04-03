<template>
  <div v-loading="loading">
    <div style="display: flex">
      <el-button @click="queryInfo" type="primary">查询</el-button>
      <el-input v-model="ip" placeholder="请输入IP" style="width: 40%"></el-input>
    </div>
    <el-table v-if="list" :data="list" style="width: 100%">
      <el-table-column label="ID">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="IP">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateChange(scope.row.surf_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="允许IP发送验证码"
      >
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.allowed"
              :active-value = 1
              :inactive-value = 0
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

  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "CodeSendList",
  data() {
    return {
      list: [],
      current_page: 1,
      loading: true,
      last_page: 1,
      ip:''
    };
  },
  methods: {

    queryInfo() {
      if(this.ip !== "") {
        axios({
          method:'get',
          url:'/apis/email_code/getIp',
          params:{
            ip:this.ip
          }
        }).then(res => {
          this.list = res.data.data;
        })
      }
    },

    setDelete(index) {
      let ip = this.list[index].ip;
      let allowed = this.list[index].allowed;
    /*  if(this.list[index].allowed === true) allowed = 1;
      else  allowed = 0;*/
      axios({
        method: "post",
        url: '/apis/email_code/' + ip + '/' + allowed
      }).then(res => {
        this.getList();
        if (res.data.data === true) {
          this.$notify({
            type:'success',
            title:'禁用操作',
            message:"禁用成功"
          })
        } else {
          this.$notify({
            type:'error',
            title:'禁用操作',
            message:"禁用成功"
          })
        }
      })
    },
    change(page) {
      this.current_page = page;
      this.getList();
    },
    getList() {
      let that = this;
      that.loading = false;
      axios({
        method: 'get',
        url: '/apis/email_code/getAll',
        params:{
          page:this.current_page,
          size:10
        }
      }).then(res => {
        that.loading = false;
        that.list = res.data.data.records;
        that.last_page = Math.ceil(res.data.data.total / 10);
      })
    },
    removeInfo(index) {
      let id = this.list[index].id;
      axios({
        method:'delete',
        url:'/apis/email_code/' + id
      }).then(res => {
        if (res.data.data === true) {
          this.$notify({
            type:'success',
            title:'删除操作',
            message:"删除成功"
          })
          this.getList();
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
    this.getList();
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
  }
};
</script>
<style lang="stylus" scoped></style>