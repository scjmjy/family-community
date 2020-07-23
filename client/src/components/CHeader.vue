<template>
<nav id="id-nav-header" class="navbar fixed-top navbar-dark bg-dark">
    <button class="navbar-toggler" data-toggle="offcanvas" data-target="#id-nav-left-menu">
        <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand mr-0">{{ title }}</a>
    <div class="dropdown">
        <a href="#" class="nav-link text-center text-white dropdown-toggle" role="button" data-toggle="dropdown">更多</a>
        <div class="dropdown-menu dropdown-menu-right" style="min-width: auto" aria-labelledby="dropdownMenuLink">
            <button class="dropdown-item btn btn-link" @click="NotImplemented"><i class="fa fa-globe mr-2"></i>出门逛逛</button>
            <button class="dropdown-item btn btn-link" @click="NotImplemented"><i class="fa fa-th mr-1"></i>应用市场</button>
            <button class="dropdown-item btn btn-link" :disabled="isAnonymous === true ? true : false" @click="signOut"><i class="fa fa-sign-out mr-2"></i>退出</button>
            <button class="dropdown-item btn btn-link" @click="NotImplemented"><i class="fa fa-cog mr-2"></i>设置</button>
        </div>
    </div>
</nav>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'CHeader',
    props: ['title'],
    computed: {
        ...mapGetters('user', [
            'isAnonymous'
        ])
    },
    methods: {
        signOut () {
            axios.get('/api/user/signout')
                .then(({ data }) => {
                    this.$root.$emit('toast', '成功退出')
                    this.clearUserClient()
                })
                .catch(err => {
                    this.clearUserClient()
                    console.log(err.message)
                    // this.$root.$emit('toast', `退出失败：${err.message}`)
                })
        },
        ...mapMutations('user', [
            'clearUserClient'
        ]),
        NotImplemented() {
            this.$root.$emit('toast', '此功能尚未实现，敬请期待')
        }
    }
}
</script>

<style>
#id-nav-header {
    z-index: 1040;
}
</style>
