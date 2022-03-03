const CloseBtn = {
    template:
    `<div class="close" @click="switchPage">
        <img src="src/img/icons/close.svg" alt="">
    </div>`,
    props: {
        outerShowPopup: Boolean,
        outerShowPersonalPage: Boolean
    },
    data(){
        return {}
    },
    methods: {
        switchPage(){
            if (this.outerShowPopup){
                this.$emit(`switch-popup`)
            }else if (this.outerShowPersonalPage){
                this.$emit(`switch-personal-page`)
            }
        }
    }
}

Vue.component("close-btn", CloseBtn)