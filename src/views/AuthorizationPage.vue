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
      headers: [
        {text: 'ID', align: 'center', value: 'user_id'},
        {text: '이름', align: 'center', value: 'name'},
        {text: '부서', align: 'center', value: 'department'},
        {text: '직책', align: 'center', value: 'position'},
      ],
      members: [
        {
          user_id: 'yjs',
          name: '윤준수',
          department: '기획관리',
          position: '매니저',
          authority:['관리자']
        },
        {
          user_id: 'kcs',
          name: '김철수',
          department: '영업팀',
          position: '대리',
          authority:['노무비정보관리','원가계산']
        },
      ],
    }
  },
}
</script>

<style lang="">

</style>
