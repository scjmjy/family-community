<template>
<div class="carousel slide" :id="elId">
    <ol v-if="slideOptions.indicators" class="carousel-indicators">
        <li v-for="(slot,index) of slots" :key="index" :data-target="'#'+elId" :data-slide-to="index"></li>
    </ol>
    <div class="carousel-inner">
        <div class="carousel-item" :class="{ active: index == slideOptions.initialActive }" v-for="(slot,index) of slots" :key="index">
            <slot :name="slot"/>
        </div>
    </div>
  <a v-if="slideOptions.prev_next" class="carousel-control-prev" :href="'#'+elId" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a v-if="slideOptions.prev_next" class="carousel-control-next" :href="'#'+elId" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
</template>

<script>
export class SlideOptions {
    constructor (initialActive = 0, // 基于0的索引
        autoplay = false,
        interval = false,
        indicators = false,
        prev_next = false,
        cycle = false) {
        this.initialActive = initialActive
        this.autoplay = autoplay
        this.interval = interval
        this.indicators = indicators
        this.prev_next = prev_next
        this.cycle = cycle
    }
}

export class CarsouelOptions {
    constructor (elId,
        slots,
        slideTo = 0, // 基于0的索引
        slideOptions = new SlideOptions()) {
        this.elId = elId
        this.slots = slots
        this.slideTo = slideTo
        this.slideOptions = slideOptions
    }
}

export default {
    name: 'CCarouselBase',
    props: ['elId', 'slots', 'slideTo', 'slideOptions'],
    data () {
        return {
        }
    },
    methods: {
        initCarousel () {
            $(this.$el).carousel({
                ride: this.slideOptions.autoplay ? 'carousel' : false,
                interval: this.slideOptions.interval,
                wrap: this.slideOptions.cycle
            })
            $(this.$el).carousel(this.slideOptions.initialActive)
        }
    },
    mounted () {
        this.initCarousel()
    },
    watch: {
        slideTo (newV, oldV) {
            $(this.$el).carousel(newV)
        },
        slideOptions: {
            handler (newOpts, oldOpts) {
                this.initCarousel()
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style>

</style>
