<template>
<div class="container-imgclip">
    <div class="d-flex justify-content-center align-items-center h-100 overflow-auto">
        <!-- <div class="mh-50 text-center"> -->
            <CVueCropper ref="cropper" @ready="cropReady" :src="imgurl" :viewMode="3" dragMode="move" :aspectRatio="1" :containerStyle="{ 'height': '60vh!important' }"/>
        <!-- </div> -->
    </div>
    <footer class="imgclip-footer d-flex justify-content-between align-items-center mb-2 mx-3">
        <button @click="cancel" class="btn btn-secondary">取消</button>
        <button @click="rotateLeft" class="btn btn-link">左转</button>
        <button @click="reset" class="btn btn-link">重置</button>
        <button @click="rotateRight" class="btn btn-link">右转</button>
        <button @click="doCrop" class="btn btn-primary">确认</button>
    </footer>
</div>
</template>

<script>
import CVueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
// :containerStyle="'mh-50'"
export default {
    name: 'CImgClip',
    components: { CVueCropper },
    props: ['imgurl'],
    data () {
        return {
            isReady: false
        }
    },
    methods: {
        cancel () {
            this.$listeners && this.$listeners.cancel && this.$listeners.cancel()
        },
        reset () {
            if (this.isReady) {
                this.$refs.cropper.reset()
            }
        },
        rotateLeft () {
            if (this.isReady) {
                this.$refs.cropper.rotate(-90)
            }
        },
        rotateRight () {
            if (this.isReady) {
                this.$refs.cropper.rotate(90)
            }
        },
        doCrop () {
            if (this.isReady) {
                const canvas = this.$refs.cropper.getCroppedCanvas({
                    minWidth: 200,
                    minHeight: 200,
                    maxWidth: 4096,
                    maxHeight: 4096,
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: 'high'
                })
                canvas.toBlob(blob => {
                    this.$listeners && this.$listeners.crop && this.$listeners.crop(blob)
                })
            }
        },
        cropReady () {
            this.isReady = true
        }
    }
}
</script>

<style>
.container-imgclip {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100000;
}
.imgclip-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>
