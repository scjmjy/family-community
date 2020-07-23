<template>
<div class="container position-relative h-100">
    <div class="container-chat">
        <PullTo :isTopBounce="hasFamily && isTopBounce" :topConfig="topConfig" :topLoadMethod="loadMore" :isBottomBounce="false">
            <CMsgItem v-for="(msg, index) of msgs" :key="index" :message="msg" class="my-3 mw-75" />
        </PullTo>
    </div>
    <CMsgInput class="input-chat" v-model="msgToSend" @send="handleSend" image="true" @sendImgs="handleSendImgs" :placeholder="'说点啥...'"/>
</div>
</template>

<script>
import PullTo from 'vue-pull-to'

import CMsgItem, { MessageType } from './CMsgItem.vue'
import CMsgInput from './CMsgInput.vue'
import { mapState, mapActions, mapGetters } from 'vuex'

// type ChatOptions = {
//     msgs: MessageType[];
// }

export default {
    name: 'CChat',
    components: { PullTo, CMsgItem, CMsgInput },
    props: ['msgs'],
    data () {
        return {
            msgToSend: '',
            isTopBounce: true,
            topConfig: {
                pullText: '下拉刷新', // 下拉时显示的文字
                triggerText: '释放更新', // 下拉到触发距离时显示的文字
                loadingText: '加载中...', // 加载中的文字
                doneText: '加载完成', // 加载完成的文字
                failText: '加载失败', // 加载失败的文字
                loadedStayTime: 400, // 加载完后停留的时间ms
                stayDistance: 50, // 触发刷新后停留的距离
                triggerDistance: 70 // 下拉刷新触发的距离
            }
        }
    },
    computed: {
        ...mapGetters('user', [
            'hasFamily'
        ])
    },
    methods: {
        handleSend () {
            if (this.msgToSend.length > 0) {
                this.$listeners && this.$listeners.send && this.$listeners.send(this.msgToSend)
                this.msgToSend = ''
            }
        },
        handleSendImgs(data) {
            this.$listeners && this.$listeners.sendImgs && this.$listeners.sendImgs(data)
        },
        loadMore(loaded) {
            if (this.$listeners && this.$listeners.loadMore) {
                this.$listeners.loadMore(loaded)
                    .then(noMore => {
                        if (noMore !== undefined && noMore) {
                            // this.isTopBounce = false
                            this.$root.$emit('toast', '没有更多历史消息了')
                        }
                        loaded('done')
                    }).catch(err => {
                        this.$root.$emit('toast', err)
                        loaded('fail')
                    })
            }
        }
    },
    created() {
        this.$root.$on('push-message', ({ type, p2, from }) => {
            this.$nextTick(() => {
                const sc = $('.scroll-container')
                // sc.scrollTop(sc.height())
                sc.animate({ scrollTop: sc.height() }, 500)
            })
        })
    }
}
</script>

<style scoped>
.container-chat {
    border: 1px solid black;
    border-radius: 5px;
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: calc(38px + 1rem);
}
.input-chat {
    position: absolute;
    left: 1rem;
    right: 1rem;
    bottom: 0.5rem;
    width: auto;
    background: transparent!important;
}
</style>
