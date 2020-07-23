<template>
<nav class="col-auto px-0 h-100">
    <COffcanvas ref="menu" id="id-nav-left-menu" v-bind="offcanvaOptions" @click.self.native="hideLeftMenu" :toggle="toggleMenu">
        <div class="row mt-2">
            <div class="col-auto pr-2 border-right border-light">
                <div id="id-nav-channel" class="nav flex-column nav-pills"  role="tablist" aria-orientation="vertical">
                    <a v-for="(channel,index) of channels" :key="index" class="nav-link" :class="{active:channel.active}" id="v-pills-home-tab" data-toggle="pill" :href="'#id-'+channel.name" role="tab" @click="stageChannel(index)" aria-controls="v-pills-home" aria-selected="true">
                        <img class="img-fluid rounded w-40px h-40px w-md-60px h-md-60px w-lg-80 h-lg-80 w-xl-100px h-xl-100px" :src="channel.avatarThumb" alt />
                    </a>
                </div>
            </div>
            <div class="col pl-1">
                <div ref="tabFunction" class="tab-content" id="id-nav-function">
                    <div v-for="(channel,index) of channels" :key="index" class="tab-pane fade show" :class="{active:channel.active}" :id="'id-'+channel.name" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <div v-for="(func,i) in channel.functions" :key="i" class="media rounded ml-1 my-2 p-1" :class="{active:func.active}" role="button" @click.stop="changeFunction($event, func.compoName, func.bgurl, i)">
                            <img class="rounded-circle  w-40px h-40px w-md-60px h-md-60px w-lg-80 h-lg-80" :src="func.imgurl" alt />
                            <div class="media-body ml-1">
                                <h6 class="text-white">{{ func.name }}</h6>
                                <p class="text-truncate">{{ func.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </COffcanvas>
</nav>
</template>

<script>
import COffcanvas from './base/offcanvas/COffcanvas'
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'CLeftMenu',
    props: ['channels'],
    components: { COffcanvas },
    data () {
        return {
            offcanvaOptions: { expand: 'offcanvas-expand-lg', direction: 'left' },
            toggleMenu: true,
            stagedChannel: -1
        }
    },
    computed: {
        ...mapState('user', {
            currentChannel: state => state.currentChannel
        })
    },
    methods: {
        ...mapMutations('user', [
            'setChannel'
        ]),
        changeFunction (event, compoName, bgurl, i) {
            $(this.$el).find('.media.active').removeClass('active')
            $(event.currentTarget).addClass('active')
            if (this.stagedChannel !== -1) {
                this.setChannel({ channel: this.stagedChannel, func: i })
                this.statedChannel = -1
            } else {
                this.setChannel({ func: i })
            }
            this.$emit('EventClickFunction', compoName, bgurl)
        },
        stageChannel(index) {
            this.stagedChannel = index
        },
        hideLeftMenu () {
            if (this.$refs.menu.isMenuShown()) {
                this.toggleMenu = !this.toggleMenu
            }
        }
    },
    mounted () {
        $($('a[data-toggle="pill"].active').attr('href')).find('.media.active').trigger('click')
    }
}
</script>

<style scoped>
.media.active {
    background-color:rgba(128, 128, 128, 0.555);
}
</style>
