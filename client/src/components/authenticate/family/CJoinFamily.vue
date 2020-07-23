<template>
  <div class="container-join-family">
    <CMsgInput class="" v-model="keyword" @send="handleSend" placeholder="输入家庭名字" btnName="搜索"/>
    <span class="text-muted p-1">Tip:输入'.'显示所有家庭</span>
    <div v-if="showSearchResult" class="p-4" style="min-height: 60vh; max-height:60vh; overflow: auto">
        <div v-if="families && families.length == 0">
            搜索结果：0个
        </div>
        <CFamilyItem v-for="(f, index) of families" :key="index" :family="f" class="mb-2 bg-light" @joinSuccess="joinSuccess" @joinFailed="joinFailed" />
    </div>
    <footer class="text-center">
        <button class="btn btn-link text-primary" @click="handleCancel">⇦创建家庭</button>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'

import CMsgInput from '../../base/chat/CMsgInput'
import CFamilyItem from './CFamilyItem'

export default {
    name: 'CJoinFamily',
    components: { CMsgInput, CFamilyItem },
    data () {
        return {
            keyword: '',
            families: null,
            showSearchResult: false
        }
    },
    methods: {
        handleSend () {
            this.families = null
            if (this.keyword.length > 0) {
                axios.get(`/api/family/search?key=${this.keyword}`)
                    .then(({ data }) => {
                        this.keyword = ''
                        this.families = data.data || []
                        this.showSearchResult = true
                        if (!data.success) {
                            this.$root.$emit('toast', `搜索失败：${data.msg}`)
                        }
                    }).catch(err => {
                        this.$root.$emit('toast', `搜索失败：${err.message}`)
                    })
            }
        },
        handleCancel () {
            this.$listeners && this.$listeners.cancel && this.$listeners.cancel()
        },
        joinSuccess() {
            this.$listeners && this.$listeners.joinSuccess && this.$listeners.joinSuccess()
        },
        joinFailed() {
            this.$listeners && this.$listeners.joinFailed && this.$listeners.joinFailed()
        }
    }
}
</script>
