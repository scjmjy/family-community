<template>
<div class="d-inline-block">
    <div class="d-flex justify-content-center align-items-center h-100">
        <label for="id-img-uploadinput">
            <img :src="placeholder" alt="upload image" role="button">
        </label>
    </div>
    <input :multiple="multiselect" ref="uploadInput" id="id-img-uploadinput" type="file" class="d-none" accept="image/png,image/jpeg" capture= "camera" @change="onInputChange" />
</div>
</template>

<script>
export default {
    name: 'CImgUploadInput',
    props: ['placeholder', 'multiselect', 'initial'],
    methods: {
        onInputChange (event) {
            this.$listeners && this.$listeners.onImgSelected && this.$listeners.onImgSelected(event.target.files)
        }
    },
    created() {
        if (this.initial) {
            $(this.$refs.uploadInput).trigger('click')
        }
    }
}
</script>

<style>

</style>
