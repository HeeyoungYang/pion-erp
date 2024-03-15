<template>
  <div>
    <ModalDialogComponent
        :dialog-value="loading_dialog"
        width="350px"
        title-class="hide"
      >
        <v-progress-circular
          :size="200"
          :width="30"
          color="blue-grey lighten-3"
          indeterminate
          style="left: 50%; margin-left: -100px;"
        ></v-progress-circular>
        <p class="mt-15 mb-0 text-h4 text-center grey--text text--lighten-1">LOADING...</p>
      </ModalDialogComponent>
  </div>
</template>
<script>
import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  components: {
              ModalDialogComponent,
              },
  data(){
    return {
      loading_dialog:false,
    }
  }
}

</script>
<style>

</style>
