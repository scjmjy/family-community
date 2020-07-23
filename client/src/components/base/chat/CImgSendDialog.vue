<template>
<CDialogBase ref="dialog" v-bind="dialogOptions">
    <template #body>
        <div class="mb-3">
            <div v-for="(img,index) of previewImgs" :key="index" class="d-inline-block mr-1 mt-1" style="position: relative">
                <img :src="img" alt="" class="w-60px h-60px">
                <i style="position: absolute; top: 4px; right:4px" class="fa fa-time-circle" role="button" @click="removeImg(index)"></i>
            </div>
            <CImgUploadInput multiselect="true" placeholder="img/img-upload-32x32.png" :initial="initial" @onImgSelected="onImgSelected" class="w-60px h-60px"/>
        </div>
        <input v-model="txtMsg" type="text" class="form-control" placeholder="再说点啥...">
    </template>
</CDialogBase>
</template>

<script>
import CDialogBase, { DialogOptions } from '../dialog/CDialogBase.vue'
import CImgUploadInput from '../image/CImgUploadInput'

export default {
    name: 'CImgSendDialog',
    props: ['title', 'initial'],
    components: { CDialogBase, CImgUploadInput },
    data () {
        return {
            dialogOptions: new DialogOptions('center', true, this.title, true, '发送'),
            previewImgs: [],
            imgFiles: [],
            txtMsg: ''
        }
    },
    methods: {
        onImgSelected (files) {
            if (this.imgFiles.length + files.length > 9) {
                this.$root.$emit('toast', '一次最多只能上传9张图片')
                return
            }
            this.imgFiles.push(...files)
            files.forEach(file => {
                this.previewImgs.push(URL.createObjectURL(file))
                if (file.size > 1024 * 1024 * 5) {
                    this.$root.$emit('toast', '有的图片大于5MB，请注意流量')
                }
            })
        },
        removeImg (index) {
            URL.revokeObjectURL(this.previewImgs[index])
            this.imgFiles.splice(index, 1)
            this.previewImgs.splice(index, 1)
        }
    },
    mounted() {
        this.$refs.dialog.$on('ok', event => {
            if (this.imgFiles.length < 0) {
                this.$root.$emit('toast', '请至少选择一张图片')
                return
            }
            $(this.$refs.dialog.$el).modal('hide')
            this.$listeners && this.$listeners.send && this.$listeners.send({ imgs: this.imgFiles, txt: this.txtMsg })
        })
    },
    destroyed () {
        this.previewImgs.forEach(url => {
            URL.revokeObjectURL(url)
        })
    }
}
</script>

<style>

</style>
