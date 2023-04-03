<template>
  <el-container class="content" :class="{'is-left':!isMenu,'is-margin':isMenu}">
    <!-- <el-scrollbar style="height: 100%;"> -->
    <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isMenu"
      style="overflow-y: auto;
    overflow-x: hidden;"
    >
      <el-menu-item index="-1" class="logo" style="padding:0px;text-align:center;">
        <i v-if="isMenu">LOGO</i>
        <span slot="title">
          <img src="~@/assets/logo.svg" height="40" />
        </span>
      </el-menu-item>

      <el-submenu v-for="item of homeList" :key="item.id" :index="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <router-link tag="span" v-for="value of item.children" :key="value.id" :to="value.url">
          <el-menu-item :index="value.id">
            <span :class="{active:$route.path===value.url}">
              <i :class="value.icon"></i>
              {{value.name}}
            </span>
          </el-menu-item>
        </router-link>
      </el-submenu>
    </el-menu>
    <el-container>
      <el-header class="header">
        <div class="menu" :class="{change:!isMenu}" @click="toggleMenu">
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
        <div class="admin">
          <el-popover placement="bottom" width="50" trigger="hover">
            <ul class="admin-ul">
              <router-link
                tag="li"
                to="/home/user/info"
                :class="{active:$route.path==='/home/user/info'}"
              >个人信息</router-link>
              <li @click="logOut">退出</li>
            </ul>

            <el-avatar slot="reference" shape="square" :size="40" fit="cover" :src="avatar_img"></el-avatar>
          </el-popover>
        </div>
      </el-header>

      <el-container>
        <el-main style="padding-top:65px">
          <router-view></router-view>
        </el-main>
        <el-footer style="color:#fff;font-size: 14px;text-align:center">
            <p>Copyright © 2023 -
           {{getCurrentYear}}
           大白兔 All Rights Reserved.</p>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import axios from "axios";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      isCollapse: false,
      isMenu: false,
      homeList: [
        {
          id: "1",
          name: "文章管理",
          icon: "el-icon-document",
          children: [
            {
              id: "1-1",
              icon: "el-icon-edit-outline",
              name: "发表文章",
              url: "/home/articles/add",
            },
            {
              id: "1-2",
              icon: "el-icon-tickets",
              name: "文章列表",
              url: "/home/articles/list",
            },
            {
              id: "1-3",
              icon: "el-icon-tickets",
              name: "修改文章",
              url: "/home/articles/update",
            },
          ],
        },
        {
          id: "2",
          name: "用户管理",
          icon: "el-icon-user",
          children: [
            {
              id: "2-1",
              icon: "el-icon-edit-outline",
              name: "用户列表",
              url: "/home/user/list",
            },
            {
              id: "2-2",
              icon: "el-icon-edit-outline",
              name: "验证码发送",
              url: "/home/user/code",
            },
          ],
        },
        {
          id: "3",
          name: "友情链接",
          icon: "el-icon-link",
          children: [
            {
              id: "3-1",
              icon: "el-icon-edit-outline",
              name: "友链列表",
              url: "/home/link/list",
            },
          ],
        },
        {
          id: "4",
          name: "随笔",
          icon: "el-icon-location-outline",
          children: [
            {
              id: "4-1",
              icon: "el-icon-edit-outline",
              name: "随笔列表",
              url: "/home/essay/essayList",
            },
            {
              id: "4-2",
              icon: "el-icon-edit-outline",
              name: "项目列表",
              url: "/home/essay/project",
            },
          ],
        },
        {
          id: "5",
          name: "留言管理",
          icon: "el-icon-chat-dot-round",
          children: [
            {
              id: "5-1",
              icon: "el-icon-edit-outline",
              name: "留言区留言列表",
              url: "/home/message/list",
            },
            {
              id: "5-2",
              icon: "el-icon-edit-outline",
              name: "博客留言列表(点击博客列表查看)",
              url: "/home/message/blog",
            },
            {
              id: "5-3",
              icon: "el-icon-edit-outline",
              name: "最新留言列表",
              url: "/home/message/new",
            },
            {
              id: "5-4",
              icon: "el-icon-edit-outline",
              name: "被删除留言列表",
              url: "/home/message/delete",
            },
            {
              id: "5-5",
              icon: "el-icon-edit-outline",
              name: "网站建议",
              url: "/home/message/suggestion",
            },
          ],
        },
        {
          id: "6",
          name: "网站管理",
          icon: "el-icon-setting",
          children: [
            {
              id: "6-1",
              icon: "el-icon-edit-outline",
              name: "网站公告",
              url: "/home/web/list",
            },
            {
              id: "6-2",
              icon: "el-icon-edit-outline",
              name: "主页轮播",
              url: "/home/web/home",
            },
            {
              id: "6-3",
              icon: "el-icon-edit-outline",
              name: "更新日志",
              url: "/home/web/updateLog",
            },

          ],
        },
        {
          id: "7",
          name: "系统设置",
          icon: "el-icon-setting",
          children: [
            {
              id: "7-1",
              icon: "el-icon-edit-outline",
              name: "Redis管理",
              url: "/home/system/redis",
            },
            {
              id: "7-2",
              icon: "el-icon-edit-outline",
              name: "网站访问统计情况",
              url: "/home/system/echarts",
            },
            {
              id: "7-3",
              icon: "el-icon-edit-outline",
              name: "访问者详细信息",
              url: "/home/system/surfData",
            },

          ],
        },
      ],
      avatar_img:"",
    };
  },

  methods: {
    toggleMenu() {
      this.isMenu = !this.isMenu;
    },
    // 退出
    logOut() {
      this.$store.commit('newLogOut');
      sessionStorage.clear();
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getAvatarImg(){
      let that=this
      that.loading=true
      axios({
        url:"/apis/userInfo/get",
        method:'get',
        params:{
          user_id: sessionStorage.getItem("user_id")
        }
      }).then(function(res){
            that.avatar_img = "/apis" + "/blog/static/img/" + res.data.data.user_image;

            sessionStorage.setItem("avatar_img",res.data.data.user_image);
          })

    },
  },
  created() {
    if(sessionStorage.getItem("user_id") === null) {
      this.$router.push("/login");
    }else {
      this.getAvatarImg();
    }
  },
  mounted() {},
  computed:{
    getCurrentYear() {
      var date = new Date();
      return date.getFullYear();
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/style/home.styl';

.logo >>> .el-tooltip {
  padding: 0px !important;
}
>>>.v-note-wrapper.fullscreen{
    z-index: 1700!important;
  }

.active {
  acitve();
}
</style>
<style  scoped>
.admin {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 30px;
  top: 10px;
}
.admin-ul li {
  height: 35px;
  text-align: center;
  line-height: 35px;
  transition: all 0.3s;
}
.admin-ul li:hover {
  cursor: pointer;
  color: #21d4fd;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.menu {
  cursor: pointer;
  width: 25px;
  height: 25px;
  margin: 17.5px 0;
  margin-left: 64px;
  transition: all 0.4s;
}
.content {
  margin: 0;
  transition: all 0.4s;
  margin-left:64px
}

.bar1,
.bar2,
.bar3 {
  width: 25px;
  height: 4px;
  background-color: #fff;
  margin: 4px 0;
  transition: 0.4s;
}

.change .bar1 {
  transform: rotate(45deg) translate(4px, 7.2px);
}

.change .bar2 {
  opacity: 0;
}

.change .bar3 {
  transform: rotate(-45deg) translate(4px, -7.2px);
}
 .el-menu-vertical-demo {
    position: fixed;
    top: 0px;
    left: 0;
    bottom: 0;
    z-index: 1600;
  }
  .el-header{
    position: fixed;
    top: 0;
    left: 0;
    z-index:1550;
    width:100%
  }
  .is-left {
    transition: all 0.4s;
    margin-left: 200px;
  }
  .is-left .menu{
    margin-left: 200px;
  }
  
@media (max-width: 768px) {
  .el-menu--collapse {
    width: 0px !important;
    overflow: hidden;
  }
  /* .content{
  } */
  .is-margin {
    transition: all 0.4s;
    margin-left:0px!important
  }
  .menu{
    margin-left: 0;
    transition: all 0.4s;
  }
}
</style>
