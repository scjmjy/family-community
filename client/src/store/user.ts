import axios from 'axios'

import { UserClient } from './types/user_types'
import { ChatManager } from './types/chats'
import Cookies from './types/cookies'

export default {
    namespaced: true,
    state: {
        vm: null,
        userClient: new UserClient(),
        currentChannel: { channel: 0, func: 0 },
        chats: new ChatManager(),
        selectedUserId: ''
    },
    getters: {
        isAnonymous(state) {
            return state.userClient._id === 'anonymous'
        },
        hasFamily(state) {
            return state.userClient.family._id !== ''
        },
        isCurrentChannelSelf(state) {
            return state.selectedUserId === state.userClient._id
        },
        isCurrentChannelFamily(state) {
            return state.selectedUserId === state.userClient.family._id
        },
        familyCoverImgs(state) {
            return UserClient.RandomImgs(state.userClient.family.galleries, 5)
        },
        userCoverImgs(state, getters) {
            if (getters.isCurrentChannelFamily) {
                return []
            }
            let galleries
            if (getters.isCurrentChannelSelf) {
                galleries = state.userClient.galleries
            } else {
                const member = state.userClient.family.members.find(m => m._id === state.selectedUserId)
                if (!member || !member.galleries) {
                    return []
                }
                galleries = member.galleries
            }
            return UserClient.RandomImgs(galleries, 5)
        }
    },
    mutations: {
        init(state, vm) {
            state.vm = vm
            state.selectedUserId = state.userClient.channels[state.currentChannel.channel]._id
        },
        setChannels(state, channels) {
            state.userClient.channels = channels
            state.selectedUserId = state.userClient.channels[state.currentChannel.channel]._id
        },
        setUserClient(state, user) {
            state.userClient.freshAll(user)
            if (!state.chats.isInit()) {
                state.chats.init(state.userClient, state.vm)
            }
            state.selectedUserId = state.userClient.channels[state.currentChannel.channel]._id
        },
        setFamilyClient(state, family) {
            state.userClient.freshFamily(family)
            if (!state.chats.isInit()) {
                state.chats.init(state.userClient, state.vm)
            }
        },
        setFamilyMember(state, user) {
            state.userClient.freshMember(user)
        },
        clearUserClient(state) {
            state.userClient = new UserClient()
            if (state.chats.isInit()) {
                state.chats.uninit()
            }
        },
        setGallery(state, data) { // 一般用于创建家庭或个人相册成功后，添加新创建的相册
            return state.userClient.freshGalleries(data)
        },
        setPersonalChats(state, chatsServer) {
            if (state.chats) {
                state.chats.setPersonalChats(chatsServer)
            }
        },
        setChannel(state, { channel, func }) {
            if (channel) {
                state.currentChannel.channel = channel
                state.selectedUserId = state.userClient.channels[channel]._id
            }
            if (func) {
                state.currentChannel.func = func
            }
            state.vm.$emit('channel-changed', state.currentChannel)
        }
    },
    actions: {
        initUserClient({ commit, dispatch }) {
            const cookies = Cookies.getCookiesMap()
            if (cookies.get('sid') && cookies.get('uid')) {
                axios
                    .post('/api/user/signin', { msg: 'restore from sid' })
                    .then(({ data }) => {
                        commit('setUserClient', data.data)
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }
        },
        updateFamilyGalleries({ state, commit }) {
            return state.userClient.updateFamilyGalleries()
        },
        updateUserGalleries({ state, commit }, uid) {
            return state.userClient.updateUserGalleries(uid)
        },
        updateFamilyChats({ state, commit }) {
            // uid： 其他成员
            state.chats.updateFamilyChats()
        },
        updatePersonalChats({ state, commit }, uid) {
            // uid： 其他成员
            state.chats.updatePersonalChats(uid)
        },
        historyFamilyChats({ state }) {
            return state.chats.historyFamilyChats()
        },
        historyPersonalChats({ state }, uid) {
            return state.chats.historyPersonalChats(uid)
        },
        sendMsgTo({ state, commit }, { uid, msg }) {
            return state.chats.sendTo(uid, msg)
        },
        sendMsgToFamily({ state, commit }, { msg }) {
            return state.chats.sendToFamily(msg)
        },
        sendImgMsgTo({ state, commit }, { uid, data }) {
            return state.chats.sendTo(uid, data)
        }
    }
}
