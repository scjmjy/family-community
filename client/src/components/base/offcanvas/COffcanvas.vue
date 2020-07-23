<template>
<nav ref="navCollapse" tabindex="-1" class="nav-collapse offcanvas-collapse h-100" :class="clzz">
    <slot/>
</nav>
</template>

<script>
// type OffcanvasOptions = {
//     direction: 'left' | 'right';
//     expand: 'collapse-expand-sm' | 'collapse-expand-md' | 'collapse-expand-lg' |'collapse-expand-xl';
// }

export default {
    name: 'COffcanvas',
    props: ['direction', 'expand', 'toggle'],
    data () {
        return {
        }
    },
    computed: {
        clzz () {
            return {
                'offcanvas-left': this.direction === 'left',
                'offcanvas-right': this.direction === 'right',
                [this.expand]: true
            }
        }
    },
    methods: {
        isMenuShown() {
            return $(this.$refs.navCollapse).hasClass('open')
        }
    },
    mounted() {
        $('[data-toggle="offcanvas"]').on('click', () => {
            const el = $(this.$refs.navCollapse)
            if (el.css('position') !== 'static') {
                el.toggleClass('open')
            }
        })
    },
    watch: {
        toggle() {
            $('[data-toggle="offcanvas"]').trigger('click')
        }
    }
}
</script>

<style scoped>
.offcanvas-collapse {
  z-index: 2000;
  position: fixed;
  top: 56px; /* Height of navbar */
  bottom: 0;
  width: 320px;
  /* width: 80%; */
  padding-right: 1rem;
  padding-left: 1rem;
  overflow-y: auto;
  visibility: hidden;
  background-color: #343a40d8;
  transition: visibility 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
}
/* .offcanvas-collapse.open {
  visibility: visible;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
} */

.offcanvas-collapse.offcanvas-left {
  right: 100%;
}

.offcanvas-collapse.offcanvas-left.open {
  visibility: visible;
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}

.offcanvas-collapse.offcanvas-right {
  left: 100%;
}
.offcanvas-collapse.offcanvas-right.open {
  visibility: visible;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}

@media (min-width: 576px) {
/* .offcanvas-collapse {
    width: 75%;
} */
.offcanvas-expand-sm.offcanvas-collapse {
position: static;
visibility: visible;
}
.offcanvas-expand-sm.offcanvas-collapse.offcanvas-left.open {
-webkit-transform: none;
transform: none;
}
.offcanvas-expand-sm.offcanvas-collapse.offcanvas-right.open {
-webkit-transform: none;
transform: none;
}
}

@media (min-width: 768px) {
/* .offcanvas-collapse {
    width: 70%;
} */
.offcanvas-expand-md.offcanvas-collapse {
position: static;
visibility: visible;
}
.offcanvas-expand-md.offcanvas-collapse.offcanvas-left.open {
-webkit-transform: none;
transform: none;
}
.offcanvas-expand-md.offcanvas-collapse.offcanvas-right.open {
-webkit-transform: none;
transform: none;
}
}

@media (min-width: 992px) {
/* .offcanvas-collapse {
    width: 60%;
} */
.offcanvas-expand-lg.offcanvas-collapse {
position: static;
visibility: visible;
}
.offcanvas-expand-lg.offcanvas-collapse.offcanvas-left.open {
-webkit-transform: none;
transform: none;
}
.offcanvas-expand-lg.offcanvas-collapse.offcanvas-right.open {
-webkit-transform: none;
transform: none;
}
}

@media (min-width: 1200px) {
/* .offcanvas-collapse {
    width: 40%;
} */
.offcanvas-expand-xl.offcanvas-collapse {
position: static;
visibility: visible;
}
.offcanvas-expand-xl.offcanvas-collapse.offcanvas-left.open {
-webkit-transform: none;
transform: none;
}
.offcanvas-expand-xl.offcanvas-collapse.offcanvas-right.open {
-webkit-transform: none;
transform: none;
}
}
.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}

.nav-scroller .nav {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.nav-underline .nav-link {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.nav-underline .nav-link:hover {
  color: #007bff;
}

.nav-underline .active {
  font-weight: 500;
  color: #343a40;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5);
}

.bg-purple {
  background-color: #6f42c1;
}

.lh-100 {
  line-height: 1;
}
.lh-125 {
  line-height: 1.25;
}
.lh-150 {
  line-height: 1.5;
}
</style>
