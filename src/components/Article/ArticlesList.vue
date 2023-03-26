<template>
    <div v-loading="loading">
        <el-table v-if="list"
            :data="list"
            style="width: 100%">
            <el-table-column
            label="ID"
           >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.blog_id }}</span>
            </template>
            </el-table-column>

             <el-table-column
            label="分类"
            >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.category_name}}</span>
            </template>
            </el-table-column>

             <el-table-column
            label="标题"
            >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.blog_title }}</span>
            </template>
            </el-table-column>
             <el-table-column
            label="标签"
            >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.label_name }}</span>
              </template>
            </el-table-column>

             <el-table-column
            label="浏览量"
           >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.blog_browse }}</span>
            </template>
            </el-table-column>

             <el-table-column
            label="点赞量"
            >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.blog_likes }}</span>
            </template>
            </el-table-column>

             <el-table-column
            label="创建日期"
            >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{timeChange(scope.row.blog_date )}}</span>
            </template>
            </el-table-column>

             <el-table-column
            label="是否首页显示"
           >
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.blog_show"
                    :active-value=true
                    :inactive-value=false
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="setDelete(scope.row.blog_id,scope.$index)">
                </el-switch>
            </template>
            </el-table-column>
            <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.row.blog_id)">修改</el-button>
            </template>
            </el-table-column>
          <el-table-column label="查看留言">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="searchMessage(scope.row.blog_id)">查看</el-button>
            </template>
          </el-table-column>

          <el-table-column label="删除">
            <template slot-scope="scope">
              <el-button
                  type="primary"
                  size="large"
                  @click="removeArticle(scope.$index)">删除
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
    name:'ArticleList',
    data(){
        return {
            list:[],
            loading:true,
            page:1,
            pageSize:10,
            size:10,
            currentPage:1,
            total:1,
            show:false
        }
    },
    methods: {
      handleCurrentChange(page) {
        this.currentPage = page;
      },
      handleSizeChange(size) {
        this.pageSize = size;
      },
        setDelete(blog_id,index){

           axios({
             method:'put',
             url:'/apis/blog/updateShow/' + blog_id + "/" + this.list[index].blog_show
           }).then(res => {
             if(res.data.success === true) {
               this.$message.success("主页修改成功");
             } else {
               this.$message.error("主页修改失败");
             }
           })
            
        },
      removeArticle(index) {
        var that = this;
        axios({
          method:'delete',
          url:'/apis/blog/deleteBlog',
          params:{
            blog_id: this.list[index].blog_id,
            category_id: this.list[index].category_id,
            label_id: this.list[index].label_id,
          }
        }).then(res =>{
          if(res.data.data === true) {
            that.$message.success("删除成功");
            that.getArticleList();
          }
        })
      },
        handleEdit(id){
        sessionStorage.setItem("blog_id",id);
        sessionStorage.setItem("isShowUpdatePage","true");
          this.$router.push(
              { path: '/home/articles/update',
            });
        },
        getArticleList(){
            let that=this
            that.loading=true
            axios({
              url:"/apis/blog/getBlog/" + this.currentPage + "/" + this.size,
              method:'get'
            })
            .then(function(res){
                that.list=res.data.data.records;
                if(that.list.length !== 0) {
                  that.show = true;
                }
               that.total = res.data.data.total;
                that.loading=false;

            })
        },
      // 查看博客下面的留言
      searchMessage(blog_id) {
        sessionStorage.setItem("blog_id",blog_id);
        this.$router.push('/home/message/blog');
      }
    },
    mounted(){
       this.getArticleList()
    },
  computed: {
      timeChange() {
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
  }
}
</script>
<style lang="stylus" scoped>

</style>