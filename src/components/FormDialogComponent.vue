<!--  -->


<template>
    <v-dialog
      v-model="dialog"
      persistent
      :max-width = "formDialogInfo.dialogWidth ? formDialogInfo.dialogWidth : '600px'"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :color="formDialogInfo.dialogButton.buttonColor ? formDialogInfo.dialogButton.buttonColor : 'primary'"
          :x-small="formDialogInfo.dialogButton.buttonXsmall"
          :class="formDialogInfo.dialogButton.buttonClass"
          :elevation="formDialogInfo.dialogButton.buttonElevation"
          :fab="formDialogInfo.dialogButton.buttonFab"
          :outlined="formDialogInfo.dialogButton.outlined"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon v-if="formDialogInfo.dialogButton.buttonIcon !== undefined"
          :class="formDialogInfo.dialogButton.iconClass">
            {{ formDialogInfo.dialogButton.buttonIcon }}
          </v-icon>
          {{ formDialogInfo.dialogButton.buttonName }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title
        :class="formDialogInfo.modalTitleClass ? formDialogInfo.modalTitleClass : 'blue lighten-5 text-h5 font-weight-black'">
          <span>{{ formDialogInfo.dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>

            <slot></slot>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            저장
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>

export default {
  components: {
  },
  props: ['formDialogInfo'],
  data(){
    return{
      dialog: this.formDialogInfo.dialog,
    }
  },
}
</script>
<style lang="">

</style>
