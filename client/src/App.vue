<template>
    <router-view></router-view>
</template>

<script>
export default {
    name: 'App',
    data () {
        return {
            $toastBodyEl: null,
            $toastEl: null
        }
    },
    methods: {
        toast (msg) {
            if (!this.$toastEl) {
                const toastHtml =
                `<div class="toast fixed-top mx-auto" style="z-index:10000;margin-top:30%" data-delay="2000" role="alert" aria-live="assertive" aria-atomic="true">
                    <p class="toast-body text-center">
                    </p>
                 </div>`
                this.$toastEl = $(toastHtml)
                this.$toastBodyEl = this.$toastEl.find('.toast-body')
                $('body').append(this.$toastEl)
            }
            this.$toastBodyEl.html(msg)
            this.$toastEl.toast('show')
        }
    },
    created () {
        const t = this.toast
        this.$root.$on('toast', function (msg) {
            t(msg || '')
        })
    }
}
</script>

<style>
html,
body {
    height: 100%;
    overflow-x: hidden; /* Prevent scroll on narrow devices */
}

body {
    padding-top: 56px;
    position: relative;
}

.img-ratio {
    max-width: 100%;
    max-height: 100%;
}
/* .container-toast {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
} */

.w-40px {
    width: 40px;
}
.h-40px {
    height: 40px;
}
.w-60px {
    width: 60px;
}
.h-60px {
    height: 60px;
}
.w-80px {
    width: 80px;
}
.h-80px {
    height: 80px;
}
.w-100px {
    width: 80px;
}
.h-100px {
    height: 80px;
}

.mw-50 {
    max-width: 50%;
}

.mw-75 {
    max-width: 75%;
}

.mh-50 {
    max-height: 50%;
}
.mh-75 {
    max-height: 75%;
}

.w-r-25 {
    width: 25%;
}
.h-r-25 {
    height: 25%;
}

.w-r-50 {
    width: 50%;
}
.h-r-50 {
    height: 50%;
}

.w-r-75 {
    width: 75%;
}
.h-r-75 {
    height: 75%;
}

.w-r-100 {
    width: 100%;
}
.h-r-100 {
    height: 100%;
}

.size-square-res-xxs {
    width: 20px!important;
    height: 20px!important;
}
.size-square-res-xs {
    width: 40px!important;
    height: 40px!important;
}
.size-square-res-sm {
    width: 60px!important;
    height: 60px!important;
}
.size-square-res-md {
    width: 80px!important;
    height: 80px!important;
}
.size-square-res-lg {
    width: 100px!important;
    height: 100px!important;
}
.size-square-res-xl {
    width: 120px!important;
    height: 120px!important;
}

@media (min-width: 576px) {
.w-sm-40px {
    width: 40px;
}
.h-sm-40px {
    height: 40px;
}
.w-sm-60px {
    width: 60px;
}
.h-sm-60px {
    height: 60px;
}
.w-sm-80px {
    width: 80px;
}
.h-sm-80px {
    height: 80px;
}
.w-sm-100px {
    width: 80px;
}
.h-sm-100px {
    height: 80px;
}

.w-sm-25 {
    width: 25%;
}
.h-sm-25 {
    height: 25%;
}
.w-sm-50 {
    width: 50%;
}
.h-sm-50 {
    height: 50%;
}
.w-sm-75 {
    width: 75%;
}
.h-sm-75 {
    height: 75%;
}
.w-sm-100 {
    width: 100%;
}
.h-sm-100 {
    height: 100%;
}
.size-square-res-xxs {
    width: 30px!important;
    height: 30px!important;
}
.size-square-res-xs {
    width: 60px!important;
    height: 60px!important;
}
.size-square-res-sm {
    width: 80px!important;
    height: 80px!important;
}
.size-square-res-md {
    width: 100px!important;
    height: 100px!important;
}
.size-square-res-lg {
    width: 120px!important;
    height: 120px!important;
}
.size-square-res-xl {
    width: 140px!important;
    height: 140px!important;
}
}

