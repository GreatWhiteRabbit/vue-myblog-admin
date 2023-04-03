import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () =>
    import ('../views/Home.vue')
const Login = () =>
    import ('../views/Login.vue')
const AddArticle = () =>
    import('../components/Article/AddArticle')

const ArticlesList = () =>
    import ('../components/Article/ArticlesList.vue')
const UsersList = () =>
    import ('../components/User/UsersList.vue')
const LinkList = () =>
    import ('../components/Link/LinkList.vue')
const MessageList = () =>
    import ('../components/Message/MessageList.vue')
const UserInfo = () =>
    import ('../components/User/UserInfo.vue')
const HomeList = () =>
    import ('../components/Web/HomeList.vue')
const SysMessList = () =>
    import ('../components/Web/SysMessList.vue')
const UpdateArticle = () =>
    import('../components/Article/UpdateArticle')
const BlogMessageList = () =>
    import('../components/Message/BlogMessageList')
const GetNewMessageList = () =>
    import('../components/Message/GetNewMessageList')
const DeleteMessage = () =>
    import('../components/Message/DeleteMessage')
const RedisList = () =>
    import('../components/System/RedisList')
const MyEchart = () =>
    import('../components/System/MyEchart')
const TotalBrowse = () =>
    import('../components/System/TotalBrowse')
const EssayList = () =>
    import('../components/Essay/EssayList')
const ProjectList = () =>
    import('../components/Essay/ProjectList')
const GetSuggestion = () =>
    import('../components/Message/GetSuggestion')
const UpdateLogList =() =>
    import('../components/Web/UpdateLogList')
const CodeSendList = () =>
    import('../components/User/CodeSendList')
Vue.use(VueRouter)
const name = "后台系统"
const nav = {
    navNoQuiet: {
        boxShadow: ' 0px 10px 20px 4px  rgba(195,199, 199,0.4)',
        backgroundColor: '#fff',
        color: 'rgba(0,0,0,.5)'
    },
    navQuiet: {
        color: '#fff'
    }
}

const routes = [{
        path: '/',
        redirect: {
            name: 'Login'
        },
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta:{
            title: '首页-' + name,
            nav: nav
        },
        children: [
            {
                path: 'articles/add',
                component: AddArticle,
                meta:{
                    title: '添加文章-' + name,
                    nav: nav
                }
            },
            {
                path: 'articles/update',
                component: UpdateArticle,
                meta:{
                    title: '修改文章-' + name,
                    nav: nav
                }
            },

            {
                path: 'articles/list',
                component: ArticlesList,
                meta:{
                    title: '文章列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'user/list',
                component: UsersList,
                meta:{
                    title: '用户列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'user/code',
                component: CodeSendList,
                meta:{
                    title: '验证码发送-' + name,
                    nav: nav
                }
            },
            {
                path: 'link/list',
                component: LinkList,
                meta:{
                    title: '友链列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'message/list',
                component: MessageList,
                meta:{
                    title: '留言列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'message/blog',
                component: BlogMessageList,
                meta:{
                    title: '博客留言列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'message/new',
                component: GetNewMessageList,
                meta:{
                    title: '新留言列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'message/suggestion',
                component: GetSuggestion,
                meta:{
                    title: '建议列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'message/delete',
                component: DeleteMessage,
                meta:{
                    title: '被删除留言列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'user/info',
                component: UserInfo,
                meta:{
                    title: '用户基本信息-' + name,
                    nav: nav
                }
            },

            {
                path: 'web/home',
                component: HomeList,
                meta:{
                    title: '首页轮播列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'web/list',
                component: SysMessList,
                meta:{
                    title: '系统公告列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'web/updateLog',
                component: UpdateLogList,
                meta:{
                    title: '更新日志-' + name,
                    nav: nav
                }
            },
            {
                path: 'system/redis',
                component: RedisList,
                meta:{
                    title: 'redis缓存列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'system/echarts',
                component: MyEchart,
                meta:{
                    title: '网站访问统计-' + name,
                    nav: nav
                }
            },
            {
                path: 'system/surfData',
                component: TotalBrowse,
                meta:{
                    title: '网站访问信息-' + name,
                    nav: nav
                }
            },
            {
                path: 'essay/essayList',
                component: EssayList,
                meta:{
                    title: '随笔列表-' + name,
                    nav: nav
                }
            },
            {
                path: 'essay/project',
                component: ProjectList,
                meta:{
                    title: '项目列表-' + name,
                    nav: nav
                }
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta:{
            title: '登录-' + name,
            nav: nav
        }
    }
]

const router = new VueRouter({
     mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})

export default router