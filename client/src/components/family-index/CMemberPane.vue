<template>
<div class="container">
    <h4 class="text-center">{{ title }}</h4>
    <div class="row justify-content-center">
        <div v-for="(member,index) of members" :key="index" class="media  my-1 col-8 col-sm-6 col-md-4">
            <img class="rounded-circle" :src="member.avatarThumb" alt />
            <div class="media-body">
                <span class="badge badge-info text-white mx-2">{{ member.nickname }}</span>
                <!-- <span class="badge badge-danger text-white">{{ member.role }}</span> -->
                <p class="text-wrap mb-0">{{ member.description }}</p>
            </div>
        </div>
        <div class="media  my-1 col-8 col-sm-6 col-md-4" data-toggle="modal" role="button" data-target="#id-dialog-user-invite">
            <img class="rounded-circle" src="img/user-invite-64x64.png" alt />
            <div class="media-body">
                <span class="h3 badge badge-danger text-white mx-2">邀请新成员</span>
            </div>
        </div>
    </div>
    <CInviteMember id="id-dialog-user-invite"/>
</div>
</template>

<script>
import CInviteMember from './CInviteMember.vue'

export default {
    name: 'CMemberPane',
    props: ['members', 'title'],
    components: { CInviteMember },
    data () {
        return {

        }
    }
}
</script>

<style>

</style>
