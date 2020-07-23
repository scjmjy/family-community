<template>
<div>
    <form action="" method="post" @submit.prevent="handleSubmit" novalidate>
        <div v-for="g of options.groups" :key="g.input.eid" class="form-group">
            <div class="input-group">
                <div class="input-group-prepend">
                    <label :for="g.input.eid" class="input-group-text w-40px w-md-80px w-xl-100px"><i class="mx-auto" :class="g.preIconClzz"></i><span v-if="g.required" class="text-danger">*</span></label>
                </div>
                <div v-if="g.input.type == 'image'" class="custom-file">
                    <input type="file" :id="g.input.eid" accept="image/png,image/jpeg" capture= "camera" class="custom-file-input" :name="g.input.name" @change="prepareCrop($event, g.input)"/>
                    <label class="custom-file-label text-left text-muted" :for="g.input.eid" data-browse="选择图片">{{ imgnameToClip || g.input.placeholder }}</label>
                </div>
                <select v-else-if="g.input.type == 'select'" :name="g.input.name" class="custom-select" :id="g.input.eid">
                    <option value="" selected>{{ g.input.placeholder }}</option>
                    <option v-for="(o,index) of g.input.options" :key="index" :value="o.value">{{ o.name }}</option>
                </select>
                <input v-else :type="g.input.type" :id="g.input.eid" class="form-control" :name="g.input.name" :placeholder="g.input.placeholder" @focus="handleFocus($event, g.rules)" @blur="handleBlur" :disabled="g.input.disabled" v-model="g.input.value"/>

                <div v-if="showTips && g.rules && g.rules.length > 0" class="invalid-feedback">
                    <template v-for="(r,i) in g.rules">
                        <span v-if="r.pass === false" :key="i" class="pr-1">
                            {{ r.tip }}
                        </span>
                    </template>
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="form-group text-center">
                <button type="submit" class="btn btn-primary">{{ options.submit.verb }}</button>
            </div>
        </div>
    </form>
    <component :is="imgClipCompo" :imgurl="imgurlToClip" @cancel="cancelCrop" @crop="setCropData"/>
</div>
</template>

<script>
import axios from 'axios'
const CImgClip = () => import('../image/CImgClip.vue')

export default {
    name: 'CFormBase',
    props: ['options'],
    components: { CImgClip },
    data () {
        return {
            showTips: false,
            imgurlToClip: '',
            imgClipCompo: '',
            imgnameToClip: null,
            currentImageInput: null
        }
    },
    computed: {

    },
    destroyed () {
        if (this.imgurlToClip) {
            URL.revokeObjectURL(this.imgurlToClip)
        }
    },
    methods: {
        post () {
            let data
            if (this.options.encode === undefined || this.options.encode === 'json') {
                data = {}
                this.options.groups.forEach(g => {
                    const $el = $('#' + g.input.eid)
                    data[g.input.name] = $el.val().trim()
                })
                if (this.$listeners && this.$listeners.prePost) {
                    const fields = this.$listeners.prePost()
                    fields.forEach(f => {
                        data[f.fieldname] = f.value
                    })
                }
            } else if (this.options.encode === 'form-data') {
                data = new FormData()
                this.options.groups.forEach(g => {
                    const $el = $('#' + g.input.eid)
                    if (g.input.type === 'image') {
                        data.append(g.input.name, g.input.imgBlob)
                    } else {
                        data.append(g.input.name, $el.val().trim())
                    }
                })
                if (this.$listeners && this.$listeners.prePost) {
                    const fields = this.$listeners.prePost()
                    fields.forEach(f => {
                        data.append(f.fieldname, f.value)
                    })
                }
            } else {
                throw new Error('不支持的表单格式')
            }

            const _ls = this.$listeners
            axios.post(this.options.postUrl, data)
                .then(v => {
                    _ls && _ls.result && _ls.result(v) // post成功，返回了服务器的数据
                })
                .catch(err => {
                    _ls && _ls.error && _ls.error(err) // 没有post成功
                })
        },
        prepareCrop (event, input) {
            const file = event.target.files[0]
            if (file) {
                if (this.imgurlToClip) {
                    URL.revokeObjectURL(this.imgurlToClip)
                }
                this.currentImageInput = input
                this.imgnameToClip = file.name
                this.imgurlToClip = URL.createObjectURL(file)
                this.imgClipCompo = 'CImgClip'
            }
        },
        cancelCrop () {
            this.imgnameToClip = null
            URL.revokeObjectURL(this.imgurlToClip)
            this.imgurlToClip = ''
            this.imgClipCompo = ''
            this.currentImageInput.imgBlob = null
            $(`#${this.currentImageInput.eid}`).val('')
            this.currentImageInput = null
        },
        setCropData (blob) {
            this.currentImageInput.imgBlob = blob
            this.currentImageInput = null
            URL.revokeObjectURL(this.imgurlToClip)
            this.imgurlToClip = ''
            this.imgClipCompo = ''
        },
        handleFocus (event, rules) {
            if (this.showTips) {
                this._watchInputChanged($(event.target), rules)
            }
        },
        handleBlur (event) {
            this._unwatchInputChanged($(event.target))
        },
        handleSubmit (event) {
            event.preventDefault()
            if (this.$listeners && this.$listeners.preSubmit && !this.$listeners.preSubmit()) {
                return // 父级组件不让submit
            }
            this.showTips = true
            let $firstInvalidEl = null

            for (const g of this.options.groups) {
                if (g.input.disabled) { // 如果input是disabled的，说明希望直接把value传给服务端
                    continue
                }
                const $el = $('#' + g.input.eid)

                const content = $el.val().trim()
                if (this._testRules($el, content, g.rules)) {
                    //
                } else {
                    if ($firstInvalidEl === null) $firstInvalidEl = $el
                }
            }

            if ($firstInvalidEl) {
                $firstInvalidEl[0].scrollIntoViewIfNeeded(true)
            } else {
                // axios
                this.post()
            }
        },
        _makeInvalid ($el) {
            $el.removeClass('is-valid')
            $el.addClass('is-invalid')
        },
        _makeValid ($el) {
            $el.removeClass('is-invalid')
            $el.addClass('is-valid')
        },
        _unwatchInputChanged ($el) {
            $el.off('input')
        },
        _watchInputChanged ($el, rules) {
            const test = this._testRules
            $el.off('input')
            $el.on('input', (e) => {
                const content = $el.val().trim()
                test($el, content, rules)
            })
        },
        _testRules ($el, content, rules) {
            if (!rules) {
                return true
            }
            let passAllRules = true
            for (let indexRule = 0; indexRule < rules.length; indexRule++) {
                const r = rules[indexRule]
                let passRule = false
                if (r.patterns && r.patterns.length > 0) {
                    for (let index = 0; index < r.patterns.length; index++) {
                        const p = r.patterns[index]
                        if (p.test(content)) {
                            passRule = true
                            break // 如果有一个pattern通过，整个rule就通过
                        }
                    }
                } else {
                    // 如果 r.patterns 不存在或者为空数组，那么意味着测试用户输入的内容是否为空
                    passRule = content.length > 0
                }
                if (passRule) {
                    r.pass = passRule
                    this._makeValid($el)
                } else {
                    this._makeInvalid($el)
                    passAllRules = false // 如果有一个rule没有通过，整个rules就没有通过
                    r.pass = passRule
                    if (r.stop) {
                        break
                    }
                }
            }
            return passAllRules
        }
    }
}
</script>

<style>

</style>
