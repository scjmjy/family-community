<template>
    <CGalleryGroup v-if="showGroup" :galleries="galleriesWithCover" :createurl="createurl" :createtitle="createtitle" @click="openGallery"/>
    <CGallery v-else :gallery="datedGallery" @cancel="showGroup = true" :uploadurl="uploadurl" :uploadtitle="uploadtitle"/>
</template>

<script>
import { mapState } from 'vuex'
const CGalleryGroup = () => import('./CGalleryGroup')
const CGallery = () => import('./CGallery')

export default {
    name: 'CPhotos',
    props: ['galleries', 'mode'],
    components: { CGalleryGroup, CGallery },
    data () {
        return {
            showGroup: true,
            uploadurl: '',
            uploadtitle: '',
            currentGalleryIndex: -1
        }
    },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient,
            currentChannel: state => state.currentChannel
        }),
        createurl() {
            return this.mode === 'family' ? '/api/gallery/create?belong=family' : '/api/gallery/create?belong=user'
        },
        createtitle() {
            return this.mode === 'family' ? `创建相册到『${this.userClient.family.name}』` : `创建相册到『${this.userClient.nickname}』`
        },
        galleriesWithCover() {
            if (!Array.isArray(this.galleries) || this.galleries.length === 0 || !Array.isArray(this.galleries[0].imgs)) {
                return []
            }
            for (const g of this.galleries) {
                if (!g.coverImgUrl) {
                    if (g.imgs.length > 0) {
                        g.coverImgUrl = g.imgs[0].urlThumb
                    } else {
                        g.coverImgUrl = 'img/gallery-default-cover-128x128.png'
                    }
                }
            }
            return this.galleries
        },
        datedGallery() {
            const gallery = this.galleries[this.currentGalleryIndex]
            gallery.imgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            const datedGallery = { title: gallery.title, description: gallery.description, imgGroups: [] }
            let last = null
            for (const img of gallery.imgs) { // 以 日 为单位分组图片
                const date = new Date(img.createdAt).toLocaleDateString()
                if (last === null) {
                    last = { date, imgs: [img] }
                } else {
                    if (date !== last.date) {
                        datedGallery.imgGroups.push(last)
                        last = { date, imgs: [img] }
                    } else {
                        last.imgs.push(img)
                    }
                }
            }
            if (last !== null) {
                datedGallery.imgGroups.push(last)
            }
            return datedGallery
        }
    },
    methods: {
        openGallery(index) {
            const gallery = this.galleries[index]
            this.uploadurl = `/api/image/upload/${gallery._id}`
            this.uploadtitle = `添加图片到相册『${gallery.title}』`
            this.showGroup = false
            this.currentGalleryIndex = index
        }
    },
    watch: {
        currentChannel: { // 能够检测到channel的变化，说明点击了不同家庭成员的相册页面，因此更新相册
            handler(val, oldVal) {
                this.showGroup = true
            },
            deep: true
        }
    }
}
</script>

<style>

</style>
