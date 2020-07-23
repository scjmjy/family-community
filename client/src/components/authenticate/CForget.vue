<template>
<div class="text-center">
    <p>placeholder TODO</p>
    <button class="btn btn-link text-primary" @click="cancel">登录界面⇨</button>
</div>
</template>

<script>
export default {
    name: 'CForget',
    methods: {
        cancel () {
            if (this.$listeners && this.$listeners.cancel) {
                this.$listeners.cancel()
            }
        }
    }
}
</script>

<style>

</style>
