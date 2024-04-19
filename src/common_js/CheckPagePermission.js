//import axios from 'axios';
import mux from "@/mux";

export default function(check_page_permission_url){
  return {
    data() {
      return {
        page_permission: {
          code: -1,
          response: []
        }
      };
    },
    created: async function() {
      try {
        let response = await mux.Server.get({
          path: check_page_permission_url
        });
        this.page_permission.code = response.code;
        this.page_permission.response = response;
        this.$emit('resultCheckPagePermission',  this.page_permission);
      } catch (error) {
        console.error('페이지 권한 REST API 호출 오류:', error);
        this.page_permission.code = -1;
        this.page_permission.response = error;
        this.$emit('resultCheckPagePermission',  this.page_permission);
      }
    }
  };
}
