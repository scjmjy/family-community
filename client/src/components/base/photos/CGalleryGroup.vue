<template>
<div>
    <div v-if="isCurrentChannelFamily || isCurrentChannelSelf" class="clearfix">
        <button class="btn btn-primary float-right" @click="toggleUplDlg">创建新相册<i class="fa fa-plus-circle ml-2 "></i></button>
    </div>
    <div class="row justify-content-start mt-1">
        <CGalleryItem v-for="(gallery,index) of galleries" :key="index" :gallery="gallery" :index="index" class="col-6 col-md-4 col-xl-3 my-1" @click="$listeners && $listeners.click && $listeners.click(index)"/>
    </div>
    <CImgUploadDialog class="text-left" id="id-dialog-gallery-create" :uploadurl="createurl" :title="createtitle" :isNewGallery="true"/>
</div>
</template>

<script>
import CImgUploadDialog from '../image/CImgUploadDialog'
import CGalleryItem from './CGalleryItem'
import { mapGetters } from 'vuex'
export default {
    name: 'CGalleryGroup',
    props: ['galleries', 'createurl', 'createtitle'],
    components: { CGalleryItem, CImgUploadDialog },
    computed: {
        ...mapGetters('user', [
            'isCurrentChannelSelf', 'isCurrentChannelFamily'
        ])
    },
    methods: {
        toggleUplDlg(e) {
            if (this.isCurrentChannelFamily && !this.hasFamily) {
                this.$root.$emit('toast', '您还没有家庭，不能使用此功能')
                return
            }
            $('#id-dialog-gallery-create').modal('show')
        }
    }
}
</script>

<style>

</style>