@media (min-width: 768px) {
.w-md-40px {
    width: 40px;
}
.h-md-40px {
    height: 40px;
}
.w-md-60px {
    width: 60px;
}
.h-md-60px {
    height: 60px;
}
.w-md-80px {
    width: 80px;
}
.h-md-80px {
    height: 80px;
}
.w-md-100px {
    width: 80px;
}
.h-md-100px {
    height: 80px;
}
.w-md-25 {
    width: 25%;
}
.h-md-25 {
    height: 25%;
}
.w-md-50 {
    width: 50%;
}
.h-md-50 {
    height: 50%;
}
.w-md-75 {
    width: 75%;
}
.h-md-75 {
    height: 75%;
}
.w-md-100 {
    width: 100%;
}
.h-md-100 {
    height: 100%;
}
.size-square-res-xxs {
    width: 40px!important;
    height: 40px!important;
}
.size-square-res-xs {
    width: 80px!important;
    height: 80px!important;
}
.size-square-res-sm {
    width: 100px!important;
    height: 100px!important;
}
.size-square-res-md {
    width: 120px!important;
    height: 120px!important;
}
.size-square-res-lg {
    width: 140px!important;
    height: 140px!important;
}
.size-square-res-xl {
    width: 160px!important;
    height: 160px!important;
}
}

@media (min-width: 992px) {
.w-lg-40px {
    width: 40px;
}
.h-lg-40px {
    height: 40px;
}
.w-lg-60px {
    width: 60px;
}
.h-lg-60px {
    height: 60px;
}
.w-lg-80px {
    width: 80px;
}
.h-lg-80px {
    height: 80px;
}
.w-lg-100px {
    width: 80px;
}
.h-lg-100px {
    height: 80px;
}
.w-lg-25 {
    width: 25%;
}
.h-lg-25 {
    height: 25%;
}
.w-lg-50 {
    width: 50%;
}
.h-lg-50 {
    height: 50%;
}
.w-lg-75 {
    width: 75%;
}
.h-lg-75 {
    height: 75%;
}
.w-lg-100 {
    width: 100%;
}
.h-lg-100 {
    height: 100%;
}
.size-square-res-xxs {
    width: 50px!important;
    height: 50px!important;
}
.size-square-res-xs {
    width: 100px!important;
    height: 100px!important;
}
.size-square-res-sm {
    width: 120px!important;
    height: 120px!important;
}
.size-square-res-md {
    width: 140px!important;
    height: 140px!important;
}
.size-square-res-lg {
    width: 160px!important;
    height: 160px!important;
}
.size-square-res-xl {
    width: 180px!important;
    height: 180px!important;
}
}

@media (min-width: 1200px) {
.w-xl-40px {
    width: 40px;
}
.h-xl-40px {
    height: 40px;
}
.w-xl-60px {
    width: 60px;
}
.h-xl-60px {
    height: 60px;
}
.w-xl-80px {
    width: 80px;
}
.h-xl-80px {
    height: 80px;
}
.w-xl-100px {
    width: 80px;
}
.h-xl-100px {
    height: 80px;
}
.w-xl-25 {
    width: 25%;
}
.h-xl-25 {
    height: 25%;
}
.w-xl-50 {
    width: 50%;
}
.h-xl-50 {
    height: 50%;
}
.w-xl-75 {
    width: 75%;
}
.h-xl-75 {
    height: 75%;
}
.w-xl-100 {
    width: 100%;
}
.h-xl-100 {
    height: 100%;
}
.size-square-res-xxs {
    width: 60px!important;
    height: 60px!important;
}
.size-square-res-xs {
    width: 120px!important;
    height: 120px!important;
}
.size-square-res-sm {
    width: 140px!important;
    height: 140px!important;
}
.size-square-res-md {
    width: 160px!important;
    height: 160px!important;
}
.size-square-res-lg {
    width: 180px!important;
    height: 180px!important;
}
.size-square-res-xl {
    width: 200px!important;
    height: 200px!important;
}
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(189, 149, 20, 0.1);
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(189, 149, 20, 0.2);
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(189, 149, 20, 0.4);
}
::-webkit-scrollbar-thumb:active {
    background: rgba(189, 149, 20, 0.9);
}
</style>
