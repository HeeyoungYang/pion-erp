<template>
  <div>
    <ModalDialogComponent
        :dialog-value="loading_dialog"
        :persistent="true"
        :hide-overlay="hideOverlay"
        max-width="300px"
        title-class="hide"
      >
        <v-progress-circular
          :size="120"
          :width="20"
          color="blue-grey lighten-3"
          indeterminate
          style="left: 50%; margin-left: -60px;"
        ></v-progress-circular>
        <p class="mt-15 mb-0 text-h4 text-center grey--text text--lighten-1">LOADING...</p>
      </ModalDialogComponent>
  </div>
</template>
<script>
import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  props: {
    dialogValue: Boolean,
    hideOverlay: Boolean,
  },
  components: {
              ModalDialogComponent,
              },
  data(){
    return {
      loading_dialog:this.dialogValue,
    }
  },
  watch:{
    dialogValue(){
      this.loading_dialog = this.dialogValue;
    }
  }
}

</script>
<style>

</style>
