<template>
<div>
<CFormBase :options="formOptions" @result="handleResult" @error="handleError"/>
<footer class="text-center">
    <button class="btn btn-link text-primary" @click="handleCancel">加入家庭⇨</button>
</footer>
</div>
</template>

<script>
import CFormBase from '../../base/form/CFormBase.vue'

export default {
    name: 'CCreateFamily',
    components: { CFormBase },
    data () {
        return {
            formOptions: {
                groups: [
                    { required: true, preIconClzz: 'fa fa-home', input: { type: 'text', eid: 'id-signfamily-name', name: 'familyname', placeholder: '你家的名字' }, rules: [{ tip: '名字不能为空', stop: true, pass: true }, { patterns: [/^.{2,}$/], tip: '长度不能低于2个字符', stop: true, pass: true }, { patterns: [/^.{0,10}$/], tip: '长度不能超过10个字符', pass: true }] },
                    { required: true, preIconClzz: 'fa fa-info-circle', input: { type: 'text', eid: 'id-signfamily-description', name: 'description', placeholder: '简要描述' }, rules: [{ tip: '描述不能位空', stop: true, pass: true }, { patterns: [/^.{1,}$/], tip: '长度不能低于1个字符', pass: true }] },
                    { required: false, preIconClzz: 'fa fa-file-image-o', input: { type: 'image', eid: 'id-signfamily-avatar', name: 'avatar', placeholder: '家的头像' } }
                ],
                submit: {
                    verb: '创建'
                },
                postUrl: '/api/family/create',
                encode: 'form-data'
            }
        }
    },
    created () {
        // this.formOptions.postUrl =
    },
    methods: {
        handleResult ({ data }) {
            if (data.success) {
                this.$root.$emit('toast', '创建成功')
                if (this.$listeners && this.$listeners.success) {
                    this.$listeners.success(data)
                }
            } else {
                this.$root.$emit('toast', `创建失败：${data.msg}`)
                if (this.$listeners && this.$listeners.failed) {
                    this.$listeners.failed(data)
                }
            }
        },
        handleError (err) {
            this.$root.$emit('toast', `创建失败：${err.message}`)
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
