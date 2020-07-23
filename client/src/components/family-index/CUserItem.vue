<template>
<div class="row rounded p-2">
    <img class="col-auto px-0 rounded size-square-res-sm" :src="user.avatarThumb" alt />
    <div class="col">
        <div class="d-flex flex-column h-100 justify-content-between">
            <div>
                <h5>{{ user.nickname }}</h5>
                <p class="text-truncate">{{ user.description }}</p>
            </div>
            <div v-if="user.family && user.family._id">
                <img :src="user.family.avatarThumb" :title="user.family.name" class="rounded size-square-res-xxs mr-1"/>
            </div>
        </div>
    </div>
    <div class="col-auto">
        <div class="d-flex flex-column h-100 justify-content-center">
            <button class="btn btn-primary" @click="invite(user._id)">邀请</button>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
    name: 'CUserItem',
    props: ['user'],
    methods: {
        ...mapMutations('user', [
            'setFamilyMember'
        ]),
        invite (uid) {
            axios.get(`/api/user/${uid}/invite`)
                .then(({ data }) => {
                    if (data.success) {
                        this.$root.$emit('toast', '邀请成功，请等待对方同意【由于测试期间，所以直接加入了】')
                        this.$listeners && this.$listeners.inviteSuccess && this.$listeners.inviteSuccess(data)
                        this.setFamilyMember(data.data)
                    } else {
                        throw new Error(data.msg)
                    }
                })
                .catch(err => {
                    this.$listeners && this.$listeners.failed && this.$listeners.failed()
                    this.$root.$emit('toast', `申请失败：${err.message}`)
                })
        }
    }
}
</script>

<style>

</style>
