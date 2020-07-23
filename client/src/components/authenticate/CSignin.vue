<template>
<CDialogBase ref="dlg" v-bind="dialogOptions">
    <template #body>
        <CCarouselBase v-bind="carouselOptions">
            <template  #forget>
                <CForget @cancel="slideTo(1)"/>
            </template>

            <template #signin>
                <CFormBase :options="formOptions" @result="handleResult" @error="handleError"/>
                <footer class="text-center">
                    <button type="button" class="btn btn-link text-muted" @click="slideTo(0)">忘记密码</button>
                    |
                    <button type="button" class="btn btn-link text-primary" @click="slideTo(2)">注册账号</button>
                </footer>
            </template>

            <template #signup>
                <CSignup @cancel="slideTo(1)" @success="handleSignupSuccess"/>
            </template>
        </CCarouselBase>
    </template>
</CDialogBase>
</template>

<script>
import { mapMutations } from 'vuex'

import CFormBase from '../base/form/CFormBase.vue'
import CCarouselBase, { CarsouelOptions, SlideOptions } from '../base/carousel/CCarouselBase.vue'
import CDialogBase, { DialogOptions } from '../base/dialog/CDialogBase.vue'
import CSignup from '../authenticate/CSignup.vue'
import CForget from '../authenticate/CForget.vue'

export default {
    name: 'CSignin',
    components: { CDialogBase, CCarouselBase, CFormBase, CSignup, CForget },
    data () {
        return {
            dialogOptions: new DialogOptions('center', true, '登录', false),
            carouselOptions: new CarsouelOptions('id-carsousel-signin', ['forget', 'signin', 'signup'], -1, new SlideOptions(1)),
            formOptions: {
                groups: [
                    { required: true, preIconClzz: 'fa fa-user', input: { type: 'text', eid: 'id-signin-authname', name: 'authname', placeholder: '手机号或邮箱' }, rules: [{ tip: '手机号或者邮箱号不能为空', stop: true, pass: true }, { patterns: [/^1\d{10}$/, /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/], tip: '手机号或邮箱格式不正确', pass: true }] },
                    { required: true, preIconClzz: 'fa fa-lock', input: { type: 'password', eid: 'id-signin-pw', name: 'pw', placeholder: '密码' }, rules: [{ tip: '密码不能为空', stop: true, pass: true }, { patterns: [/^.{6,12}$/], tip: '密码太短或太长了', pass: true }] }
                ],
                submit: {
                    verb: '登录'
                },
                postUrl: '/api/user/signin'
            }
        }
    },
    methods: {
        ...mapMutations('user', [
            'setUserClient'
        ]),
        slideTo (index) {
            this.carouselOptions.slideTo = index
            this.dialogOptions.headerTitle = index === 0 ? '找回密码' : index === 1 ? '登录' : '注册'
        },
        handleSignupSuccess (data) {
            this.setUserClient(data.data)
            this.$refs.dlg.hide()
        },
        handleResult ({ data }) {
            if (data.success) {
                this.$root.$emit('toast', '登录成功')
                this.handleSignupSuccess(data)
                if (this.$listeners && this.$listeners.success) {
                    this.$listeners.success(data)
                }
            } else {
                this.$root.$emit('toast', `登录失败：${data.msg}`)
                if (this.$listeners && this.$listeners.failed) {
                    this.$listeners.failed(data)
                }
            }
        },
        handleError (err) {
            this.$root.$emit('toast', `登录失败：${err.message}`)
            if (this.$listeners && this.$listeners.error) {
                this.$listeners.error(err)
            }
        }
    }
}
</script>

<style>

</style>
