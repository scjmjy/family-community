<template>
<CDialogBase v-bind="dialogOptions">
    <template #body>
        <div class="mb-3">
            <div v-for="(img,index) of previewImgs" :key="index" class="d-inline-block mr-1 mt-1" style="position: relative">
                <img :src="img" alt="" class="w-60px h-60px">
                <i style="position: absolute; top: 4px; right:4px" class="fa fa-time-circle" role="button" @click="removeImg(index)"></i>
            </div>
            <CImgUploadInput multiselect="true" placeholder="img/img-upload-32x32.png" :initial="initial" @onImgSelected="onImgSelected" class="w-60px h-60px"/>
        </div>
        <CFormBase :options="isNewGallery ? createGalleryOpts : uploadImgOpts" @preSubmit="preSubmit" @prePost="prePost" @result="uploadResult" @error="uploadError"/>
    </template>
</CDialogBase>
</template>

<script>
import CDialogBase, { DialogOptions } from '../dialog/CDialogBase.vue'
import CFormBase from '../form/CFormBase'
import CImgUploadInput from './CImgUploadInput'
import { mapMutations } from 'vuex'

export default {
    name: 'CImgUploadDialog',
    props: ['uploadurl', 'title', 'isNewGallery', 'galleryTitle', 'galleryDesc', 'initial'],
    components: { CDialogBase, CFormBase, CImgUploadInput },
    data () {
        return {
            dialogOptions: new DialogOptions('center', true, this.title, false),
            previewImgs: [],
            imgFiles: [],
            uploadImgOpts: {
                groups: [
                    { required: false, preIconClzz: 'fa fa-header', input: { type: 'text', eid: 'id-signup-title', disabled: true, value: this.galleryTitle, name: 'title', placeholder: '相册标题' }, rules: [{ tip: '标题不能为空', stop: true, pass: true }, { patterns: [/^.{1,}$/], tip: '长度不能低于1个字符', stop: true, pass: true }, { patterns: [/^.{0,10}$/], tip: '长度不能超过10个字符', pass: true }] },
                    { required: false, preIconClzz: 'fa fa-info-circle', input: { type: 'text', eid: 'id-signup-description', disabled: true, value: this.galleryDesc, name: 'description', placeholder: '简要描述' }, rules: [{ tip: '描述不能为空', stop: true, pass: true }, { patterns: [/^.{1,}$/], tip: '长度不能低于1个字符', stop: true, pass: true }, { patterns: [/^.{0,20}$/], tip: '长度不能超过20个字符', pass: true }] }
                ],
                submit: {
                    verb: '上传'
                },
                postUrl: this.uploadurl,
                encode: 'form-data'
            },
            createGalleryOpts: {
                groups: [
                    { required: true, preIconClzz: 'fa fa-header', input: { type: 'text', eid: 'id-signup-title', name: 'title', placeholder: '相册标题' }, rules: [{ tip: '标题不能为空', stop: true, pass: true }, { patterns: [/^.{1,}$/], tip: '长度不能低于1个字符', stop: true, pass: true }, { patterns: [/^.{0,10}$/], tip: '长度不能超过10个字符', pass: true }] },
                    { required: true, preIconClzz: 'fa fa-info-circle', input: { type: 'text', eid: 'id-signup-description', name: 'description', placeholder: '简要描述' }, rules: [{ tip: '描述不能为空', stop: true, pass: true }, { patterns: [/^.{1,}$/], tip: '长度不能低于1个字符', stop: true, pass: true }, { patterns: [/^.{0,20}$/], tip: '长度不能超过20个字符', pass: true }] }
                ],
                submit: {
                    verb: '上传'
                },
                postUrl: this.uploadurl,
                encode: 'form-data'
            }
        }
    },
    methods: {
        ...mapMutations('user', [
            'setGallery'
        ]),
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
        },
        preSubmit () {
            if (this.imgFiles.length === 0) {
                this.$root.$emit('toast', '您还没有选择图片')
                return false
            }
            return true
        },
        prePost () {
            const fields = []
            this.imgFiles.forEach(file => {
                fields.push({ fieldname: 'imgfiles', value: file })
            })
            return fields
        },
        uploadResult({ data }) {
            if (data.success) {
                this.setGallery(data.data)
                $(this.$el).modal('hide')
            } else {
                this.$root.$emit('toast', `上传图片失败：${data.msg}`)
            }
        },
        uploadError(err) {
            this.$root.$emit('toast', `上传图片失败：${err.message}`)
        }
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
