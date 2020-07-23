<template>
<div id="id-carousel" class="carousel slide" data-ride="carousel">
    <ol v-if="imgs.length > 1" class="carousel-indicators">
        <li v-for="(img,index) of imgs" :key="index" data-target="#id-carousel" :data-slide-to="index" :class="{active:index==0}"></li>
    </ol>
    <div class="carousel-inner" style="height: 40vh">
        <template v-if="imgs.length > 0">
            <div class="carousel-item text-center h-100" :class="{active:index==0}" v-for="(img,index) of imgs" :key="index">
                <img :src="img.urlThumb" class="h-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h5>{{ img.title }}</h5>
                    <p>{{ img.description }}</p>
                </div>
            </div>
        </template>
        <div v-else-if="isCurrentChannelSelf || isCurrentChannelFamily" class="carousel-item rounded text-center h-100 active bg-secondary">
            <a href="" data-toggle="modal" data-target="#id-dialog-uploadimg" class="h-100">
                <img :src="placeholder" alt="" class="h-100">
            </a>
            <div class="carousel-caption pb-0">
                <span class="h3 text-white">没有照片，上传一张吧</span>
            </div>
            <CImgUploadDialog class="text-left" id="id-dialog-uploadimg" :uploadurl="uploadurl" :title="createGalleryTitle" :isNewGallery="true"/>
        </div>
        <div v-else class="carousel-item rounded text-center h-100 active bg-secondary">
            <div class="carousel-caption">
                <span class="h3 text-white">对方还没有上传任何照片</span>
            </div>
        </div>
    </div>
  <a v-if="imgs.length > 1" class="carousel-control-prev" href="#id-carousel" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a v-if="imgs.length > 1" class="carousel-control-next" href="#id-carousel" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
</template>

<script>
import CImgUploadDialog from '../image/CImgUploadDialog'
import { mapGetters } from 'vuex'

export default {
    name: 'CImgCarousel',
    props: ['imgs', 'placeholder', 'uploadurl', 'createGalleryTitle'],
    components: { CImgUploadDialog },
    computed: {
        ...mapGetters('user', [
            'isCurrentChannelSelf', 'isCurrentChannelFamily'
        ])
    },
    data () {
        return {
        }
    },
    methods: {
    }
}
</script>

<style>

</style>
