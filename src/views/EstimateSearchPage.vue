<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :estimateMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <v-card
          elevation="1"
          >

            <v-card-text class=" pt-3">
              <v-row>
                <v-col
                  cols="12"
                  sm="2"
                >
                  <v-text-field
                    v-model="project"
                    dense
                    clearable
                    filled
                    hide-details
                    label="검색조건1"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                >
                  <v-text-field
                    v-model="project"
                    dense
                    clearable
                    filled
                    hide-details
                    label="검색조건2"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                >
                  <v-text-field
                    v-model="project"
                    dense
                    clearable
                    filled
                    hide-details
                    label="검색조건3"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                  align-self="center"
                >
                  <v-btn
                    color="primary"
                    elevation="2"
                  >
                    <v-icon>mdi-magnify</v-icon>검색
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>

              </v-row>
            </v-card-text>
          </v-card>

          <v-card
          elevation="1"
          class="mt-5"
          >

            <v-card-text class=" pt-3">
              <v-row>
                <v-dialog
                  v-model="mailDialog"
                  persistent
                  max-width="800px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      fab
                      x-small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon >mdi-email</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              label="받는사람"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              label="참조"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <vue-editor v-model="content" :editor-toolbar="customToolbar"/>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="mailDialog = false"
                      >
                        Close
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="mailDialog = false"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-col
                  cols="12"
                >
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="desserts"
                    item-key="name"
                    show-select
                    class="elevation-1"
                  ></v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";

export default {
  components: {
                NavComponent,
              },
  data(){
    return{
      mailDialog: false,
      content: "<h1>Html For Editor</h1>",
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" }
        ],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["link", "image"],
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: 7,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: 8,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: 16,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: 0,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: 45,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: 22,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: 6,
        },
      ],
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
    }
  },
}
</script>
<style lang="">

</style>
