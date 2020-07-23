<template>
<div ref="dlg" class="modal fade" data-keyboard="true" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" :class="{'modal-dialog-centered':placement=='center'}">
        <div class="modal-content">
            <div v-if="hasHeader" class="modal-header">
                <h5 class="modal-title">{{ headerTitle }}</h5>
                <button type="button" class="close" @click="handleCancelBtnClick" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <slot name="body"/>
            </div>
            <div v-if="hasFooter" class="modal-footer">
                <slot name="footer" />
                <button v-if="footerOkBtnText" type="button" class="btn btn-secondary" @click="handleOkBtnClick">{{ footerOkBtnText }}</button>
                <button v-if="footerCancelBtnText" type="button" class="btn btn-secondary" @click="handleCancelBtnClick" data-dismiss="modal">{{ footerCancelBtnText }}</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export class DialogOptions {
    // constructor (public placement: 'center' | 'top' = 'center',
    //              public hasHeader: boolean = true,
    //              public headerTitle: string = '',
    //              public hasFooter: boolean = true,
    //              public footerOkBtnText: string = '确认',
    //              public footerCancelBtnText: string = '取消') {
    // }
    constructor (placement = 'center',
        hasHeader = true,
        headerTitle = '',
        hasFooter = true,
        footerOkBtnText = '确认',
        footerCancelBtnText = '取消') {
        this.placement = placement
        this.hasHeader = hasHeader
        this.headerTitle = headerTitle
        this.hasFooter = hasFooter
        this.footerOkBtnText = footerOkBtnText
        this.footerCancelBtnText = footerCancelBtnText
    }
}

export default {
    name: 'CDialogBase',
    props: ['placement', 'hasHeader', 'headerTitle', 'hasFooter', 'footerOkBtnText', 'footerCancelBtnText'],
    methods: {
        handleOkBtnClick(event) {
            this.$emit('ok', event)
        },
        handleCancelBtnClick() {
            this.$emit('cancel', event)
        },
        show() {
            $(this.$refs.dlg).modal('show')
        },
        hide() {
            $(this.$refs.dlg).modal('hide')
        }
    },
    mounted () {
        // $(this.$el).on('shown.bs.modal', (event) => {
        //     this.$emit('shown', event)
        // })
        // $(this.$el).on('hidden.bs.modal', (event) => {
        //     this.$emit('hidden', event)
        // })
    }
}
</script>

<style>

</style>
