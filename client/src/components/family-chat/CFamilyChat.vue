<template>
    <CChat :msgs="familyChats" @send="handleSend" @loadMore="loadMore"/>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CChat from '../base/chat/CChat'

export default {
    name: 'CFamilyChat',
    components: { CChat },
    data () {
        return {
        }
    },
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient,
            currentChannel: state => state.currentChannel,
            chats: state => state.chats
        }),
        ...mapGetters('user', [
            'hasFamily'
        ]),
        familyChats() {
            return this.chats.getFamilyChats()
        }
    },
    methods: {
        ...mapActions('user', [
            'updateFamilyChats', 'sendMsgToFamily', 'historyFamilyChats'
        ]),
        updateChats() {
            this.updateFamilyChats()
        },
        handleSend(msg) {
            if (!this.hasFamily) {
                this.$root.$emit('toast', '您还没有家庭，不能使用此功能')
                return
            }
            this.sendMsgToFamily({ msg })
                .then(ack => {
                    this.$root.$emit('toast', `发送成功, ack:${ack}`)
                })
                .catch(err => {
                    this.$root.$emit(`toast', '发送失败：${err.message}`)
                })
        },
        // handleSendImgs(data) {
        //     this.sendImgMsgToFamily({ data })
        // },
        loadMore() {
            return this.historyFamilyChats()
        }
    },
    created () {
        this.updateChats()
    }

}
</script>

<style>

</style>
