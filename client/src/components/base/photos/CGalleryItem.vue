<template>
<div class="">
<div class="card align-items-center">
    <div class="d-inline-block w-80px h-80px w-md-100px h-md-100px w-xl-120px h-xl-120px text-center mt-2">
        <img :src="gallery.coverImgUrl" class="card-img-top h-100" alt="相册封面照">
    </div>
    <div class="card-body">
        <h5 class="text-center card-title">{{ gallery.title }}</h5>
        <!-- <span class="card-text text-center">{{ gallery.description }}</span> -->
        <div class="text-center">
            <button type="button" @click="$listeners.click(index)" class="btn btn-primary">进入相册</button>
        </div>
    </div>
</div>
</div>
</template>

<script>
export default {
    name: 'CGalleryItem',
    props: ['gallery', 'index']
}
</script>

<style>

</style>
