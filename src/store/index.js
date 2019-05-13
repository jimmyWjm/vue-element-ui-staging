import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from './modules/Application.js';


const store = new vuex.Store({
    modules: {
        app: app
    }
})

export default store