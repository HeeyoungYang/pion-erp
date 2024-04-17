<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :userMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <v-card elevation="1">
            <v-card-title style="width:100%;">
              <v-row>
                <v-col cols="12">
                  <p class="float-left text-h6 font-weight-black mb-0">
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Search"
                      dense
                      single-line
                      hide-details
                    ></v-text-field>
                  </p>
                </v-col>
              </v-row>
            </v-card-title>
            <!-- <v-data-table
              :headers="headers"
              :items="members"
              :search="search"
            >
            </v-data-table> -->
            <DataTableComponent
              :headers="headers"
              :items="members"
              :search="search"
              show-authority
            >
            </DataTableComponent>

          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent";
import DataTableComponent from "@/components/DataTableComponent";
import AuthorizationPageConfig from "@/configure/AuthorizationPageConfig.json";
// import ModalDialogComponent from "@/components/ModalDialogComponent";

export default {
  components: {
    NavComponent,
    DataTableComponent,
    // ModalDialogComponent,
  },
  data() {
    return {
      search: '',
      headers: AuthorizationPageConfig.headers,
      members: AuthorizationPageConfig.test_members
    }
  },
}
</script>

<style lang="">

</style>
