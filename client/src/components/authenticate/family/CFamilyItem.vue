<template>
<div class="row rounded p-2">
    <img class="col-auto px-0 rounded size-square-res-sm" :src="family.avatarThumb" alt />
    <div class="col">
        <div class="d-flex flex-column h-100 justify-content-between">
            <div>
                <h5>{{ family.name }}</h5>
                <p class="text-truncate">{{ family.description }}</p>
            </div>
            <div>
                <img v-for="(m,index) of family.members" :key="index" :src="m.avatarThumb" :title="m.nickname" class="rounded size-square-res-xxs mr-1"/>
            </div>
        </div>
    </div>
    <div class="col-auto">
        <div class="d-flex flex-column h-100 justify-content-center">
            <button class="btn btn-primary" @click="join(family._id)">加入</button>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
    name: 'CFamilyItem',
    props: ['family'],
    methods: {
        ...mapMutations('user', [
            'setFamilyClient'
        ]),
        join (fid) {
            axios.get(`/api/family/${fid}/join`)
                .then(({ data }) => {
                    if (data.success) {
                        this.$root.$emit('toast', '申请成功，请等待对方同意【由于测试期间，所以直接加入了】')
                        this.$listeners && this.$listeners.joinSuccess && this.$listeners.joinSuccess()
                        this.setFamilyClient(data.data)
                    } else {
                        throw new Error(data.msg)
                    }
                })
                .catch(err => {
                    this.$listeners && this.$listeners.joinFailed && this.$listeners.joinFailed()
                    this.$root.$emit('toast', `申请失败：${err.message}`)
                })
        }
    }
}
</script>

<style>

</style>
