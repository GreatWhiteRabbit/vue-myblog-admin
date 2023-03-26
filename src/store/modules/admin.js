import http from '@/utils/httpmanager.js'
const admin = {
    state: {
        admin: '',
        token: sessionStorage.getItem('user_id') || '',
        blog_id:''
    },
    mutations: {

        //下面是我写的
        newSetToken(state,data) {
            state.token = data;
        },
        newLogOut(state) {
            state.token = '';
            state.admin = '';
        },
        setBlogId(state,data) {
            state.blog_id = data;
        }
    },
    actions: {
        // setToken({ commit }, data) {
        //     commit('setToken', data)
        // },
        // async userInfo({ commit }) {
        //     const res = await http.get('/apis/userInfo/get')
        //     commit('userInfo', res.data)
        // },
        // logOut({ commit }) {
        //     commit('logOut')
        // }
    }
}
export default admin