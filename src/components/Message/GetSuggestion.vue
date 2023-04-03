<template>
  <div v-loading="loading">
    <el-table v-if="list"
              :data="list"
              style="width: 100%">
      <el-table-column
          label="序号"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index+1}}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="建议内容"
      >

        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row }}</span>
        </template>

      </el-table-column>

      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="large"
              @click="deleteSuggestion(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GetSuggestion",
  data(){
    return {
      list:[],
      loading:true,
    }
  },
  methods:{
    // 获取所有的网友的建议
    getSuggestion(){
      axios({
        method:'get',
        url:'/apis/suggestion/getAll'
      }).then(res => {
        this.list = res.data.data;
        this.loading = false;
      })
    },
    // 删除建议
    deleteSuggestion(index) {
      axios({
        method:'delete',
        url:'/apis/suggestion/' + this.list[index]
      }).then(res => {
        this.$message.success("删除成功");
        this.getSuggestion();
      })
    }
  },
  created() {
    this.getSuggestion();
  }
}
</script>

<style lang="stylus" scoped>

</style>