<template>
<div class="media rounded">
    <img class="rounded-circle" :src="options.imgurl" alt />
    <div class="media-body ml-1">
        <h6 class="text-white">{{ options.title }}</h6>
        <p class="text-truncate">{{ options.description }}</p>
    </div>
</div>
</template>

<script>
export default {
    name: 'CMediaItem',
    props: ['options']
}
</script>

<style>

</style>
