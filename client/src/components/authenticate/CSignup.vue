<template>
<div>
<CFormBase :options="formOptions" @result="handleResult" @error="handleError"/>
<footer class="text-center">
    <button class="btn btn-link text-primary" @click="handleCancel">⇦登录界面</button>
</footer>
</div>
</template>

<script>
import CFormBase from '../base/form/CFormBase.vue'

export default {
    name: 'CSignup',
    components: { CFormBase },
    data () {
        return {
            formOptions: {
                groups: [
                    { required: true, preIconClzz: 'fa fa-user', input: { type: 'text', eid: 'id-signup-nickname', name: 'nickname', placeholder: '昵称' }, rules: [{ tip: '昵称不能为空', stop: true, pass: true }, { patterns: [/^.{2,}$/], tip: '长度不能低于2个字符', stop: true, pass: true }, { patterns: [/^.{0,20}$/], tip: '长度不能超过20个字符', pass: true }] },
                    { required: true, preIconClzz: 'fa fa-mobile', input: { type: 'tel', eid: 'id-signup-mobile', name: 'mobile', placeholder: '11位手机号' }, rules: [{ tip: '手机号码不能为空', stop: true, pass: true }, { patterns: [/^1\d{10}$/], tip: '手机号格式不正确', pass: true }] },
                    { required: true, preIconClzz: 'fa fa-lock', input: { type: 'password', eid: 'id-signup-pw', name: 'pw', placeholder: '6-12位密码' }, rules: [{ tip: '密码不能为空', stop: true, pass: true }, { patterns: [/^.{6,}$/], tip: '长度不能低于6个字符', stop: true, pass: true }, { patterns: [/^.{0,12}$/], tip: '长度不能超过12个字符', pass: true }] },
                    { required: true, preIconClzz: 'fa fa-venus-mars', input: { type: 'select', eid: 'id-signup-gender', name: 'gender', placeholder: '性别', options: [{ name: '男', value: 'male' }, { name: '女', value: 'female' }] }, rules: [{ tip: '性别不能为空', pass: true }] }
                ],
                submit: {
                    verb: '注册'
                },
                postUrl: '/api/user/signup'
            }
        }
    },
    methods: {
        handleResult ({ data }) {
            if (data.success) {
                this.$root.$emit('toast', '注册成功')
                if (this.$listeners && this.$listeners.success) {
                    this.$listeners.success(data)
                }
            } else {
                this.$root.$emit('toast', `注册失败：${data.msg}`)
                if (this.$listeners && this.$listeners.failed) {
                    this.$listeners.failed(data)
                }
            }
        },
        handleError (err) {
            this.$root.$emit('toast', `注册失败：${err.message}`)
            if (this.$listeners && this.$listeners.error) {
                this.$listeners.error(err)
            }
        },
        handleCancel () {
            this.$listeners && this.$listeners.cancel && this.$listeners.cancel()
        }
    }
}
</script>

<style>

</style>
