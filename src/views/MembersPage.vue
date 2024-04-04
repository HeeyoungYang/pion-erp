<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent :userMenu="true"></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      <v-row justify="center">
        <v-col cols="12" sm="8">
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
                  <!-- ▼ 계정 추가 버튼 혹은 수정 아이콘(연필모양) 클릭 시 노출되는 Dialog(모달) -->
                  <ModalDialogComponent
                    :dialog-value="dialog"
                    max-width="500px"
                    :title="formTitle"
                    closeText="취소"
                    saveText="저장"
                    :persistent="true"
                    @close="close"
                    @save="uploadMember"
                  >
                    <template v-slot:activator>
                      <!-- ▼ 계정 추가 버튼 -->
                      <v-btn color="primary" outlined class="mb-2 float-right" @click="registItem">계정 추가</v-btn>
                    </template>
                    <!-- ▼ 버튼 혹은 아이콘 클릭 시 노출되는 모달 창 내용 -->
                    <v-container>
                      <!-- 모달 내용 구성 -->
                      <InputsFormComponent
                        clearable
                        hide-details
                        :inputs="registMemberInputs"
                      ></InputsFormComponent>
                    </v-container>
                  </ModalDialogComponent>
                </v-col>
              </v-row>
            </v-card-title>

            <!-- ▼ 구분선 -->
            <v-divider></v-divider>

            <!-- ▼ 키워드 검색 영역 (Vuetify Datatable 기능 사용)-->
            <!-- 이 부분은 원래 코드와 동일하게 유지됩니다 -->

            <!-- ▼ 시스템 전체 계정(임직원) 테이블 (Vuetify Datatable 사용)-->
            <DataTableComponent
              :headers="headers"
              :items="members"
              :search="search"
              editable
              deletable
              @edit="editItem"
              @delete="deleteItem"
              dense
            >
            </DataTableComponent>
            <ModalDialogComponent
              :dialog-value="dialogDelete"
              max-width="300px"
              title-class="text-body-1 font-weight-black"
              text-class="text-body-2"
              save-text="삭제"
              close-text="취소"
              @save="deleteItemConfirm"
              @close="closeDelete"
            >
              <template v-slot:titleHTML>
                <p class="mb-0">{{ editedItem.name }}님의</p>
                <p class="red--text">계정을 삭제하시겠습니까?</p>
              </template>
              삭제된 계정은 복구가 불가능합니다.
            </ModalDialogComponent>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import NavComponent from "@/components/NavComponent";
import ModalDialogComponent from "@/components/ModalDialogComponent";
import DataTableComponent from "@/components/DataTableComponent";
import InputsFormComponent from "@/components/InputsFormComponent.vue";

export default {
  components: {
    NavComponent,
    ModalDialogComponent,
    DataTableComponent,
    InputsFormComponent,
  },
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      registMemberInputs:[
        {label:'ID', column_name:'user_id',  col:'12', sm:'6', lg:'6', value: '', },
        {label:'이름', column_name:'name',  col:'12', sm:'6', lg:'6', value: '', },
        {label:'부서', column_name:'department', type:'select', list:['기획관리', '영업팀'], value:'', col:'12', sm:'6', lg:'6',},
        {label:'직책', column_name:'position', type:'select', list:['사원', '주임', '대리', '매니저'], value:'', col:'12', sm:'6', lg:'6',},
        {label:'전화번호', column_name:'phone', col:'12', sm:'6', lg:'6', value: ''},
        {label:'내선', column_name:'extension', col:'12', sm:'6', lg:'6', value: ''},
        {label:'이메일', column_name:'email', col:'12', sm:'6', lg:'6', value: '', },
        {label:'모바일', column_name:'mobile', col:'12', sm:'6', lg:'6', value: ''},
      ],
      headers: [
        {text: 'ID', align: 'center', value: 'user_id'},
        {text: '이름', align: 'center', value: 'name'},
        {text: '부서', align: 'center', value: 'department'},
        {text: '직책', align: 'center', value: 'position'},
        {text: '전화번호', align: 'center', value: 'phone'},
        {text: '내선', align: 'center', value: 'extension'},
        {text: '이메일', align: 'center', value: 'email'},
        {text: '모바일', align: 'center', value: 'mobile'},
        // { text: '편집', value: 'actions', sortable: false },
      ],
      members: [],
      editedIndex: -1,
      editedItem: {
        user_id:'',
        name: '',
        department: '',
        position: '',
        phone: '',
        extension: '',
        email: '',
        mobile: '',
      },
      defaultItem: {
        user_id:'',
        name: '',
        department: '',
        position: '',
        phone: '',
        extension: '',
        email: '',
        mobile: '',
      },
      deleteMemeber:{},
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '계정 등록' : '계정 수정'
    },
    formDisabled () {
      return this.editedIndex === -1 ? false : true
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.members = [
        {
          user_id: 'yjs',
          name: '윤준수',
          department: '기획관리',
          position: '매니저',
          phone: '070-1234-1234',
          extension: '123',
          email: 'yjs@pionelectric.com',
          mobile: '010-1234-5678',
        },
        {
          user_id: 'kcs',
          name: '김철수',
          department: '영업팀',
          position: '대리',
          phone: '070-5678-5678',
          extension: '456',
          email: 'kcs@pionelectric.com',
          mobile: '010-5678-1234',
        },
      ]
    },
    registItem(item){
      this.editedIndex = this.members.indexOf(item)
      let member_input = this.registMemberInputs;
      member_input.forEach(data =>{
        if(data.column_name == 'user_id'){
          data.disabled = false
        }
        data.value = '';
      })
      this.dialog = true
    },
    editItem (item) {
      this.editedIndex = this.members.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      let member_input = this.registMemberInputs;
      member_input.forEach(data =>{
        if(data.column_name == 'user_id'){
          data.disabled = true
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            data.value = Object.values(item)[i];
          }
        }
      })
      this.dialog = true
    },

    uploadMember () {
      let member_input = this.registMemberInputs;
      let item = this.editedItem;
      let no_data = [];
      member_input.forEach(data =>{
        if(!data.value){
          no_data.push(data.label);
        }
        for(let i=0; i<Object.keys(item).length; i++){
          if(data.column_name == Object.keys(item)[i]){
            item[Object.keys(item)[i]] = data.value;
          }
        }
      })

      if(no_data.length > 0){
        alert(no_data+' 항목이 공란입니다. 정보를 기입해주세요.');
        return;
      }

      if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
        this.editedItem.creater = 'user_id';
      }else{// 아니라면 수정
        this.editedItem.modifier = 'user_id';
      }
    },

    deleteItem (item) {
      this.editedIndex = this.members.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.deleteMemeber = {};
      this.deleteMemeber.modifier = 'user_id'
      this.deleteMemeber.user_id = this.editedItem.user_id;
      console.log('계정 삭제 : ' + JSON.stringify(this.deleteMemeber));
      this.members.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>

<style lang="">

</style>
