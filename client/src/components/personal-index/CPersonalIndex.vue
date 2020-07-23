<template>
<div class="container">
    <div v-if="isAnonymous">
        <div class="text-center mt-5">
            你与我只差一个『<a href="#" data-toggle="modal" data-target="#id-modal-signin">登录</a>』的距离
        </div>
        <CSignin id="id-modal-signin"/>
    </div>
    <div v-else>
        <CImgCarousel :imgs="userCoverImgs" uploadurl="/api/gallery/create?belong=user" placeholder="img/img-upload-128x128.png" :createGalleryTitle="createGalleryTitle"/>
    </div>
</div>
</template>

<script>
import CSignin from '../authenticate/CSignin'
import CImgCarousel from '../base/carousel/CImgCarousel'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
    name: 'CPersonalIndex',
    components: { CImgCarousel, CSignin },
    data () {
        return {
            createGalleryTitle: `创建相册到『${this.$store.state.user.userClient.nickname}』`
        }
    },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient,
            selectedUserId: state => state.selectedUserId
        }),
        ...mapGetters('user', [
            'isAnonymous', 'userCoverImgs'
        ])
    },
    methods: {
        ...mapActions('user', [
            'updateUserGalleries'
        ]),
        updateGalleries() {
            this.updateUserGalleries(this.selectedUserId)
        }
    },
    created () {
        this.updateGalleries()
        this.$root.$on('function-reenter', () => {
            this.updateGalleries()
        })
    },
    beforeDestroy() {
        this.$root.$off('function-reenter')
    }
}
</script>

<style>

</style>
