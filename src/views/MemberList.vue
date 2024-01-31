<template>
  <div>
    <TheNav></TheNav>
    <v-main>
      <v-row justify="center">
        <v-col
          cols="12"
          sm="8"
        >
          <v-card
          elevation="1"
          >
          <v-card-title style="width:100%;">
            <v-row>
              <v-col cols="12">
                <p class="float-left text-h5 font-weight-black mb-0">Members</p>
                <v-dialog
                  v-model="dialog"
                  max-width="500px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      outlined
                      class="mb-2 float-right"
                      v-bind="attrs"
                      v-on="on"
                    >
                      계정 추가
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.user_id"
                              label="ID"
                              :disabled=formDisabled
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.name"
                              label="이름"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.department"
                              label="부서"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.position"
                              label="직책"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.phone"
                              label="전화번호"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.extension"
                              label="내선"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.email"
                              label="이메일"
                            ></v-text-field>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="6"
                            md="6"
                          >
                            <v-text-field
                              v-model="editedItem.mobile"
                              label="모바일"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                      >
                        저장
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                      >
                        취소
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pb-0">

            <v-row>
              <v-col
              cols="12"
              md="3"
              >
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

          </v-card-text>

          <v-card-text class=" pt-3">
            <v-data-table
              :headers="headers"
              :items="members"

              :search="search"
              sort-by="calories"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-dialog v-model="dialogDelete" max-width="300px">
                  <v-card>
                    <v-card-title class="text-body-1 font-weight-black ">
                      <p class="mb-0">{{editedItem.name}}님의</p>
                      <p class="red--text">계정을 삭제하시겠습니까?</p>
                    </v-card-title>
                    <v-card-text class="text-body-2">삭제된 계정은 복구가 불가능합니다.</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="deleteItemConfirm">삭제</v-btn>
                      <v-btn color="blue darken-1" text @click="closeDelete">취소</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="deleteItem(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn
                  color="primary"
                  @click="initialize"
                >
                  Reset
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import TheNav from "@/components/TheNav";

export default {
  components: {
                TheNav,
              },
  data(){
    return{
      search:'',
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: 'ID', align: 'center', value: 'user_id'},
        {text: '이름', align: 'center', value: 'name'},
        {text: '부서', align: 'center', value: 'department'},
        {text: '직책', align: 'center', value: 'position'},
        {text: '전화번호', align: 'center', value: 'phone'},
        {text: '내선', align: 'center', value: 'extension'},
        {text: '이메일', align: 'center', value: 'email'},
        {text: '모바일', align: 'center', value: 'mobile'},
        { text: '편집', value: 'actions', sortable: false },
      ],
      departments:['전체', '기획관리팀',' 영업팀'],
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

    editItem (item) {
      this.editedIndex = this.members.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.members.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
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

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.members[this.editedIndex], this.editedItem)
      } else {
        this.members.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
<style lang="">

</style>
