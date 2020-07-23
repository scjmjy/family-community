<template>
    <CPhotos :galleries="userClient.family.galleries" mode="family"/>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CPhotos from '../base/photos/CPhotos'

export default {
    name: 'CFamilyPhotos',
    components: { CPhotos },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient
        })
    },
    methods: {
        ...mapActions('user', [
            'updateFamilyGalleries'
        ])
    },
    created() {
        this.updateFamilyGalleries()
    }
}
</script>

<style>

</style>
