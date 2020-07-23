<template>
<div :class="msgDirection=='left'?'container-msgitem-left':'container-msgitem-right'">
    <div v-if="msgType === 'txt'" class="msgitem" :class="msgDirection=='left'?'msgitem-left':'msgitem-right'">
        <img :src="senderAvatar" alt="">
        <div class="msgitem-body" :class="msgDirection=='left'?'ml-2':'mr-2'">
            <span class="d-block mb-1 h5">{{ senderName }}</span>
            <div class="msg-container">
                <span class="p-2">{{ message.content.txt }}</span>
            </div>
        </div>
    </div>
    <div v-else-if="msgType === 'img'" class="msgitem" :class="msgDirection=='left'?'msgitem-left':'msgitem-right'">
        <img :src="senderAvatar" alt="">
        <div class="msgitem-body" :class="msgDirection=='left'?'ml-2':'mr-2'">
            <span class="d-block mb-1 h5">{{ senderName }}</span>
            <div class="msg-container">
                <figure class="figure p-2 mb-0">
                    <img :src="message.content.imgs[0].urlThumb" class="figure-img img-fluid rounded" alt="...">
                    <figcaption v-if="message.content.txt" class="figure-caption text-left border-top pt-1">{{ message.content.txt }}</figcaption>
                </figure>
            </div>
        </div>
    </div>
    <!-- <div v-else-if="message.type=='mp3'">

    </div> -->
<div v-else class="msgitem" :class="message.direction=='left'?'msgitem-left':'msgitem-right'">
    <img :src="message.sender.avatarThumb" alt="">
    <div class="msgitem-body" :class="message.direction=='left'?'ml-2':'mr-2'">
        <span class="d-block">{{ message.sender.name }}</span>
        <span class="bg-warning rounded px-2">不支持的消息格式</span>
    </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

// export type MessageType = {
//     direction: 'left' | 'right';
//     type: 'txt' | 'img' | 'sound' | 'video';
//     content: { txt:string; imgs:[{url, urlThumb}] };
//     sender: { avatar: string; name: string };
// }

export default {
    name: 'CMsgItem',
    props: ['message'],
    computed: {
        ...mapState('user', {
            userClient: state => state.userClient
        }),
        msgType() {
            if (this.message.content.imgs && this.message.content.imgs.length > 0) {
                return 'img'
            } else if (this.message.content.txt && this.message.content.txt.length > 0) {
                return 'txt'
            } else {
                return ''
            }
        },
        msgDirection() {
            return this.message.sender === this.userClient._id ? 'right' : 'left'
        },
        senderName() {
            const user = this.userClient.family.members.find(m => m._id === this.message.sender)
            if (user) {
                return user.nickname
            } else {
                return ''
            }
        },
        senderAvatar() {
            const user = this.userClient.family.members.find(m => m._id === this.message.sender)
            if (user) {
                return user.avatarThumb
            } else {
                return ''
            }
        }
    }
}
</script>

<style scoped>
.container-msgitem-left {
}
.container-msgitem-right {
    margin-left: auto;
}
.msgitem {
    display: flex;
    align-items: flex-start;
}
.msgitem-body {
    flex: 1;
}
.msgitem-left {
    flex-direction: row;
}
.msgitem-right {
    flex-direction: row-reverse;
    text-align: right;
    margin-left: auto;
}

.msg-container {
    position: relative;
    display: inline-block;
    border: 1px solid lightslategray;
    border-radius: 5px;
    background-color: white;
}
.msgitem-left .msg-container::before {
    position: absolute;
    width: 0;
    height: 0;
    left: -11px;
    top: 5px;
    border: 5px solid;
    border-color: transparent black transparent transparent;
    content: '';
}
.msgitem-right .msg-container::after {
    position: absolute;
    width: 0;
    height: 0;
    right: -11px;
    top: 5px;
    border: 5px solid;
    border-color: transparent transparent transparent black;
    content: '';
}
</style>
