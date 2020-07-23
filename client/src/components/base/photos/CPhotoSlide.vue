<template>
<div class="modal fade" data-keyboard="true" tabindex="-1" role="dialog" aria-labelledby="id-slide-title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="id-slide-title">{{ currentImg.name }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="id-slide-carousel" class="carousel slide" data-ride="false" data-interval="false">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img :src="slide0Img.url" class="d-block w-100" :alt="slide0Img.name">
                        </div>
                        <div class="carousel-item">
                            <img :src="slide1Img.url" class="d-block w-100" :alt="slide1Img.name">
                        </div>
                    </div>
                    <a v-if="options.imgs.length > 1" class="carousel-control-prev" href="#id-slide-carousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">上一张图片</span>
                    </a>
                    <a v-if="options.imgs.length > 1" class="carousel-control-next" href="#id-slide-carousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">下一张图片</span>
                    </a>
                </div>
            </div>
            <div class="modal-footer">
                <a :href="currentImg.url" :download="currentImg.name" class="btn btn-primary">下载</a>
            </div>
        </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'CPhotoSlide',
    props: ['options'],
    data () {
        return {
            currentState: { slide: 0, index: 0 },
            slide0Img: { name: '', url: '' },
            slide1Img: { name: '', url: '' }
        }
    },
    computed: {
        currentImg () {
            return this.currentState.slide === 0 ? this.slide0Img : this.slide1Img
        }
    },
    mounted () {
        const thisOptions = this.options
        const thisSlide0 = this.slide0Img
        const thisSlide1 = this.slide1Img
        const thisState = this.currentState
        thisState.index = this.options.index

        $('#id-slide-carousel').on('slide.bs.carousel', (event) => {
            if (thisOptions.imgs.length === 1) {
                return
            }
            if (event.direction === 'left') {
                if (thisState.index === thisOptions.imgs.length - 1) {
                    thisState.index = 0
                } else {
                    thisState.index++
                }
            } else {
                if (thisState.index === 0) {
                    thisState.index = thisOptions.imgs.length - 1
                } else {
                    thisState.index--
                }
            }
            if (thisState.slide === 0) {
                thisSlide1.name = thisOptions.imgs[thisState.index].title
                thisSlide1.url = thisOptions.imgs[thisState.index].url
            } else {
                thisSlide0.name = thisOptions.imgs[thisState.index].title
                thisSlide0.url = thisOptions.imgs[thisState.index].url
            }
        })

        $('#id-slide-carousel').on('slid.bs.carousel', (event) => {
            thisState.slide = event.to
        })

        $(this.$el).on('show.bs.modal', function () {
            thisState.index = thisOptions.index
            if (thisState.slide === 0) {
                thisSlide0.name = thisOptions.imgs[thisState.index].title
                thisSlide0.url = thisOptions.imgs[thisState.index].url
            } else {
                thisSlide1.name = thisOptions.imgs[thisState.index].title
                thisSlide1.url = thisOptions.imgs[thisState.index].url
            }
        })
        $(this.$el).on('hidden.bs.modal', function () {
            //
        })
    }
}
</script>

<style>

</style>
