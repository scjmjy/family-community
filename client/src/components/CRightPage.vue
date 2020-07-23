<template>
<div id="id-container-rightpage" class="col h-100 overflow-auto pt-2">
    <!-- <keep-alive> -->
        <component ref="compo" :is="compoName"/>
    <!-- </keep-alive> -->
</div>
</template>

<script>
const CFamilyIndex = () => import('./family-index/CFamilyIndex')
const CFamilyChat = () => import('./family-chat/CFamilyChat')
const CFamilyMoments = () => import('./family-moments/CFamilyMoments')
const CFamilyPhotos = () => import('./family-photos/CFamilyPhotos')

const CPersonalIndex = () => import('./personal-index/CPersonalIndex')
const CPersonalChat = () => import('./personal-chat/CPersonalChat')
const CPersonalMoments = () => import('./personal-moments/CPersonalMoments')
const CPersonalPhotos = () => import('./personal-photos/CPersonalPhotos')

// type RightPageOptions = {
//     compoName: string;
//     bgurl: string;
// }

export default {
    name: 'CRightPage',
    props: ['compoName', 'bgurl'],
    components: { CFamilyIndex, CPersonalIndex, CFamilyChat, CPersonalChat, CFamilyMoments, CPersonalMoments, CFamilyPhotos, CPersonalPhotos },
    data () {
        return {
        }
    },
    methods: {
        changeBgImg (url) {
            $('#id-container-rightpage').css('background-image', `url(${url})`)
        }
    },
    watch: {
        bgurl(newUrl, oldUrl) {
            this.changeBgImg(newUrl)
        }
    },
    mounted () {
        if (this.bgurl !== '/img/overlay-default.png') {
            this.changeBgImg(this.bgurl)
        }
    }
}
</script>

<style scoped>
#id-container-rightpage {
    background-image: url('/img/overlay-default.png');
}
</style>
