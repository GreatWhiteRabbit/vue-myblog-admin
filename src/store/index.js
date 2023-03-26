import Vue from 'vue'
import Vuex from 'vuex'
import admin from './modules/admin'
import articles from './modules/articles'
import createPersiste from 'vue-savedata'
Vue.use(Vuex)
const persiste = createPersiste({
    ciphertext: true, // 加密存本地, 默认为false
    LS: {
        module: admin,
        storePath: 'admin' // __storePath:(和Vuex中的option.modules:{key：value}的key,一,一对应)__
    }

})

const store = new Vuex.Store({
    modules: {
        admin,
        articles
    },
    plugins: [persiste],
})
export default store