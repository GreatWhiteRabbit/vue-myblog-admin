<template>
  <div v-loading="loading">
    <el-table v-if="list"
              :data="list"
              style="width: 100%">
      <el-table-column
          label="键值"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.key }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="value的大小"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ memoryChange(scope.row.value) }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="剩余过期时间"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ leftExpireTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="key的类型"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.type }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              @click="update(scope.$index)">修改过期时间
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeKey(scope.$index)">删除
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
    <el-dialog title="修改过期时间" :visible.sync="formShow">
      <el-form :model="form">
        <el-form-item label="新的过期时间">
          <el-input v-model="newExpireTime" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formShow = false">取 消</el-button>
        <el-button type="primary" @click="updateExpire ">确 定</el-button>

      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";


export default {
  name: 'RedisList',
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
      this.getRedisList();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getRedisList();
    },
    getRedisList() {
      let that = this
      that.loading = true
      axios({
        url: "/apis/redis/getAll/",
        method: 'get',
        params: {
          page: that.currentPage,
          size: that.pageSize
        }
      })
          .then(function (res) {
            that.show = true;
            that.list = res.data.data.analyzeList;
            that.total = res.data.data.total;
            that.loading = false;
          })
    },
    removeKey(index) {
      axios({
        method: 'get',
        url: '/apis/redis/delete',
        params: {
          key: this.list[index].key
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
    update(index) {
      this.currentIndex = index;
      this.formShow = true;
    },
    updateExpire() {
      axios({
        method: "get",
        url: '/apis/redis/updateExpire',
        params: {
          key: this.list[this.currentIndex].key,
          expireTime: this.newExpireTime
        }
      }).then(res => {
        if(res.data.data === true) {
          this.$message.success("修改成功");
          this.getRedisList();
        } else {
          this.$message.error("修改失败");
        }
        this.formShow = false;
      }).catch(err => {
        this.$message.warning("服务器异常");
      })
    }

  },
  mounted() {
    this.getRedisList()
  },
  computed: {
    memoryChange() {
      return (value) => {
        if (value < 1000) {
          return value + "  B"
        } else {
          return value / 1000 + '  K'
        }
      }
    },
    leftExpireTime() {
      return (time) => {
        if(time === -1) return "不过期";
        else return time + "天";
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>