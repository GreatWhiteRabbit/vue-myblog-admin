<template>
  <div v-loading="loading">
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
          label="回复内容"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.reply_content }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="用户ID"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.reply_user }}</span>
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
          label="被回复用户昵称"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.second_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="回复时间"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{dateChange(scope.row.reply_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="博客ID"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.blog_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="removeMessage(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="恢复">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="rollBack(scope.$index)">恢复</el-button>
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
  </div>
</template>
<script>
import axios from "axios";

export default {
  name:'DeleteMessage',
  data(){
    return {
      list:[],
      page:1,
      current_page:1,
      loading:true,
      last_page:1,
      title:'回复评论',
      dialogFormVisible:false,
      dialogReplyVisible:false,
      formLabelWidth: '120px'
    }
  },
  methods: {

    // 换页
    change(page){
      this.current_page=page
      this.getList()
    },
    getList(){
      let that=this
      that.loading=true
      axios({
        method:'get',
        url:'/apis/deleteReply/getAll/' + this.current_page + '/' + 10
      })
          .then(function(res){
            console.log(res.data);
            that.list=res.data.data.records
            that.loading=false
            that.last_page=Math.ceil(res.data.data.total / 10 );
          })

    },
    removeMessage(index) {
      axios({
        method: 'delete',
        url: '/apis/deleteReply/' + this.list[index].id
      }).then(res => {
        if (res.data.data === true) {
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
    },
    rollBack(index) {
      // 暂时不想实现这个功能
      this.$message.success("暂时不想实现这个功能   "  + "恢复成功下标为"  + index);
      console.log("恢复成功")
    }

  },
  created(){
    this.getList()
  },
  computed:{
    dateChange() {
      return (time) => {
        var date = new Date(time);
        let  Y = date.getFullYear() + '-';
        let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let  D = date.getDate() + ' ';
        let  h = date.getHours() + ':';
        let  m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s
      }
    }
  },
}
</script>
<style lang="stylus" scoped>

</style>