const articles = {
    state: {
        article: {},
        articles: {},
        checks: []
    },
    mutations: {
        setArticle(state, data) { //写入token
            const name = data.name
            state.articles[name] = data
                // state.articles.push(data)
        },
        article(state, data) {
            state.article = data
        },
        setCheck(state, data) {
            const checks = state.checks
            const index = checks.indexOf(data)
            if (index >= 0) {
                state.checks.splice(index, 1)
            } else {
                state.checks.push(data)
            }
        }
    },
    actions: {
        setArticle({ commit }, data) {
            commit('setArticle', data)
        },
        submit({ commit }, data) {
            commit('submit', data)
        }
    }
}
export default articles