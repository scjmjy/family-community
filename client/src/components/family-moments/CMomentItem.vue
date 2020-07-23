<template>
<div class="container-moment-item">
    <div class="media">
        <img :src="moment.sender.avatar" alt="">
        <div class="media-body ml-1">
            <span class="d-block mb-1 h5">{{ moment.sender.name }}</span>
            <span class="d-block mb-1">{{ moment.content }}</span>
            <template v-for="(img,index) in moment.imgs">
                <span class="d-inline-block w-60px h-60px w-md-80px h-md-80px w-xl-100px h-xl-100px m-1" :key="index" role="button" @click="handleClickImg(index)">
                    <img :src="img" class="img-ratio"/>
                </span>
                <br v-if="(index+1)%3 == 0" :key="img">
            </template>
            <div class="d-flex justify-content-between">
                <span>{{ moment.createdAt }}</span>
                <button :id="`id-${moment.id}`" type="button" class="btn btn-link fa fa-ellipsis-h"></button>
            </div>
            <div v-if="moment.stars.length > 0" class="moment-stars fa fa-heart-o">
                <span v-for="(s,i) in moment.stars" :key="i">
                    {{ s.name + (i== moment.stars.length-1 ? '' : ',') }}
                </span>
            </div>
            <div v-if="moment.comments.length > 0" class="moment-comments mt-1">
                <div v-for="(c,i) in moment.comments" :key="i" class="media">
                    <img :src="c.avatar" class="img-fluid">
                    <div class="media-body">
                        <p>{{ c.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    inheritAttrs: false,
    name: 'CMomentItem',
    props: ['options'],
    computed: {
        moment () {
            return this.options.moment
        },
        starTmpl () {
            return `
            <div class="d-flex justify-content-between px-2">
                <span role="button" class="fa fa-heart-o">&nbsp;赞</span>
                <span role="button" class="fa fa-commenting-o ml-5">&nbsp;评论</span>
            </div>`
        }
    },
    methods: {
        handleClickStar () {
            this.$listeners.star && this.$listeners.star(this.options)
        },
        handleClickComment () {
            this.$listeners.comment && this.$listeners.comment(this.options, this.$el)
        },
        handleClickImg (index) {
            this.$listeners.image && this.$listeners.image(this.options, index)
        }
    },
    mounted () {
        const tmpl = $(this.starTmpl)
        const hanlderStar = this.handleClickStar
        $(`#id-${this.moment.id}`).popover({
            trigger: 'focus',
            html: true,
            content: tmpl
        })
        tmpl.on('click', '.fa-heart-o', () => {
            hanlderStar()
        })
        const hanlderComment = this.handleClickComment
        tmpl.on('click', '.fa-commenting-o', () => {
            hanlderComment()
        })
    }
}
</script>

<style scoped>
.moment-stars {
    padding: 5px;
    background-color: rgba(192, 192, 192, 0.877);
    border: 1px  solid slategray;
    border-radius: 4px;
}
.moment-comments {
    background-color: rgba(192, 192, 192, 0.877);
    border: 1px  solid slategray;
    border-radius: 4px;
    padding: 5px;
}
</style>
