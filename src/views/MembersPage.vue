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
                      <v-form ref="memberForm">
                        <InputsFormComponent
                          clearable
                          :inputs="registMemberInputs"
                        ></InputsFormComponent>
                      </v-form>
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
import MemberPageConfig from "@/configure/MemberPageConfig.json";
import mux from "@/mux";
import CheckPagePermission from "@/common_js/CheckPagePermission";

export default {
  mixins: [CheckPagePermission('/api/check_page_permission?page_name=MembersPage')],
  mounted() {
    this.$on('resultCheckPagePermission', this.handleResultCheckPagePermission);
    this.getUserList(); // 사용자 리스트 가져오기
  },
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
        {label:'ID', column_name:'user_id',  col:'12', sm:'6', lg:'6', value: '',
        rules: [
          v => !!v || 'ID 입력',
          v => !!(v &&   /[a-zA-Z]/.test(v) ) || '형식 확인(영문 대소문자)',
        ]},
        {label:'이름', column_name:'name',  col:'12', sm:'6', lg:'6', value: '',
        rules: [
          v => !!v || '이름 입력',
          v => !!(v &&  /[가-힣]/.test(v) ) || '형식 확인(한글)',
        ]},
        // {label:'부서', column_name:'department', type:'select', list:['기획관리', '영업팀'], value:'', col:'12', sm:'6', lg:'6',
        // rules: [
        //   v => !!v || '부서 선택',
        // ]},
        // {label:'직책', column_name:'position', type:'select', list:['사원', '주임', '대리', '매니저'], value:'', col:'12', sm:'6', lg:'6',
        // rules: [
        //   v => !!v || '직책 선택',
        // ]},
        // {label:'전화번호', column_name:'phone', col:'12', sm:'6', lg:'6', value: '',
        // rules: [
        //   v => !!v || '전화번호 입력',
        //   v => !!(v &&  /^\d{2,3}-\d{3,4}-\d{4}$/.test(v) ) || '번호 형식 확인(ex : 070-1234-5678)',
        // ]},
        // {label:'내선', column_name:'extension', col:'12', sm:'6', lg:'6', value: '',
        // rules: [
        //   v => !!v || '내선번호 입력',
        //   v => !!(v &&  /[0-9]$/.test(v) ) || '숫자만 입력',
        // ]},
        {label:'이메일', column_name:'email', col:'12', sm:'6', lg:'6', value: '',
        rules: [
          v => !!v || '이메일 입력',
        v => !!(v &&  /^[A-Za-z0-9_\\.\\-]+@gmail.com+/.test(v) ) || '이메일 형식 확인(@gmail.com)', // for test
        // v => !!(v &&  /^[A-Za-z0-9_\\.\\-]+@pionelectric.com+/.test(v) ) || '이메일 형식 확인(@pionelectric.com)', // origin
        ]},
        {label:'모바일', column_name:'mobile', col:'12', sm:'6', lg:'6', value: '',
        rules: [
          v => !!v || '휴대전화번호 입력',
          v => !!(v &&  /^\d{3}-\d{3,4}-\d{4}$/.test(v) ) || '번호 형식 확인(ex : 010-1234-5678)',
        ]},
      ],
      headers: [],
      members: [],
      editedIndex: -1,
      editedItem: {
        user_id:'',
        name: '',
        // department: '',
        // position: '',
        // phone: '',
        // extension: '',
        email: '',
        mobile: '',
      },
      defaultItem: {
        user_id:'',
        name: '',
        // department: '',
        // position: '',
        // phone: '',
        // extension: '',
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
    handleResultCheckPagePermission(result) {
      // 사용자 페이지 권한 결과를 확인하여 처리한다.
      // result.code ==> 0 : 권한 있음, 0이 아니면 : 권한 없음
      // result.response ==> 세부 정보 포함
      console.log('사용자 페이지 권한 확인 결과:', JSON.stringify(result));
    },
    async getUserList() {
      try {
        console.log('사용자 리스트 가져오기');
        let result = await mux.Server.get({
          path: '/api/admin/users/',
        });
        console.log('result :>> ', result);

        result.data.Users.forEach(user => {
        // Code to handle each user in the array
          let member = {
            user_id: '',
            name: '',
            email: '',
            mobile: ''
          };

          member.user_id = user.Username;
          member.name = user.Attributes.find(attr => attr.Name === 'family_name').Value + user.Attributes.find(attr => attr.Name === 'given_name').Value;
          member.email = user.Attributes.find(attr => attr.Name === 'email').Value;
          member.mobile = user.Attributes.find(attr => attr.Name === 'phone_number').Value;

          console.log('id=' + user.Username);
          console.log('phone_number=' + user.Attributes.find(attr => attr.Name === 'phone_number').Value);
          console.log('given_name=' + user.Attributes.find(attr => attr.Name === 'given_name').Value);
          console.log('family_name=' + user.Attributes.find(attr => attr.Name === 'family_name').Value);
          console.log('email=' + user.Attributes.find(attr => attr.Name === 'email').Value);

          //console.log('user :>> ', user);
          this.members.push(member);
        });
        //alert(result.message);
        // 성공시 다이얼로그 닫기
        if (result.code == 0){
          this.dialog = false;
        }
      } catch (error) {
        alert(error);
      }
    },
    async initialize () {
      this.headers = MemberPageConfig.table_header;
      console.log("MemberPageConfig.table_header=", MemberPageConfig.table_header);
      let memberList = [];
      try {
        const result = await mux.Server.get({path:'/api/admin/users/'});
        if (result.code == 0){
          memberList = result.data.map(data => {
            let user = {};
            user.user_id = data.Username;
            user.name = (data.Attributes.find(x=>x.Name === 'family_name') ? data.Attributes.find(x=>x.Name === 'family_name').Value : '') + (data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '');
            user.email = data.Attributes.find(x=>x.Name === 'email') ? data.Attributes.find(x=>x.Name === 'email').Value : '';
            user.mobile = data.Attributes.find(x=>x.Name === 'phone_number') ? mux.Number.formatPhoneNumber(data.Attributes.find(x=>x.Name === 'phone_number').Value) : '';
            return user;
          });
        }else {
          alert(result.message);
        }
      } catch (error) {
        alert(error);
      }
      this.members = memberList;
      // this.members = MemberPageConfig.test_members;
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
        if(data.column_name == 'user_id' || data.column_name == 'email'){
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

    async uploadMember () {
      const validate = this.$refs.memberForm.validate();
      let member_input = this.registMemberInputs;
      let item = this.editedItem;

      if(validate){
      // let no_data = [];
        member_input.forEach(data =>{
          // if(!data.value){
          //   no_data.push(data.label);
          // }
          for(let i=0; i<Object.keys(item).length; i++){
            if(data.column_name == Object.keys(item)[i]){
              item[Object.keys(item)[i]] = data.value;
            }
          }
        })

        // if(no_data.length > 0){
        //   alert(no_data+' 항목이 공란입니다. 정보를 기입해주세요.');
        //   return;
        // }

        if(this.editedIndex === -1){ // editedIndex가 -1이면 등록
          // this.editedItem.creater = 'user_id';
          try {
            let result = await mux.Server.post({
              path: '/api/admin/signup/',
              user_name: item.user_id,
              given_name: item.name,
              family_name: '',
              user_email: item.email,
              phone_number: item.mobile
            });
            console.log('result :>> ', result);
            alert(result.message);
            // 성공시 다이얼로그 닫기
            if (result.code == 0){
              this.dialog = false;
            }
          } catch (error) {
            alert(error);
          }
        }else{// 아니라면 수정
          // this.editedItem.modifier = 'user_id';
          try {
            console.log('item :>> ', item);
            let result = await mux.Server.put({
              path: '/api/admin/user/',
              user_name: item.user_id,
              given_name: item.name,
              family_name: '',
              phone_number: item.mobile
            });
            console.log('result :>> ', result);
            // alert('수정이 완료되었습니다');
            alert(result.message);
            // 성공시 다이얼로그 닫기
            if (result.code == 0){
              this.dialog = false;
            }
          } catch (error) {
            alert(error);
          }
        }
      }
    },

    deleteItem (item) {
      this.editedIndex = this.members.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      // this.deleteMemeber = {};
      // this.deleteMemeber.modifier = 'user_id'
      // this.deleteMemeber.user_id = this.editedItem.user_id;
      // console.log('계정 삭제 : ' + JSON.stringify(this.deleteMemeber));
      console.log('this.editedItem.user_id :>> ', this.editedItem.user_id);
      // 현재 api 가 사용자 삭제가 아닌 탈퇴 기능을 수행 중...
      // try {
      //   let result = await mux.Server.delete({
      //     path: '/api/admin/user/',
      //     user_name: this.editedItem.user_id
      //   });
      //   console.log('result :>> ', result);
      //   alert(result.message);
      //   // 성공시 다이얼로그 닫기
      //   if (result.code == 0){
      //     this.members.splice(this.editedIndex, 1)
      //     this.closeDelete()
      //   }
      // } catch (error) {
      //   alert(error);
      //   console.log('error :>> ', error);
      // }
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
