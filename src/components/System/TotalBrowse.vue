<template>
  <div v-loading="loading">
    <el-table v-if="list"
              :data="list"
              style="width: 100%">
      <el-table-column
          label="序号"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.surf_id }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="IP地址"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="访问时间"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ dateChange(scope.row.surf_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作系统"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.device_system }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="浏览器"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.browsername }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="IP所属省份"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.province }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="IP所在城市"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="设备"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.device }}</span>
        </template>
      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeData(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination v-show="show"
                   background
                   layout="sizes, prev, pager, next"
                   :page-size="pageSize"
                   :current-page.sync="currentPage"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :page-sizes="[10, 15, 20]"
                   :total="total"
                   style="display: flex;justify-content: center;margin-bottom:10px"
    >
    </el-pagination>

  </div>
</template>
<script>
import axios from "axios";


export default {
  name: 'TotalBrowse',
  data() {
    return {
      list: [],
      loading: true,
      page: 1,
      pageSize: 10,
      size: 10,
      currentPage: 1,
      total: 1,
      show: false,
      newExpireTime: 0,
      formShow: false,
      form: '',
      currentIndex:''
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getBrowseSurfDataList();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getBrowseSurfDataList();
    },
    getBrowseSurfDataList() {
      let that = this
      that.loading = true
      axios({
        url: "/apis/browse/baseInfo/",
        method: 'get',
        params: {
          page: that.currentPage,
          size: that.pageSize
        }
      })
          .then(function (res) {
            that.show = true;
            that.list = res.data.data.records;
            that.total = res.data.data.total;
            that.loading = false;
          })
    },
    removeData(index) {
      axios({
        method: 'get',
        url: '/apis/browse/delete',
        params: {
          surf_id: this.list[index].surf_id
        }
      }).then(res => {
        if (res.data.data === true) {
          this.$message.success("删除成功");
          this.getRedisList();
        } else {
          this.$message.success("删除失败");
        }
      }).catch(err => {
        this.$message.warning("服务器异常");
      })
    },



  },
  mounted() {
    this.getBrowseSurfDataList()
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
}
</script>
<style lang="stylus" scoped>

</style>