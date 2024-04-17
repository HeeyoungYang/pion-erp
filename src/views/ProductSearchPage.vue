<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :productMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="11"
        >
          <CardComponent
            elevation="1"
            text-class=" pt-3"
            title-class="d-none"
          >
            <InputsFormComponent
              slot="cardText"
              dense
              clearable
              filled
              hide-details
              :inputs="searchCardInputs"
              @enter="searchButton"
            >
              <v-col
                cols="12"
                sm="4"
                lg="3"
              >
                <v-btn
                  color="primary"
                  elevation="2"
                  @click="searchButton"
                >
                  <v-icon>mdi-magnify</v-icon>검색
                </v-btn>
              </v-col>
            </InputsFormComponent>
          </CardComponent>
          <div>
            <ExpansionPanelComponent
              :data="product_data"
              elevation="1"
              class="mt-5"
              multiple>

              <template v-slot:header="{ data }">
                <p
                  class="text-h6 font-weight-black mb-0"
                  item-align-center
                >
                  {{ data.name }} ({{ data.spec }})
                  <span
                    class="text-body-1 font-weight-bold black--text ml-2"
                    item-align-center
                  >
                    : {{ data.item_code }}
                  </span>
                  <v-menu
                    open-on-hover
                    :close-on-content-click="false"
                    :nudge-width="100"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        small
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-image
                      </v-icon>
                    </template>

                    <v-card class="pa-0">
                      <v-list class="pa-0">
                        <v-list-item class="pa-0">
                          <v-list-item-content class="pa-3">
                            <v-list-item-subtitle>
                              제품이미지영역
                              <v-img
                                alt="Pionelectric Logo"
                                class="shrink mr-2"
                                contain
                                src="../assets/img/pion_logo.png"
                                transition="scale-transition"
                                width="150"
                              />
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-menu>
                </p>

              </template>
              <template v-slot:content="{ data }">
                <v-divider class="mb-4"></v-divider>
                <v-row>
                  <v-col
                    cols="12"
                  >
                  <v-chip
                    class="ma-2"
                    color="indigo"
                    text-color="white"
                    small
                    v-for="(spot_stock, idx) in data.spot_stock"
                    :key="idx"
                  >
                    {{ spot_stock.spot }} : {{ spot_stock.stock_num }}개
                  </v-chip>
                  <DataTableComponent
                      :headers="headers"
                      :items="data.belong_data"
                      :item-key="data.belong_data.item_code"
                      hide-default-footer
                      disable-pagination
                      children-key="belong_data"
                      table-style=""
                      show-photo
                      dense
                      itemNumInfo
                      itemNumInfoBelong
                      show-item-details
                      @itemDetials="detailInfoItem"
                    />
                  </v-col>
                </v-row>
              </template>
            </ExpansionPanelComponent>
          </div>
        </v-col>
      </v-row>
      <ModalDialogComponent
      :dialog-value="detail_dialog"
      max-width="50%"
      title-class="display-none"
      :dialog-transition="'slide-x-transition'"
      :dialog-custom="'custom-dialog elevation-0 white'"
      :card-elevation="'0'"
      :hide-overlay="true"
      @close="closeDetail"
      >
        <v-row>
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold primary--text">재고 정보</p>
            <DataTableComponent
              :headers="stock_detail_header"
              :items="stockDetails"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
          <v-col cols="12" sm="6">
            <p class="text-h6 font-weight-bold primary--text">입고 정보</p>
            <DataTableComponent
              :headers="inbound_detail_header"
              :items="inboundDetails"
              hide-default-footer
              disable-pagination
              dense
            />
          </v-col>
        </v-row>
      </ModalDialogComponent>
    </v-main>
  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent.vue";
import ExpansionPanelComponent from "@/components/ExpansionPanelComponent.vue";
import CardComponent from "@/components/CardComponent.vue";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import ProductSearchPageConfig from "@/configure/ProductSearchPageConfig.json";

export default {
  components: {
                NavComponent,
                DataTableComponent,
                ExpansionPanelComponent,
                CardComponent,
                InputsFormComponent,
                ModalDialogComponent,
              },
  mounted(){
    // this.closeAll()
  },
  data(){
    return{
      menu: false,
      detail_dialog: false,
      stockDetails:[],
      inboundDetails:[],

      stock_detail_header:ProductSearchPageConfig.stock_detail_header,
      inbound_detail_header:ProductSearchPageConfig.inbound_detail_header,
      searchCardInputs:ProductSearchPageConfig.searchCardInputs,
      headers:ProductSearchPageConfig.headers,
      product_data:ProductSearchPageConfig.test_product_data
      // product_data: []
    }
  },

  watch: {
    detail_dialog (val) {
      val || this.closeDetail()
    },
  },
  methods: {

    detailInfoItem(item){
      this.detail_dialog = true;
      this.stockDetails = item.spot_stock
    },
    closeDetail () {
      this.detail_dialog = false
    },
  },
  computed: {
  },
}
</script>
<style>
.custom-dialog {
  position: absolute;
    right: 0;
    margin: 0;
    min-height: 100%;
}
.v-row-group__header{background-color: #fffde9!important;}
</style>
