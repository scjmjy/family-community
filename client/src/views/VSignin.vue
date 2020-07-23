<template>
    <div class="container p-4">
        <div class="shadow p-2 w-r-75 w-xl-50 mx-auto">
            <CFormBase :options="formOptions" />
            <footer class="text-center">
                <button type="button" class="btn btn-link text-muted" data-toggle="modal" data-target="#id-modal-forget">忘记密码</button>
                |
                <button type="button" class="btn btn-link text-primary" data-toggle="modal" data-target="#id-modal-signup">注册账号</button>
            </footer>
            <CSignup id="id-modal-signup"/>
            <CForget id="id-modal-forget"/>
        </div>
    </div>
</template>

<script>
import CFormBase from '../components/base/form/CFormBase.vue'
import CSignup from '../components/authenticate/CSignup.vue'
import CForget from '../components/authenticate/CForget.vue'

const formOptions = {
    groups: [
        { required: true, preIconClzz: 'fa fa-user', input: { type: 'text', eid: 'id-signin-authname', name: 'authname', placeholder: '手机号或邮箱' }, rules: [{ tip: '请输入您注册过的手机号或者邮箱号', stop: true, pass: true }, { patterns: [/^1\d{10}$/, /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/], tip: '手机号或邮箱格式不正确', pass: true }] },
        { required: true, preIconClzz: 'fa fa-lock', input: { type: 'password', eid: 'id-signin-pw', name: 'pw', placeholder: '密码' }, rules: [{ tip: '请输入密码', stop: true, pass: true }, { patterns: [/^.{6,12}$/], tip: '密码太短或太长了', pass: true }] }
    ],
    submit: {
        verb: '登录'
    },
    postUrl: '/api/user/signin'
}

export default {
    name: 'VSignin',
    components: { CFormBase, CSignup, CForget },
    data () {
        return {
            formOptions: formOptions
        }
    }
}
</script>

<style>

</style>
