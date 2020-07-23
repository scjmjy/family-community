<template>
  <main id="id-index" class="h-100">
    <CHeader :title="userClient.family.name"/>
    <div class="container-fluid mx-0 h-100">
        <div class="row h-100">
            <CLeftMenu ref="leftMenu" :channels="userClient.channels" @EventClickFunction="handleClickFunction"/>
            <CRightPage :compoName="rightPageCompoName" :bgurl="rightPageBgurl" @click.native="hideMenu"/>
        </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import CHeader from '../components/CHeader'
import CLeftMenu from '../components/CLeftMenu'
import CRightPage from '../components/CRightPage'

// const leftmenuOptions = {
//     channels: [
//         { name: '家庭', id: '', imgurl: 'img/home-48x48.png', functions: [{ name: '家庭首页', imgurl: 'img/home-48x48.png', compoName: 'CFamilyIndex', bgurl: 'img/overlay.png' }, { name: '群聊', imgurl: 'img/chat-48x48.png', compoName: 'CChat', bgurl: 'img/overlay-wood.png' }, { name: '动态', imgurl: 'img/moments-2-48x48.png', compoName: 'CMoments', bgurl: 'img/overlay-pink-dot.png' }, { name: '相册', imgurl: 'img/photos-2-48x48.png', compoName: 'CPhotos', bgurl: 'img/overlay-leaves.png' }] },
//         { name: '老爸', id: '', imgurl: 'img/avatar-dad-48X48.png', functions: [{ name: '个人首页', imgurl: 'img/avatar-dad-48X48.png', compoName: 'CPersonalIndex', bgurl: 'img/img/overlay.png' }, { name: '私聊', imgurl: 'img/chat-48x48.png', compoName: 'CChat', bgurl: 'img/overlay-wood.png' }, { name: '动态', imgurl: 'img/moments-2-48x48.png', compoName: 'CMoments', bgurl: 'img/overlay-pink-dot.png' }, { name: '相册', imgurl: 'img/photos-2-48x48.png', compoName: 'CPhotos', bgurl: 'img/overlay-leaves.png' }] },
//         { name: '老妈', id: '', imgurl: 'img/avatar-mom-48X48.png', functions: [{ name: '个人首页', imgurl: 'img/avatar-mom-48X48.png', compoName: 'CPersonalIndex', bgurl: 'img/img/overlay.png' }, { name: '私聊', imgurl: 'img/chat-48x48.png', compoName: 'CChat', bgurl: 'img/overlay-wood.png' }, { name: '动态', imgurl: 'img/moments-2-48x48.png', compoName: 'CMoments', bgurl: 'img/overlay-pink-dot.png' }, { name: '相册', imgurl: 'img/photos-2-48x48.png', compoName: 'CPhotos', bgurl: 'img/overlay-leaves.png' }] },
//         { name: '小明', id: '', imgurl: 'img/avatar-brother-48X48.png', functions: [{ name: '个人首页', imgurl: 'img/avatar-brother-48x48.png', compoName: 'CPersonalIndex', bgurl: 'img/img/overlay.png' }, { name: '私聊', imgurl: 'img/chat-48x48.png', compoName: 'CChat', bgurl: 'img/overlay-wood.png' }, { name: '动态', imgurl: 'img/moments-2-48x48.png', compoName: 'CMoments', bgurl: 'img/overlay-pink-dot.png' }, { name: '相册', imgurl: 'img/photos-2-48x48.png', compoName: 'CPhotos', bgurl: 'img/overlay-leaves.png' }] },
//         { name: '小红', id: '', imgurl: 'img/avatar-sister-48X48.png', functions: [{ name: '个人首页', imgurl: 'img/avatar-sister-48x48.png', compoName: 'CPersonalIndex', bgurl: 'img/img/overlay.png' }, { name: '私聊', imgurl: 'img/chat-48x48.png', compoName: 'CChat', bgurl: 'img/overlay-wood.png' }, { name: '动态', imgurl: 'img/moments-2-48x48.png', compoName: 'CMoments', bgurl: 'img/overlay-pink-dot.png' }, { name: '相册', imgurl: 'img/photos-2-48x48.png', compoName: 'CPhotos', bgurl: 'img/overlay-leaves.png' }] }
//     ]
// }

export default {
    name: 'VFamily',
    data () {
        return {
            rightPageCompoName: '',
            rightPageBgurl: '',
            toggleMenu: true
        }
    },
    components: { CHeader, CLeftMenu, CRightPage },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient
        })
    },
    methods: {
        ...mapActions('user', [
            'initUserClient'
        ]),
        handleClickFunction (compoName, bgurl) {
            if (this.rightPageCompoName === compoName) {
                this.$root.$emit('function-reenter', compoName)
            }
            this.rightPageCompoName = compoName
            this.rightPageBgurl = bgurl
        },
        hideMenu() {
            this.$refs.leftMenu.hideLeftMenu()
        }
    },
    created () {
        this.initUserClient()
    }
}
</script>

<style>

</style>
