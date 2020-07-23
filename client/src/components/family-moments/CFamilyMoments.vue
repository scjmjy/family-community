<template>
    <div>
        <CMomentItem v-for="(m,index) of moments" :key="index" :options="{moment: m, index: index}" class="border-bottom my-2 pb-2" @star="handleStar" @comment="handleComment" @image="handleClickImg"/>
        <div class="d-none" id="id-family-moments-input">
            <CMsgInput v-bind="inputOptions" class="fixed-bottom" @focus="handleInputFoucus" @blur="handleInputBlur"/>
        </div>
        <CPhotoSlide :options="slideOptions" id="id-photo-slide-modal-comment"/>
    </div>
</template>

<script>
import CMomentItem from './CMomentItem'
import CMsgInput from '../base/chat/CMsgInput'
import CPhotoSlide from '../base/photos/CPhotoSlide'

export default {
    name: 'CFamilyMoments',
    components: { CMomentItem, CMsgInput, CPhotoSlide },
    data () {
        return {
            testInterval: 0,
            inputOptions: { focusInput: false },
            $currentComment: null,
            moments: [
                { id: 'moment-1', createdAt: '3天前', sender: { name: '老爸', avatar: 'img/avatar-dad-48x48.png' }, content: '今天去买菜了', imgs: ['img/eggs-1-128x128.png'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-2', createdAt: '3天前', sender: { name: '老妈', avatar: 'img/avatar-mom-48x48.png' }, content: '今天给家人做青椒炒鸡蛋吃', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-3', createdAt: '3天前', sender: { name: '老哥', avatar: 'img/avatar-brother-48x48.png' }, content: '运动完毕，回家吃饭', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png', 'img/per-1.jpg'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-4', createdAt: '3天前', sender: { name: '老妹', avatar: 'img/avatar-sister-48x48.png' }, content: '放学回家吃饭咯', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png', 'img/per-1.jpg', 'img/per-2.jpg'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-5', createdAt: '3天前', sender: { name: '老爸', avatar: 'img/avatar-dad-48x48.png' }, content: '今天去买菜了', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png', 'img/per-1.jpg', 'img/per-2.jpg', 'img/img-8-367x267.jpg'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-6', createdAt: '3天前', sender: { name: '老妈', avatar: 'img/avatar-mom-48x48.png' }, content: '今天给家人做青椒炒鸡蛋吃', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png', 'img/per-1.jpg', 'img/per-2.jpg', 'img/img-8-367x267.jpg', 'img/img-2-400x200.jpg'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-7', createdAt: '3天前', sender: { name: '老哥', avatar: 'img/avatar-brother-48x48.png' }, content: '运动完毕，回家吃饭', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png', 'img/per-1.jpg', 'img/per-2.jpg', 'img/img-8-367x267.jpg', 'img/img-2-400x200.jpg', 'img/homepage-2-48x48.png'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-8', createdAt: '3天前', sender: { name: '老妹', avatar: 'img/avatar-sister-48x48.png' }, content: '放学回家吃饭咯', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png', 'img/per-1.jpg', 'img/per-2.jpg', 'img/img-8-367x267.jpg', 'img/img-2-400x200.jpg', 'img/homepage-2-48x48.png', 'img/family-3.jpg'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] },
                { id: 'moment-9', createdAt: '3天前', sender: { name: '老爸', avatar: 'img/avatar-dad-48x48.png' }, content: '今天去买菜了', imgs: ['img/eggs-1-128x128.png', 'img/peppers-1-250x250.png', 'img/per-1.jpg', 'img/per-2.jpg', 'img/img-8-367x267.jpg', 'img/img-2-400x200.jpg', 'img/homepage-2-48x48.png', 'img/family-3.jpg', 'img/Avatar-therapy.jpg'], stars: [{ name: '小明', uid: '111' }, { name: '小红', uid: '222' }], comments: [{ name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }, { name: '老爸', avatar: 'img/avatar-dad-48x48.png', content: '小伙子不错啊' }] }
            ],
            slideOptions: {
                imgs: [],
                index: 0,
                circle: false
            }
        }
    },
    methods: {
        handleInputFoucus () {
            console.log('Input focused')
        },
        handleInputBlur (event) {
            //
            $('#id-family-moments-input').addClass('d-none')
            this.$currentComment.toggleClass('comment-highlight')
            this.$currentComment = null
        },
        handleStar (options) {
            //  TODO
            alert(`Star ${options.moment.content}`)
        },
        handleComment (options, el) {
            //  TODO
            $('#id-family-moments-input').removeClass('d-none')
            this.inputOptions = Object.assign({}, this.inputOptions, { focusInput: true })
            el.scrollIntoView(true)
            this.$currentComment = $(el)
            this.$currentComment.toggleClass('comment-highlight')
        },
        handleClickImg (options, index) {
            this.slideOptions.imgs = []
            options.moment.imgs.forEach(img => {
                this.slideOptions.imgs.push({
                    title: img,
                    url: img
                })
            })
            this.slideOptions.index = index
            $('#id-photo-slide-modal-comment').modal('toggle')
        }
    },
    mounted() {
        this.testInterval = setInterval(() => {
            this.$root.$emit('toast', '此功能尚未完善，敬请期待')
        }, 2000)
    },
    beforeDestroy() {
        clearInterval(this.testInterval)
    }
}
</script>

<style scoped>
.comment-highlight {
    border: 8px solid rgba(0, 255, 255, 0.699);
}
</style>
