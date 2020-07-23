<template>
    <CChat :msgs="personalChats" @send="handleSend" @sendImgs="handleSendImgs" @loadMore="loadMore"/>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CChat from '../base/chat/CChat'

export default {
    name: 'CPersonalChat',
    components: { CChat },
    data () {
        return {
            localChannel: {}
        }
    },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient,
            currentChannel: state => state.currentChannel,
            chats: state => state.chats,
            selectedUserId: state => state.selectedUserId
        }),
        personalChats() {
            return this.chats.getPersonalChats(this.selectedUserId)
        }
    },
    methods: {
        ...mapActions('user', [
            'updatePersonalChats', 'sendMsgTo', 'sendImgMsgTo', 'historyPersonalChats'
        ]),
        updateChats() {
            this.updatePersonalChats(this.selectedUserId)
        },
        handleSend(msg) {
            this.sendMsgTo({ uid: this.selectedUserId, msg })
                .then(ack => {
                    this.$root.$emit('toast', `发送成功, ack:${ack}`)
                })
                .catch(err => {
                    this.$root.$emit(`toast', '发送失败：${err.message}`)
                })
        },
        handleSendImgs(data) {
            this.sendImgMsgTo({ uid: this.selectedUserId, data })
        },
        loadMore() {
            return this.historyPersonalChats(this.selectedUserId)
        }
    },
    created () {
        Object.assign(this.localChannel, this.currentChannel)
        this.updateChats()
        this.$root.$on('function-reenter', () => {
            this.updateChats()
        })
    },
    beforeDestroy() {
        this.$root.$off('function-reenter')
    }

}
</script>

<style>

</style>
