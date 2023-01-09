const actions = {
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_ACCOUNT(state, account) {
    state.account = account
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_AUTH_LOADING(state, loading) {
    state.isAuthLoading = loading
  }
}

const state = () => ({
  user: null,
  account: null,
  token: null,
  isAuthLoading: true
})

const getters = {
}

export default {
  state,
  actions,
  mutations,
  getters,
}
