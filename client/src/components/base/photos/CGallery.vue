<template>
<div class="container-gallery">
    <div>
        <button class="btn btn-primary" @click="$listeners && $listeners.cancel && $listeners.cancel()"><i class="fa fa-arrow-circle-left mr-2 "></i>返回</button>
        <button v-if="isCurrentChannelFamily || isCurrentChannelSelf" class="btn btn-primary float-right" data-toggle="modal" data-target="#id-dialog-gallery-uploadimg">添加照片<i class="fa fa-plus-circle ml-2 "></i></button>
    </div>
    <div v-for="(group,index) of gallery.imgGroups" :key="index" class="mt-2">
        <h5 class="sticky-top">
            <span class="badge badge-warning px-1">{{ group.date }}</span>
        </h5>
        <div class="row mx-1">
            <div v-for="(img,i) of group.imgs" :key="i" class="w-60px h-60px w-md-80px h-md-80px w-xl-100px h-xl-100px m-1">
                <img :src="img.urlThumb" class="img-ratio" role="button" @click="showSlide(index,i)"/>
            </div>
        </div>
    </div>
    <CPhotoSlide :options="slideOptions" id="id-photo-slide-modal"/>
    <CImgUploadDialog id="id-dialog-gallery-uploadimg" :uploadurl="uploadurl" :title="uploadtitle" :isNewGallery="false" :galleryTitle="gallery.title" :galleryDesc="gallery.description"/>
</div>
</template>

<script>
import CImgUploadDialog from '../image/CImgUploadDialog'
import CPhotoSlide from './CPhotoSlide'
import { mapGetters } from 'vuex'

export default {
    name: 'CGallery',
    props: ['gallery', 'uploadurl', 'uploadtitle'],
    components: { CPhotoSlide, CImgUploadDialog },
    data () {
        return {
            // items: [
            //     { date: '2020-01-01', imgs: ['img/avatar-1-48x48.png', 'img/avatar-brother-48x48.png', 'img/avatar-dad-48x48.png', 'img/family-1.jpg', 'img/img-4-367x267.jpg', 'img/per-2.jpg'] },
            //     { date: '2020-02-01', imgs: ['img/avatar-1-48x48.png', 'img/avatar-brother-48x48.png', 'img/avatar-dad-48x48.png', 'img/family-1.jpg', 'img/img-4-367x267.jpg'] },
            //     { date: '2020-03-01', imgs: ['img/avatar-1-48x48.png', 'img/avatar-brother-48x48.png', 'img/avatar-dad-48x48.png', 'img/family-1.jpg', 'img/img-4-367x267.jpg', 'img/per-2.jpg'] },
            //     { date: '2020-04-01', imgs: ['img/avatar-1-48x48.png', 'img/avatar-brother-48x48.png', 'img/avatar-dad-48x48.png', 'img/family-1.jpg', 'img/img-4-367x267.jpg', 'img/per-2.jpg'] },
            //     { date: '2020-05-01', imgs: ['img/avatar-1-48x48.png', 'img/avatar-brother-48x48.png', 'img/avatar-dad-48x48.png', 'img/family-1.jpg', 'img/img-4-367x267.jpg'] },
            //     { date: '2020-06-01', imgs: ['img/avatar-1-48x48.png', 'img/avatar-brother-48x48.png', 'img/avatar-dad-48x48.png', 'img/family-1.jpg', 'img/img-4-367x267.jpg', 'img/per-2.jpg'] },
            //     { date: '2020-07-01', imgs: ['img/avatar-1-48x48.png', 'img/avatar-brother-48x48.png', 'img/avatar-dad-48x48.png', 'img/family-1.jpg', 'img/img-4-367x267.jpg', 'img/per-2.jpg'] }
            // ],
            slideOptions: {
                imgs: [],
                index: 0,
                circle: false
            }
        }
    },
    computed: {
        ...mapGetters('user', [
            'isCurrentChannelSelf', 'isCurrentChannelFamily'
        ]),
        imgs () {
            let imgs = []
            this.gallery.imgGroups.forEach(dayImgs => {
                imgs = imgs.concat(dayImgs.imgs)
            })
            return imgs
        }
    },
    methods: {
        showSlide (itemIndex, imgIndex) {
            this.slideOptions.imgs = this.imgs
            let index = 0
            for (let i = 0; i < itemIndex; i++) {
                const group = this.gallery.imgGroups[i]
                index += group.imgs.length
            }
            this.slideOptions.index = index + imgIndex
            $('#id-photo-slide-modal').modal('toggle')
        }
    }
}
</script>

<style scoped>

</style>
