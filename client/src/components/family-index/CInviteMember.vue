<template>
<CDialogBase v-bind="dialogOptions">
    <template #body>
        <CMsgInput class="" v-model="keyword" @send="handleSend" placeholder="输入昵称" btnName="搜索"/>
        <div v-if="showSearchResult" class="p-4" style="min-height: 60vh; max-height:60vh; overflow: auto">
            <div v-if="users && users.length == 0">
                搜索结果：0个
            </div>
            <CUserItem v-for="(user, index) of users" :key="index" :user="user" class="mb-2 bg-light" @inviteSuccess="handleInviteSuccess" />
        </div>
    </template>
</CDialogBase>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from 'axios'

import CDialogBase, { DialogOptions } from '../base/dialog/CDialogBase.vue'
import CUserItem from './CUserItem'
import CMsgInput from '../base/chat/CMsgInput'

export default {
    name: 'CInviteMember',
    components: { CDialogBase, CUserItem, CMsgInput },
    data () {
        return {
            dialogOptions: new DialogOptions('center', true, '邀请家庭成员', false),
            keyword: '',
            users: null,
            showSearchResult: false
        }
    },
    methods: {
        handleInviteSuccess (data) {
            $(this.$el).modal('hide')
        },
        handleSend () {
            this.users = null
            if (this.keyword.length > 0) {
                axios.get(`/api/user/search?key=${this.keyword}`)
                    .then(({ data }) => {
                        this.keyword = ''
                        this.users = data.data || []
                        this.showSearchResult = true
                        if (!data.success) {
                            this.$root.$emit('toast', `搜索失败：${data.msg}`)
                        }
                    }).catch(err => {
                        this.$root.$emit('toast', `搜索失败：${err.message}`)
                    })
            }
        }
    }
}
</script>

<style>

</style>
