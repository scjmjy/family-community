<template>
<div class="input-group">
    <input @keyup.enter="handleSendTxt" @input="handleInput" @focus="handleFocus" @blur="handleBlur" :value="value" type="text" class="form-control" :placeholder="placeholder" aria-describedby="id-btn-sendmsg">
    <div class="input-group-append">
        <template v-if="image">
            <CImgSendDialog title="发送图片" id="#id-msg-sendimg" ref="imgSendDlg" initial="true" @send="handleSendImg"/>
            <button class="btn btn-outline-primary" data-toggle="modal" data-target="#id-msg-sendimg">
                <i class="fa fa-plus-circle"></i>
            </button>
        </template>
        <button class="btn btn-outline-primary" @click="handleSendTxt" type="button" id="id-btn-sendmsg">{{ btnName ? btnName : '发送' }}</button>
    </div>
</div>
</template>

<script>
// type MsgInputOptions = {
//     focusInput: boolean;
// }
import CImgSendDialog from './CImgSendDialog'
export default {
    inheritAttrs: false,
    name: 'CMsgInput',
    components: { CImgSendDialog },
    props: ['value', 'focusInput', 'placeholder', 'btnName', 'image'],
    methods: {
        handleInput (event) {
            this.$listeners.input && this.$listeners.input(event.target.value)
        },
        handleFocus (event) {
            this.$listeners.focus && this.$listeners.focus(event)
        },
        handleBlur (event) {
            this.$listeners.blur && this.$listeners.blur(event)
        },
        onInputChange(event) {
            this.imgsToSend = event.target.files
        },
        handleSendTxt(event) {
            this.$listeners.send && this.$listeners.send(event)
        },
        handleSendImg(data) {
            this.$listeners.sendImgs && this.$listeners.sendImgs(data)
        }
    },
    watch: {
        focusInput () {
            if (this.focusInput) {
                $(this.$el).find('input').focus()
            } else {
                $(this.$el).find('input').blur()
            }
        }
    }
}
</script>

<style scoped>
/* input {
    background: transparent!important;
} */
</style>
