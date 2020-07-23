<template>
<div class="container">
    <div v-if="isAnonymous">
        <div class="text-center mt-5">
            你与我只差一个『<a href="#" data-toggle="modal" data-target="#id-modal-signin">登录</a>』的距离
        </div>
        <CSignin id="id-modal-signin"/>
    </div>
    <div v-else-if="userClient.family._id == ''" class="text-center mt-5">
        <p>这个家还没有名字呢，你可以</p>
        <p>『<a href="#" data-toggle="modal" data-target="#id-modal-signfamily" @click="showGetFamily(0)">创建</a>』一个家庭，或者</p>
        <p>『<a href="#" data-toggle="modal" data-target="#id-modal-signfamily" @click="showGetFamily(1)">加入</a>』一个家庭</p>
    </div>
    <div v-else>
        <CImgCarousel :imgs="familyCoverImgs" uploadurl="/api/gallery/create?belong=family" placeholder="img/img-upload-128x128.png" :createGalleryTitle="createGalleryTitle"/>
        <CMemberPane class="mt-5" :members="userClient.family.members" :title="`『${userClient.family.name}』的家庭成员`"/>
    </div>
    <CGetFamily ref="getFamily" v-if="!hasFamily" id="id-modal-signfamily" :initial="0"/>
</div>
</template>

<script>
import CSignin from '../authenticate/CSignin'
import CGetFamily from '../authenticate/family/CGetFamily'
import CImgCarousel from '../base/carousel/CImgCarousel'
import CMemberPane from './CMemberPane'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
    name: 'CFamilyIndex',
    components: { CImgCarousel, CSignin, CMemberPane, CGetFamily },
    data () {
        return {
            compoName: '',
            createGalleryTitle: `创建相册到『${this.$store.state.user.userClient.family.name}』`
        }
    },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient
        }),
        ...mapGetters('user', [
            'isAnonymous', 'familyCoverImgs', 'hasFamily'
        ])
    },
    methods: {
        showGetFamily (initial) {
            if (this.$refs.getFamily) {
                this.$refs.getFamily.slideTo(initial)
            }
        }
    },
    created () {
        //
    }
}
</script>

<style>

</style>
