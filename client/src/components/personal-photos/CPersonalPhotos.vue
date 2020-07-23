<template>
    <CPhotos :galleries="selectedUserGalleries" mode="user"/>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import CPhotos from '../base/photos/CPhotos'

export default {
    name: 'CPersonalPhotos',
    components: { CPhotos },
    data() {
        return {
        }
    },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient,
            currentChannel: state => state.currentChannel,
            selectedUserId: state => state.selectedUserId
        }),
        selectedUserGalleries() {
            const uid = this.selectedUserId
            if (uid === this.userClient._id) {
                // 当前登录的用户
                return this.userClient.galleries
            } else {
                const member = this.userClient.family.members.find(m => m._id === uid)
                if (member && Array.isArray(member.galleries)) {
                    return member.galleries
                } else {
                    return []
                }
            }
        }
    },
    methods: {
        ...mapActions('user', [
            'updateUserGalleries'
        ]),
        updateGalleries() {
            this.updateUserGalleries(this.selectedUserId)
        }
    },
    created() {
        this.updateGalleries()
        this.$root.$on('function-reenter', () => {
            this.updateGalleries()
        })
    },
    beforeDestroy() {
        this.$root.$off('function-reenter')
    }
}
</script>

<style>

</style>
