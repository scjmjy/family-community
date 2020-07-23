<template>
<CDialogBase ref="dlg" v-bind="dialogOptions">
    <template #body>
        <CCarouselBase v-bind="carouselOptions">
            <template  #create>
                <CCreateFamily @cancel="slideTo(1)" @success="handleCreateSuccess"/>
            </template>

            <template #join>
                <CJoinFamily @cancel="slideTo(0)" @joinSuccess="handleJoinSuccess"/>
            </template>
        </CCarouselBase>
    </template>
</CDialogBase>
</template>

<script>
import { mapMutations } from 'vuex'

import CCarouselBase, { CarsouelOptions, SlideOptions } from '../../base/carousel/CCarouselBase.vue'
import CDialogBase, { DialogOptions } from '../../base/dialog/CDialogBase.vue'

import CCreateFamily from './CCreateFamily.vue'
import CJoinFamily from './CJoinFamily.vue'

export default {
    name: 'CGetFamily',
    props: ['initial'],
    components: { CDialogBase, CCarouselBase, CCreateFamily, CJoinFamily },
    data () {
        return {
            dialogOptions: new DialogOptions('center', true, this.initial === 0 ? '创建家庭' : '加入家庭', false),
            carouselOptions: new CarsouelOptions('id-carsousel-signfamily', ['create', 'join'], -1, new SlideOptions(this.initial))
        }
    },
    methods: {
        ...mapMutations('user', [
            'setFamilyClient'
        ]),
        slideTo (index) {
            this.carouselOptions.slideTo = index
            this.dialogOptions.headerTitle = index === 0 ? '创建家庭' : '加入家庭'
        },
        handleCreateSuccess (data) {
            this.setFamilyClient(data.data)
            this.$refs.dlg.hide()
        },
        handleJoinSuccess (data) {
            this.$refs.dlg.hide()
        }
    }
}
</script>

<style>

</style>
