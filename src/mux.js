/* eslint-disable no-async-promise-executor */
import * as XLSX from "xlsx"; // npm install xlsx
import axios from 'axios'; // npm install axios
import router from '@/router/index'; // npm install vue-router
import configJson from '@/mux.json';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
// import html2pdf from 'html2pdf.js' // npm install html2pdf.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as pdfjsLib from 'pdfjs-dist/build/pdf.js'; // npm install pdfjs-dist@3.11.174
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`
// pdfjsLib.GlobalWorkerOptions.workerSrc = `@/../node_modules/pdfjs-dist/build/pdf.worker.js`
import AlertComponent from '@/components/AlertComponent.vue';
const AlertConstructor = Vue.extend(AlertComponent);
import ConfirmComponent from '@/components/ConfirmComponent.vue';
const ConfirmConstructor = Vue.extend(ConfirmComponent);
import LoadingComponent from '@/components/LoadingModalComponent.vue';
const LoadingConstructor = Vue.extend(LoadingComponent);


const Aes256Crypto = require('./common_js/Aes256Crypto');

Vue.use(VueCookies);

// @ts-check

/**
 * @namespace mux
 */
const mux = {};
let loadingInstance = null;

/**
 * 서버 관련 유틸리티 함수 그룹
 * @namespace Server
 */
mux.Server = {

  /**
   * @private
   *
   * @constant
   * @type {import('axios').AxiosInstance}
   * @memberof mux.Server
   */

  defaultTimeout: configJson.defaultTimeout, // 기본 타임아웃
  // Axios 인스턴스
  axiosInstance : axios.create({
    // baseURL: configJson.baseURL
  }),

  /**
   * 페이지 이동 함수
   * @param {string | Object} pathOrObject 가능한 Key : {str}path, {milliseconds}timeout, {str}name, {object}params ...
   * @example
   * mux.Server.move({path:'/main', params:{userId:'admin'}});
   */
  async move(pathOrObject) {
    // 페이지 이동 및 데이터 가져오기를 위한 함수
    const defaultObj = {
      path: '/',
      timeout: this.defaultTimeout
    };
    try {
      this.setObjFromPathOrObject(defaultObj, pathOrObject);

      const sendData = {};
      Object.keys(defaultObj).forEach(key => {
        sendData[key] = defaultObj[key];
      });
      // if (process.env.NODE_ENV === 'production'){

        if (sendData.path !== '/'){
          try {
            // let result = await this.get(sendData); // 페이지 이동 전 path 로 Get 요청을 통해 토큰 및 권한 인증
            // if (result){
              router.push({path: sendData.path, query: sendData});
            // }else {
            //   this.logOut();
            // }
          } catch (error) {
            this.logOut();
          }
        }else {
          this.logOut();
        }

      // }else {
      //   router.push(sendData.path);
      // }

    } catch (error) {
      if (axios.isCancel(error)) {
        // console.error(defaultObj.path+' Move canceled:', error.message); // 요청이 취소된 경우
      } else if (error.response) {
        // 요청은 성공했으나 서버가 상태 코드를 반환한 경우
        // console.error(defaultObj.path+' Move Server responded with a non 2xx status:', error.message);
      } else if (error.message === 'timeout') {
        // console.error(defaultObj.path+' Move timeout:', error.message); // 타임아웃이 발생한 경우
      } else {
        // console.error(defaultObj.path+' Move error:', error.message); // 기타 에러
      }
    }
    this.axiosInstance.defaults.timeout = this.defaultTimeout;
  },


  /**
   * REST Api GET 요청 함수
   * @param {string | Object} pathOrObject 가능한 Key : {str}path, {milliseconds}timeout, {str}body, {object}something ...
   * @returns {Promise}
   * @example
   * const result = await mux.Server.get({path:'/list', number:1});
   */
  async get(pathOrObject) {

    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(pathOrObject, 'get');
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * REST Api POST 요청
   * @param {string | Object} pathOrObject 가능한 Key : {str}path, {milliseconds}timeout, {str}body, {object}something ...
   * @returns {Promise}
   * @example
   * const result = await mux.Server.post({path: '/list', target: 'something'});
   */
  async post(pathOrObject) {

    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(pathOrObject, 'post');
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * REST Api PUT 요청
   * @param {string | Object} pathOrObject 가능한 Key : {str}path, {milliseconds}timeout, {str}body, {object}something ...
   * @returns {Promise}
   * @example
   * const result = await mux.Server.put({path: '/update', target:'something', change:'new'});
   */
  async put(pathOrObject) {

    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(pathOrObject, 'put');
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * REST Api PATCH 요청
   * @param {string | Object} pathOrObject 가능한 Key : {str}path, {milliseconds}timeout, {str}body, {object}something ...
   * @returns {Promise}
   * @example
   * const result = await mux.Server.patch({path: '/patch', target:'something', change:'new'});
   */
  async patch(pathOrObject) {

    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(pathOrObject, 'patch');
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * REST Api DELETE 요청
   * @param {string | Object} pathOrObject 가능한 Key : {str}path, {milliseconds}timeout, {str}body, {object}something ...
   * @returns {Promise}
   * @example
   * const result = await mux.Server.delete({path: '/delete', target: 'something'});
   */
  async delete(pathOrObject) {

    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.request(pathOrObject, 'delete');
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * 메일 발송
   * @param {Object} reqObj
   * 필수 key: path, to, subject, content
   * 선택 key: cc, bcc, files : [{folder,file}], attachment: [folder, fileName], timeout, ...
   */
  async sendEmail(reqObj, enableMemberSelect = true, customToMembers = [], customCcMembers = [], customBccMembers = []) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!reqObj.path) {
          reject('upload file error: path 정보와 함께 요청해야 합니다.');
          return;
        }
        if (!Array.isArray(reqObj.to) || reqObj.to.length === 0 || !reqObj.subject || !reqObj.content){
          reject('send email error: 수신자, 제목, 내용 정보와 함께 요청해야 합니다.');
          return;
        }
        if (!reqObj.files) {
          reqObj.files = [];
        }

        let allMembers = [];
        if (enableMemberSelect && (customToMembers.length === 0 || customCcMembers.length === 0 || customBccMembers.length === 0)){
          try {
            const result = await mux.Server.get({path:'/api/admin/users/'});
            if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
              allMembers = result.data.Users.map(data => {
                let user = {};
                user.user_id = data.Username;
                user.name = (data.Attributes.find(x=>x.Name === 'given_name') ? data.Attributes.find(x=>x.Name === 'given_name').Value : '');
                user.email = data.Attributes.find(x=>x.Name === 'email') ? data.Attributes.find(x=>x.Name === 'email').Value : '';
                user.phone_number = data.Attributes.find(x=>x.Name === 'phone_number') ? mux.Number.formatPhoneNumber(data.Attributes.find(x=>x.Name === 'phone_number').Value) : '';
                user.office_phone_number = data.Attributes.find(x=>x.Name === 'custom:office_phone_number') ? mux.Number.formatTelNumber(data.Attributes.find(x=>x.Name === 'custom:office_phone_number').Value) : '';
                user.office_internal_number = data.Attributes.find(x=>x.Name === 'custom:internal_number') ? data.Attributes.find(x=>x.Name === 'custom:internal_number').Value : '';
                user.position = data.Attributes.find(x=>x.Name === 'custom:position') ? data.Attributes.find(x=>x.Name === 'custom:position').Value : '';
                user.department = data.Attributes.find(x=>x.Name === 'custom:department') ? data.Attributes.find(x=>x.Name === 'custom:department').Value : '';
                return user;
              });

            }else {
              console.error('send email error: 사용자 정보를 가져올 수 없습니다.');
            }

            const userPosition = this.$cookies.get(this.$configJson.cookies.position.key);
            if (userPosition !== 'master'){
              allMembers = allMembers.filter(data => data.position !== 'master' && !data.name.includes('TEST '));
            }
            allMembers = allMembers.sort((a, b) => (a.department + '-' + a.name + '-' + a.position).localeCompare(b.department + '-' + b.name + '-' + b.position));
          } catch (error) {
            console.error('send email error: 사용자 정보를 가져올 수 없습니다.');
          }
        }
        reqObj['to_addrs'] = [];
        for (let i = 0; i < reqObj.to.length; i++) {
          // const to = reqObj.to[i];
          // reqObj['to_'+i] = to;
          if (reqObj.to[i].includes('@')){
            reqObj['to_addrs'].push(reqObj.to[i]);
          }else {
            if (!enableMemberSelect) {
              reject('send email error: 수신자 이메일 주소가 올바르지 않습니다.');
              return;
            }
            let targetMember;
            if (customToMembers.length > 0){
              targetMember = customToMembers.find(member => member.department + '-' + member.name + '-' + member.position === reqObj.to[i]);
            }else {
              targetMember = allMembers.find(member => member.department + '-' + member.name + '-' + member.position === reqObj.to[i]);
            }
            if (targetMember) {
              if (targetMember.email){
                reqObj['to_addrs'].push(targetMember.email);
              }else {
                reject('send email error: 저장된 멤버의 이메일 주소가 없습니다.');
              }
            }else {
              reject('send email error: 수신자 이메일 주소가 올바르지 않습니다.');
              return;
            }
          }
        }
        delete reqObj.to;

        reqObj['cc_addrs'] = [];
        if (reqObj.cc) {
          for (let i = 0; i < reqObj.cc.length; i++) {
            // const cc = reqObj.cc[i];
            // reqObj['cc_'+i] = cc;
            if (reqObj.cc[i].includes('@')){
              reqObj['cc_addrs'].push(reqObj.cc[i]);
            }else {
              if (!enableMemberSelect) {
                reject('send email error: 수신자 이메일 주소가 올바르지 않습니다.');
                return;
              }
              let targetMember;
              if (customCcMembers.length > 0){
                targetMember = customCcMembers.find(member => member.department + '-' + member.name + '-' + member.position === reqObj.cc[i]);
              }else {
                targetMember = allMembers.find(member => member.department + '-' + member.name + '-' + member.position === reqObj.cc[i]);
              }
              if (targetMember) {
                if (targetMember.email){
                  reqObj['cc_addrs'].push(targetMember.email);
                }else {
                  reject('send email error: 저장된 멤버의 이메일 주소가 없습니다.');
                }
              }else {
                reject('send email error: 수신자 이메일 주소가 올바르지 않습니다.');
                return;
              }
            }
          }
          delete reqObj.cc;
        }

        reqObj['bcc_addrs'] = [];
        if (reqObj.bcc) {
          for (let i = 0; i < reqObj.bcc.length; i++) {
            // const bcc = reqObj.bcc[i];
            // reqObj['bcc_'+i] = bcc;
            if (reqObj.bcc[i].includes('@')){
              reqObj['bcc_addrs'].push(reqObj.bcc[i]);
            }else {
              if (!enableMemberSelect) {
                reject('send email error: 수신자 이메일 주소가 올바르지 않습니다.');
                return;
              }
              let targetMember;
              if (customBccMembers.length > 0){
                targetMember = customBccMembers.find(member => member.department + '-' + member.name + '-' + member.position === reqObj.bcc[i]);
              }else {
                targetMember = allMembers.find(member => member.department + '-' + member.name + '-' + member.position === reqObj.bcc[i]);
              }
              if (targetMember) {
                if (targetMember.email){
                  reqObj['bcc_addrs'].push(targetMember.email);
                }else {
                  reject('send email error: 저장된 멤버의 이메일 주소가 없습니다.');
                }
              }else {
                reject('send email error: 수신자 이메일 주소가 올바르지 않습니다.');
                return;
              }
            }
          }
          delete reqObj.bcc;
        }

        reqObj['s3_attachment_files'] = [];
        if (reqObj.attachment) {
          for (let i = 0; i < reqObj.attachment.length; i++) {
            const attach = reqObj.attachment[i];
            if (!attach.folder || !attach.fileName){
              reject('send email error: 체크 항목을 첨부할 수 없습니다.');
              return;
            }
            // reqObj['attachment_folder_'+i] = attach.folder;
            // reqObj['attachment_fileName_'+i] = attach.fileName;
            reqObj['s3_attachment_files'].push({folder: attach.folder, file_name: attach.fileName, new_name: attach.newName ? attach.newName : attach.fileName});
          }
          delete reqObj.attachment;
        }

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        if (reqObj.timeout){
          this.axiosInstance.defaults.timeout = reqObj.timeout;
        }

        let formData = new FormData();
        if (reqObj.files && Array.isArray(reqObj.files)){
          reqObj.files.forEach((file) => {
            // formData.append('fileName_'+index, file.name);
            // formData.append('file', file);
            formData.append('file', file);
          });
        }

        Object.keys(reqObj).forEach(key => {
          if (key !== 'files' && key !== 'path' && key !== 'timeout'){
            if (typeof reqObj[key] !== 'string'){
              reqObj[key] = JSON.stringify(reqObj[key]);
            }
            formData.append(key, reqObj[key]);
          }
        });

        // console.log('formData :>> ', formData);
        // for (let pair of formData.entries()) {
        //   console.log(pair[0], pair[1]);
        // }

        const response = await this.axiosInstance.post(reqObj.path, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        resolve(response);
      } catch (error) {
        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        reject(error)
      }
    });
  },

  /**
   * 파일 업로드
   * @param {Object} reqObj
   * 필수 key: path, (folder, file) | files : [{folder,file}]
   * 선택 key: prefix, files.prefix, timeout, ...
   */
  async uploadFile(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {

        if (!reqObj.files && (!reqObj.folder || !reqObj.file)){
          reject('upload file error: 폴더명, 파일 정보와 함께 요청해야 합니다.');
          return;
        }

        if (!reqObj.path) {
          reject('upload file error: path 정보와 함께 요청해야 합니다.');
          return;
        }

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        if (reqObj.timeout){
          this.axiosInstance.defaults.timeout = reqObj.timeout;
        }

        let formData = new FormData();
        if (reqObj.files && Array.isArray(reqObj.files)){
          reqObj.files.forEach((file, index) => {
            if (file.folder){
              formData.append('folder_'+index, file.folder);
            }else {
              if (reqObj.folder){
                formData.append('folder_'+index, reqObj.folder);
              }else {
                reject('upload file error: 폴더명 정보와 함께 요청해야 합니다.');
                return;
              }
            }
            formData.append('fileName_'+index, (file.prefix ? file.prefix : (reqObj.prefix ? reqObj.prefix : '')) + file.name);
            formData.append('file', file.file);
          });
        }else if (reqObj.file && reqObj.folder) {
          formData.append('folder_0', reqObj.folder);
          formData.append('fileName_0', (reqObj.prefix ? reqObj.prefix : '') + reqObj.file.name);
          formData.append('file', reqObj.file);
        }
        else if (reqObj.file) {
          reject('upload file error: 폴더명 정보와 함께 요청해야 합니다.')
          return;
        }
        // else {
        //   reject('upload file error: 업로드 대상이 없습니다.');
        // }

        Object.keys(reqObj).forEach(key => {
          if (key !== 'files' && key !== 'file' && key !== 'folder' && key !== 'path' && key !== 'prefix' && key !== 'timeout'){
            if (typeof reqObj[key] !== 'string'){
              reqObj[key] = JSON.stringify(reqObj[key]);
            }
            formData.append(key, reqObj[key]);
          }
        });

        // console.log('formData :>> ', formData);
        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}: ${value}`);
        // }

        const response = await this.axiosInstance.post(reqObj.path, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        resolve(response);
      } catch (error) {
        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        reject(error)
      }
    });
  },

  /**
   * 파일 다운로드
   * @param {string} foldername
   * @param {string} filename
   * @param {string} prefix
   * @example
   * mux.Server.downloadFile('folder', 'file', 'prefix_');
   * @memberof mux.Server
   * @inner
   * @private
   * @returns {Promise}
  */
  async downloadFile(foldername, filename, prefix) {
    return new Promise(async (resolve, reject) => {
      try {
        const showName = filename;
        const fileName = prefix + showName; // PREFIX 는 code + '_' 로 구성
        const result = await mux.Server.downloadFilePromise({ path: '/api/file/', folder: foldername, fileName: fileName, showName: showName});
        if (!result) {
          reject('파일을 다운로드 할 수 없습니다.');
          return;
        }
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          resolve(result);
        }else {
          reject(result.message);
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * 파일 다운로드 프로미스
   * @param {Object} reqObj
   * 필수 key: path, folder, fileName
   * 선택 key: showName, timeout, ...
   */
  async downloadFilePromise(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        let sendData = {};
        sendData.path = reqObj.path;
        if(reqObj.folder && reqObj.fileName){
          sendData.path += '?folder=' + reqObj.folder;
          sendData.path += '&file_name=' + reqObj.fileName;
        }else {
          reject('download file error: 폴더명, 파일 정보와 함께 요청해야 합니다.');
          return;
        }
        if (!reqObj.path) {
          reject('upload file error: path 정보와 함께 요청해야 합니다.');
          return;
        }

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        if (reqObj.timeout){
          this.axiosInstance.defaults.timeout = reqObj.timeout;
        }

        Object.keys(reqObj).forEach(key => {
          if (key !== 'path' && key !== 'folder' && key !== 'fileName'){
            sendData[key] = reqObj[key];
          }
        });

        const result = await mux.Server.get(sendData);

        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          const fileData = result.data; // Base64로 인코딩된 파일 데이터
          const fileName = reqObj.showName ? reqObj.showName : reqObj.fileName; // 파일명

          // Base64 디코딩하여 Blob 객체 생성
          const byteCharacters = atob(fileData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/octet-stream' });

          // Blob 객체를 다운로드할 수 있는 링크 생성
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          resolve(result);
          return;
        }else {
          reject(result.message);
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
    });
  },

  /**
   * S3 파일 URL 생성
   * @param {string} folder
   * @param {string} fileName
   * @example
   * this.iframeSrc = await mux.Server.getFileUrl('folderName', 'fileName', 'application/pdf');
   * @memberof mux.Server
   * @inner
   * @private
   * @returns {Promise}
  */
  async getFileUrl(folder, fileName, blobType) {
    if (folder && fileName){
      try {
        const url = await mux.Server.getFileUrlPromise({ folder: folder, fileName: fileName }, blobType ? blobType : null);
        return url;
      } catch (error) {
        return '';
      }
    }else {
      return '';
    }
  },

  /**
   * S3 파일 URL 생성 프로미스
   * @param {Object} reqObj
   * 필수 key: folder, fileName
   * 선택 key: timeout, ...
   */
  async getFileUrlPromise(reqObj, blobType) {
    return new Promise(async (resolve, reject) => {
      try {
        let sendData = {};
        sendData.path = '/api/file/';
        if(reqObj.folder && reqObj.fileName){
          sendData.path += '?folder=' + reqObj.folder;
          sendData.path += '&file_name=' + reqObj.fileName;
        }else {
          reject('download file error: 폴더명, 파일 정보와 함께 요청해야 합니다.');
          return;
        }
        // if (!reqObj.path) {
        //   reject('upload file error: path 정보와 함께 요청해야 합니다.');
        //   return;
        // }

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        if (reqObj.timeout){
          this.axiosInstance.defaults.timeout = reqObj.timeout;
        }

        Object.keys(reqObj).forEach(key => {
          if (key !== 'path' && key !== 'folder' && key !== 'fileName'){
            sendData[key] = reqObj[key];
          }
        });

        const result = await mux.Server.get(sendData);

        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          const fileData = result.data; // Base64로 인코딩된 파일 데이터

          // Base64 디코딩하여 Blob 객체 생성
          const byteCharacters = atob(fileData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: blobType ? blobType : 'application/octet-stream' });

          // Blob 객체를 다운로드할 수 있는 URL 생성
          const url = window.URL.createObjectURL(blob);
          resolve(url);
          return;
        }else {
          reject(result.message);
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
    });
  },

  /**
   * S3 파일 데이터 가져오기
   * @param {string} folder
   * @param {string} fileName
   * @example
   * this.iframeSrc = await mux.Server.getFileUrl('folderName', 'fileName');
   * @memberof mux.Server
   * @inner
   * @private
   * @returns {Promise}
  */
  async getFileData(folder, fileName, blobType) {
    if (folder && fileName){
      try {
        const url = await mux.Server.getFileDataPromise({ folder: folder, fileName: fileName }, blobType ? blobType : null);
        return url;
      } catch (error) {
        return '';
      }
    }else {
      return '';
    }
  },

  /**
   * S3 파일 데이터 가져오기 프로미스
   * @param {Object} reqObj
   * 필수 key: folder, fileName
   * 선택 key: timeout, ...
   */
  async getFileDataPromise(reqObj, blobType) {
    return new Promise(async (resolve, reject) => {
      try {
        let sendData = {};
        sendData.path = '/api/file/';
        if(reqObj.folder && reqObj.fileName){
          sendData.path += '?folder=' + reqObj.folder;
          sendData.path += '&file_name=' + reqObj.fileName;
        }else {
          reject('download file error: 폴더명, 파일 정보와 함께 요청해야 합니다.');
          return;
        }
        // if (!reqObj.path) {
        //   reject('upload file error: path 정보와 함께 요청해야 합니다.');
        //   return;
        // }

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        if (reqObj.timeout){
          this.axiosInstance.defaults.timeout = reqObj.timeout;
        }

        Object.keys(reqObj).forEach(key => {
          if (key !== 'path' && key !== 'folder' && key !== 'fileName'){
            sendData[key] = reqObj[key];
          }
        });

        const result = await mux.Server.get(sendData);

        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          const fileData = result.data; // Base64로 인코딩된 파일 데이터

          // Base64 디코딩하여 Blob 객체 생성
          const byteCharacters = atob(fileData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: blobType ? blobType : 'application/octet-stream' });

          // Blob 객체를 다운로드할 수 있는 URL 생성
          // const url = window.URL.createObjectURL(blob);
          resolve(blob);
          return;
        }else {
          reject(result.message);
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
    });
  },

  /**
   * REST Api 요청 함수
   * @param {string | Object} pathOrObject 가능한 Key : {str}path, {str}method, {milliseconds}timeout, {str}body, {object}something ...
   * @param {string} [method] 'get'(기본값), 'post', 'put', 'patch', 'delete'
   * @returns {Promise}
   * @example
   * const result = await mux.Server.request({path:'/list', method:'post', number:1});
   */
  async request(pathOrObject, method) {
    const defaultObj = {
      timeout: this.defaultTimeout
    };

    return new Promise(async (resolve, reject) => {
      try {
        this.setObjFromPathOrObject(defaultObj, pathOrObject);
        this.axiosInstance.defaults.timeout = defaultObj.timeout;

        const sendData = {};
        Object.keys(defaultObj).forEach(key => {
          if (key !== 'timeout' && key !== 'path' && key !== 'method'){
            sendData[key] = defaultObj[key];
          }
        });

        let response;
        switch (method) {
          case 'post':
            response = await this.axiosInstance.post(defaultObj.path, sendData);
            break;
          case 'put':
            response = await this.axiosInstance.put(defaultObj.path, sendData);
            break;
          case 'patch':
            response = await this.axiosInstance.patch(defaultObj.path, sendData);
            break;
          case 'delete':
            response = await this.axiosInstance.delete(defaultObj.path, sendData);
            break;

          default:
            method = 'get';
            response = await this.axiosInstance.get(defaultObj.path, sendData);
            break;
        }

        // 응답에 accessToken 이 있으면 localStorage 에, RefreshToken 이 있으면 쿠키에 저장
        if (response.data){
          if (response && response.data && response.data.data && response.data.data.AuthenticationResult){
            if (response.data.data.AuthenticationResult.AccessToken){
              localStorage.setItem('AccessToken', response.data.data.AuthenticationResult.AccessToken)
              // console.log('response.data.data.AuthenticationResult.ExpiresIn :>> ', response.data.data.AuthenticationResult.ExpiresIn);
            }
            if (response.data.data.AuthenticationResult.RefreshToken){
              Vue.$cookies.set(configJson.cookies.RefreshToken.key, response.data.data.AuthenticationResult.RefreshToken, configJson.cookies.RefreshToken.expiration);
            }
          }
        }
        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        resolve(response);
      } catch (error) {
        if (axios.isCancel(error)) {
          // console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Request canceled:', error.message); // 요청이 취소된 경우
        } else if (error.response) {
          // 요청은 성공했으나 서버가 상태 코드를 반환한 경우
          // console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Server responded with a non 2xx status:', error.message);
        } else if (error.message === 'timeout') {
          // console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Request timeout:', error.message); // 타임아웃이 발생한 경우
        } else {
          // console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Request error:', error.message); // 기타 에러
        }
        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        reject(error);
      }
    });

  },

  /**
   * 사용자 정보 쿠키 저장
   * @example
   * mux.Server.setUserCookies();
   * @returns {Promise}
   * @memberof mux.Server
   * @inner
   * @private
  */
  setUserCookies() {
    return new Promise((resolve, reject) => {
      this.get({
        path: '/api/user/',
      }).then((result) => {
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          Vue.$cookies.set(configJson.cookies.name.key, result.data.UserAttributes.find(attr => attr.Name === 'given_name').Value, configJson.cookies.name.expiration);
          Vue.$cookies.set(configJson.cookies.phone_number.key, mux.Number.formatPhoneNumber(result.data.UserAttributes.find(attr => attr.Name === 'phone_number').Value), configJson.cookies.phone_number.expiration);
          Vue.$cookies.set(configJson.cookies.email.key, result.data.UserAttributes.find(attr => attr.Name === 'email').Value, configJson.cookies.email.expiration);
          Vue.$cookies.set(configJson.cookies.office_phone_number.key, mux.Number.formatTelNumber(result.data.UserAttributes.find(attr => attr.Name === 'custom:office_phone_number').Value), configJson.cookies.office_phone_number.expiration);
          Vue.$cookies.set(configJson.cookies.office_internal_number.key, result.data.UserAttributes.find(attr => attr.Name === 'custom:internal_number').Value, configJson.cookies.office_internal_number.expiration);
          Vue.$cookies.set(configJson.cookies.position.key, result.data.UserAttributes.find(attr => attr.Name === 'custom:position').Value, configJson.cookies.position.expiration);
          Vue.$cookies.set(configJson.cookies.department.key, result.data.UserAttributes.find(attr => attr.Name === 'custom:department').Value, configJson.cookies.department.expiration);

          mux.Server.get({path:'/api/admin/user/groups/'}).then(result2 => {
            if (result2['code'] == 0 || (typeof result2['data'] === 'object' && result2['data']['code'] == 0) || (typeof result2['response'] === 'object' && typeof result2['response']['data'] === 'object' && result2['response']['data']['code'] == 0)){
              if( result2.data.length > 0) {
                mux.Server.get({path:'/api/admin/page_resources/'}).then(result3 => {
                  if (result3['code'] == 0 || (typeof result3['data'] === 'object' && result3['data']['code'] == 0) || (typeof result3['response'] === 'object' && typeof result3['response']['data'] === 'object' && result3['response']['data']['code'] == 0)){
                    if( result3.data.length > 0) {
                      let page_resourceList = result3.data.map(data => {
                        let page_resource = {};
                        page_resource.page_name = data.page_name;
                        page_resource.page_alias = data.page_alias
                        page_resource.page_url = data.page_url;
                        return page_resource;
                      });
                      page_resourceList.sort((a, b) => b.page_name.localeCompare(a.page_name));

                      mux.Server.get({path: '/api/admin/page_permission/'}).then(result4 => {
                        if (result4['code'] == 0 || (typeof result4['data'] === 'object' && result4['data']['code'] == 0) || (typeof result4['response'] === 'object' && typeof result4['response']['data'] === 'object' && result4['response']['data']['code'] == 0)){
                          let user_group_info = result2.data;
                          let page_resource_info = result3.data;
                          let page_permission_info = result4.data;

                          let user_allowed_resource_table_id_arr = [];
                          let allowed_urls = [];

                          user_group_info.forEach(group => {
                            page_permission_info.forEach(permission => {
                              if (permission.group_table_id === group.group_table_id){
                                if (user_allowed_resource_table_id_arr.indexOf(permission.page_resource_table_id) === -1){
                                  user_allowed_resource_table_id_arr.push(permission.page_resource_table_id);
                                }
                              }
                            });
                          });

                          page_resource_info.forEach(resource => {
                            if (user_allowed_resource_table_id_arr.indexOf(resource.id) !== -1){
                              allowed_urls.push(resource.page_url);
                            }
                          });

                          allowed_urls = allowed_urls.sort((a, b) => a.localeCompare(b));
                          allowed_urls = allowed_urls.join(',');

                          Vue.$cookies.set(configJson.cookies.allowed_urls.key, allowed_urls, configJson.cookies.allowed_urls.expiration);
                          Vue.$cookies.set(configJson.cookies.permission_group_ids.key, user_group_info.map(group => group.group_table_id).join(','), configJson.cookies.permission_group_ids.expiration);


                          resolve();
                        }else {
                          // console.log('get page_permission fail: ', response);
                          reject(result4.message);
                        }
                      }).catch (error => {
                        // console.log('get page_permission error: ', error);
                        reject(error);
                      });
                    }
                  }else {
                    // console.log('get page_resources fail: ', result);
                    reject(result3.message);
                  }
                }).catch(error => {
                  // console.log('get page_resources error :>> ', error);
                  reject(error);
                });
              }
            }else {
              // console.log('get user groups fail: ', result);
              reject(result2.message);
            }
          }).catch(error => {
            // console.log('get user groups error :>> ', error);
            reject(error);
          });

        } else {
          // console.log('사용자 정보 조회 실패:', result.message);
          reject(result.message);
        }
      }).catch((error) => {
        // console.log('사용자 정보 조회 에러:', error);
        reject(error);
      });
    });
  },

  /**
   * 로그인 함수 - 쿠키 저장 + 메인 페이지('/home')로 이동
   * @example
   * mux.Server.logIn('userId', 'userPw12#', true);
   */
  logIn(id, pw, saveIdCheck) {
    return new Promise((resolve) => {
      this.get({
        path:'/api/security/'
      }).then(security => {
        if(security.code == 0){
          const salt = security.data['salt']
          const hashed_key = security.data['hashed_key']
          const aes256Crypto = new Aes256Crypto()
          const encrypted_id = aes256Crypto.encrypt(id, hashed_key)
          const encrypted_pw = aes256Crypto.encrypt(pw, hashed_key)

          this.post({
            path:'/api/user/login/', user_name:encrypted_id, password:encrypted_pw, salt:salt
          }).then(result => {
            if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)
              || result['code'] == 5031 || (typeof result['data'] === 'object' && result['data']['code'] == 5031) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 5031)
              || result.temporary_password || (typeof result['data'] === 'object' && result['data'].temporary_password) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data'].temporary_password)){
              if (saveIdCheck){
                Vue.$cookies.set(configJson.cookies.savedID.key, id, configJson.cookies.savedID.expiration);
              }else {
                Vue.$cookies.remove(configJson.cookies.savedID.key);
              }
              Vue.$cookies.set(configJson.cookies.id.key, id, configJson.cookies.id.expiration);
              // 최초 로그인 시 쿠키는 추후에 저장
              if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
                this.setUserCookies().then(() => {
                  result.data.path = '/home';
                  this.move(result.data);
                  resolve();
                }).catch((error) => {
                  // console.log('사용자 정보 쿠키 저장 실패:', error);
                  mux.Util.showAlert(error, '로그인 실패');
                  mux.Server.logOut();
                  resolve();
                });
              }else {
                result.data.path = '/home';
                this.move(result.data);
                resolve();
              }
            }else {
              // console.error('로그인 실패:', result.message);
              mux.Util.showAlert(result.message);
              resolve();
            }
          }).catch(err => {
            // console.error('err :>>>>> ', err);
            switch (err.message) {
              // case 'password':
              //   mux.Util.showAlert('비밀번호 오류');
              //   break;
              // case 'id':
              //   mux.Util.showAlert('존재하지 않는 아이디');
              //   break;

              default:
                mux.Util.showAlert('아이디 또는 비밀번호를 확인해주세요.', '로그인 오류', 3000);
                break;
            }
            resolve();
          });

        }else{
          mux.Util.showAlert("확인코드를 확인해주세요.");
          resolve();
        }
      }).catch(() => {
        // console.error('err :>> ', err);
        mux.Util.showAlert('확인코드를 확인해주세요.');
        resolve();
      });
    });
  },

  /**
   * 로그아웃 함수 - 로컬 스토리지와 쿠키 clear + 로그인 페이지('/')로 이동
   * @example
   * mux.Server.logOut();
   */
  async logOut() {
    try {
      await this.post({path:'/api/user/logout/'});
    } catch (error) {
      // console.log('logout error :>> ', error);
    }
    localStorage.clear();
    Vue.$cookies.keys().forEach(key =>{
      if (key !== configJson.cookies.savedID.key)
      Vue.$cookies.remove(key);
    });
    if (window.location.pathname !== '/') {
      router.push('/');
    }
  },

  setObjFromPathOrObject(defaultObj, pathOrObject) {
    if (typeof pathOrObject === "string"){
      defaultObj.path = pathOrObject;
    }else if (typeof pathOrObject === "object"){
      Object.keys(pathOrObject).forEach(key => {
        if (key !== 'url'){
          defaultObj[key] = pathOrObject[key];
        }
      });
    }
  },

  getPionBasicInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await mux.Server.get({
          path: '/api/get_page_display_info/',
          data: {}
        });

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        let basicInfo = {};
        if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
          basicInfo.classification = result.data.classification.map(data => {
            return data.classification;
          });
          basicInfo.manufacturer = result.data.manufacturer.map(data => {
            return data.manufacturer;
          });
          basicInfo.spot = result.data.spot.filter(data => data.spot !== 'EMPTY').map(data => {
            return data.spot;
          });
          basicInfo.classification = basicInfo.classification.sort((a, b) => {
            if (a === '그 외') return 1;
            if (b === '그 외' || a === '기타') return -1;
            return a.localeCompare(b);
          });
          basicInfo.manufacturer = basicInfo.manufacturer.sort((a, b) => {
            if (a === '미확인') return 1;
            if (b === '미확인' || a === '기타') return -1;
            return a.localeCompare(b);
          });
          basicInfo.spot = basicInfo.spot.sort((a, b) => {
            if (a === '미확인') return 1;
            if (b === '미확인' || a === '기타') return -1;
            return a.localeCompare(b);
          });
          resolve(basicInfo);
        } else {
          reject(result.message);
        }
      } catch (error) {
        reject(error);
      }
    });

  },

}
// Axios인스턴스 설정: 요청 시마다 헤더에 토큰을 추가
mux.Server.axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('AccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }else {
      config.headers.Authorization = `Bearer a`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Axios인스턴스 설정: 백엔드 토큰 만료 응답에 대해 토큰 새로고침 후 재시도
mux.Server.axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if ((error.response.data && (error.response.data.code === 5193 || error.response.data.code === 1000 || (error.response.data.data && error.response.data.data.Code === "NotAuthorizedException")))
    && !originalRequest._retry) {
      originalRequest._retry = true;
      const userName = Vue.$cookies.get(configJson.cookies.id.key);
      const RefreshToken = Vue.$cookies.get(configJson.cookies.RefreshToken.key);
      if (userName && RefreshToken) {
        try {
          // RefreshToken을 사용하여 새로운 AccessToken을 요청합니다.
          const response = await axios.post('/api/user/refresh_token/', { user_name: userName, refresh_token: RefreshToken });
          const newAccessToken = response.data.data.AccessToken;
          localStorage.setItem('AccessToken', newAccessToken);

          axios.get('/api/user/').then((result) => {
            if (result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)) {
              Vue.$cookies.set(configJson.cookies.name.key, result.data.UserAttributes.find(attr => attr.Name === 'given_name').Value, configJson.cookies.name.expiration);
              Vue.$cookies.set(configJson.cookies.phone_number.key, mux.Number.formatPhoneNumber(result.data.UserAttributes.find(attr => attr.Name === 'phone_number').Value), configJson.cookies.phone_number.expiration);
              Vue.$cookies.set(configJson.cookies.email.key, result.data.UserAttributes.find(attr => attr.Name === 'email').Value, configJson.cookies.email.expiration);
              Vue.$cookies.set(configJson.cookies.office_phone_number.key, mux.Number.formatTelNumber(result.data.UserAttributes.find(attr => attr.Name === 'custom:office_phone_number').Value), configJson.cookies.office_phone_number.expiration);
              Vue.$cookies.set(configJson.cookies.office_internal_number.key, result.data.UserAttributes.find(attr => attr.Name === 'custom:internal_number').Value, configJson.cookies.office_internal_number.expiration);
              Vue.$cookies.set(configJson.cookies.position.key, result.data.UserAttributes.find(attr => attr.Name === 'custom:position').Value, configJson.cookies.position.expiration);
              Vue.$cookies.set(configJson.cookies.department.key, result.data.UserAttributes.find(attr => attr.Name === 'custom:department').Value, configJson.cookies.department.expiration);

              mux.Server.get({path:'/api/admin/user/groups/'}).then(result2 => {
                if (result2['code'] == 0 || (typeof result2['data'] === 'object' && result2['data']['code'] == 0) || (typeof result2['response'] === 'object' && typeof result2['response']['data'] === 'object' && result2['response']['data']['code'] == 0)){
                  if( result2.data.length > 0) {
                    mux.Server.get({path:'/api/admin/page_resources/'}).then(result3 => {
                      if (result3['code'] == 0 || (typeof result3['data'] === 'object' && result3['data']['code'] == 0) || (typeof result3['response'] === 'object' && typeof result3['response']['data'] === 'object' && result3['response']['data']['code'] == 0)){
                        if( result3.data.length > 0) {
                          let page_resourceList = result3.data.map(data => {
                            let page_resource = {};
                            page_resource.page_name = data.page_name;
                            page_resource.page_alias = data.page_alias
                            page_resource.page_url = data.page_url;
                            return page_resource;
                          });
                          page_resourceList.sort((a, b) => b.page_name.localeCompare(a.page_name));

                          mux.Server.get({path: '/api/admin/page_permission/'}).then(result4 => {
                            if (result4['code'] == 0 || (typeof result4['data'] === 'object' && result4['data']['code'] == 0) || (typeof result4['response'] === 'object' && typeof result4['response']['data'] === 'object' && result4['response']['data']['code'] == 0)){
                              let user_group_info = result2.data;
                              let page_resource_info = result3.data;
                              let page_permission_info = result4.data;

                              let user_allowed_resource_table_id_arr = [];
                              let allowed_urls = [];

                              user_group_info.forEach(group => {
                                page_permission_info.forEach(permission => {
                                  if (permission.group_table_id === group.group_table_id){
                                    if (user_allowed_resource_table_id_arr.indexOf(permission.page_resource_table_id) === -1){
                                      user_allowed_resource_table_id_arr.push(permission.page_resource_table_id);
                                    }
                                  }
                                });
                              });

                              page_resource_info.forEach(resource => {
                                if (user_allowed_resource_table_id_arr.indexOf(resource.id) !== -1){
                                  allowed_urls.push(resource.page_url);
                                }
                              });

                              allowed_urls = allowed_urls.sort((a, b) => a.localeCompare(b));
                              allowed_urls = allowed_urls.join(',');

                              Vue.$cookies.set(configJson.cookies.permission_group_ids.key, user_group_info.map(group => group.group_table_id).join(','), configJson.cookies.permission_group_ids.expiration);
                              Vue.$cookies.set(configJson.cookies.allowed_urls.key, allowed_urls, configJson.cookies.allowed_urls.expiration);

                              // 기존 요청을 재시도합니다.
                              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                              return axios(originalRequest);

                            }else {
                              // console.log('get page_permission fail: ', response);
                              // reject(result4.message);
                            }
                          }).catch (error => {
                            // console.log('get page_permission error: ', error);
                            return Promise.reject(error);
                          });
                        }
                      }else {
                        // console.log('get page_resources fail: ', result);
                        // reject(result3.message);
                      }
                    }).catch(error => {
                      // console.log('get page_resources error :>> ', error);
                      return Promise.reject(error);
                    });
                  }
                }else {
                  // console.log('get user groups fail: ', result);
                  // reject(result2.message);
                }
              }).catch(error => {
                // console.log('get user groups error :>> ', error);
                return Promise.reject(error);
              });

            } else {
              // console.error('AccessToken 갱신 후 사용자 정보 저장 실패:', result.message);
            }
          }).catch((error) => {
            // console.error('AccessToken 갱신 후 사용자 정보 저장 에러:', error);
            return Promise.reject(error);
          });
        } catch (refreshError) {
          // RefreshToken을 사용하여 AccessToken을 갱신하는데 실패한 경우 로그아웃 처리 등을 수행할 수 있습니다.
          // console.error('AccessToken 갱신 실패:', refreshError);
          // 로그아웃
          try {
            await axios.post({path:'/api/user/logout/'});
          } catch (error) {
            // console.log('logout error :>> ', error);
          }
          localStorage.clear();
          Vue.$cookies.keys().forEach(key =>{
            if (key !== configJson.cookies.savedID.key)
            Vue.$cookies.remove(key);
          });
          if (window.location.pathname !== '/') {
            router.push('/');
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Get 관련 유틸리티 함수 그룹
 * @namespace Get
 */
mux.Get = {

  /**
   * 특정 HTML Element 에서 값 가져오기
   * @param {HTMLElement | number | string} source
   * @returns {string | number}
   */
  getValueAt(source){
    let value;
    if (typeof source === "number" || typeof source === "string"){
      value = source;
    }else {
      if (source.tagName === 'INPUT' || source.tagName ==='SELECT' || source.tagName === 'TEXTAREA'){
        value = source.value;
      }else {
        value = source.innerText;
      }
    }
    return value;
  },


  /**
   * 최근 코드 가져오기
   * @param {string} type
   * @param {string} table_info
   * @param {string} script_file_name
   * @param {string} script_file_path
   * @example
   * mux.Util.getCurrentCode(code, param_info, script_file_name, script_file_path);
   * @memberof mux.Server
   * @inner
   * @private
   * @returns {Promise}
  */
  getCurrentCode(code, param_info, script_file_name, script_file_path) {
    return new Promise(async (resolve, reject) => {

      // const currDate = new Date();
      // let code = type + mux.Date.format(currDate, 'yyMMdd') + '_';
      const prevURL = window.location.href;
      let current_code = '';
      try {
        //견적서 REST API 스크립트 전달 받으면 수정 예정
        let result = await mux.Server.post({
          path: '/api/common_rest_api/',
          params: [
            param_info
          ],
          "script_file_name": script_file_name,
          "script_file_path": script_file_path
        });
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

          let searched = result.data;
          // 정렬
          if(searched.length > 0){
            searched.sort((a,b) => a[code].localeCompare(b[code]));
            current_code = searched[searched.length-1][code];
          } else {
            current_code = '';
          }
          resolve(current_code);
        } else {
          reject(result.message);
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * 최근 사내 견적번호 가져오기
   * @param {string} basic_code
   * @example
   * mux.Util.getCurrentInhouseBid(basic_code);
   * @memberof mux.Server
   * @inner
   * @private
   * @returns {Promise}
  */
  async getCurrentInhouseBid(basic_code){
    return new Promise(async (resolve, reject) => {
      let currentCode = '';
      const prevURL = window.location.href;

      let reqURL = '/api/estimate/?inhouse_bid_number='+basic_code;
      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;
          searchResult.confirmation = searchResult.confirmation.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          const uniqueConfirmation = [];
          const confirmationMap = new Map();

          searchResult.confirmation.forEach(item => {
            const code = item.cost_calc_code;
            const time = new Date(item.modified_time).getTime();

            if (!confirmationMap.has(code) || time > confirmationMap.get(code)) {
              confirmationMap.set(code, time);
            }
          });
          confirmationMap.forEach((time, code) => {
            const item = searchResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
            uniqueConfirmation.push(item);
          });
          searchResult.confirmation = uniqueConfirmation;
          // searchResult.product_cost = searchResult.product_cost.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          // searchResult.labor_cost_calc_detail = searchResult.labor_cost_calc_detail.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          // searchResult.product_cost_calc_detail = searchResult.product_cost_calc_detail.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          // searchResult.construction_materials_data = searchResult.construction_materials_data.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));

          let reqURL2 = '/api/obtain-order/?inhouse_bid_number='+basic_code;
          try {
            let result2 = await mux.Server.get({path: reqURL2});
            if (prevURL !== window.location.href) return;

            if (typeof result2 === 'string'){
              result2 = JSON.parse(result2);
            }
            if(result2['code'] == 0 || (typeof result2['data'] === 'object' && result2['data']['code'] == 0) || (typeof result2['response'] === 'object' && typeof result2['response']['data'] === 'object' && result2['response']['data']['code'] == 0)){
              const searchObtainResult = result2.data;
              searchObtainResult.confirmation = searchObtainResult.confirmation.filter(x=> searchObtainResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
              const uniqueObtainConfirmation = [];
              const obtainConfirmationMap = new Map();

              searchObtainResult.confirmation.forEach(item => {
                const code = item.cost_calc_code;
                const time = new Date(item.modified_time).getTime();

                if (!obtainConfirmationMap.has(code) || time > obtainConfirmationMap.get(code)) {
                  obtainConfirmationMap.set(code, time);
                }
              });
              obtainConfirmationMap.forEach((time, code) => {
                const item = searchObtainResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
                uniqueObtainConfirmation.push(item);
              });

              searchResult.confirmation.push(...uniqueObtainConfirmation);
              // searchResult.confirmation.reverse(); // 최신순으로 정렬
              // 사내 견적번호 내림차순으로 정렬
              searchResult.confirmation.sort((a, b) => b.inhouse_bid_number.localeCompare(a.inhouse_bid_number));

              if(searchResult.confirmation.length === 0){
                currentCode = '';
              }else{
                currentCode = searchResult.confirmation[0].inhouse_bid_number;
              }
              resolve(currentCode);
            }else{
              mux.Util.showAlert(result2);
            }
          } catch (error) {
            if (prevURL !== window.location.href) return;
            mux.Util.showAlert(error);
          }

        } else {
          reject(result.message);
        }
      } catch (error) {
        reject(error);
      }

    });
  },


  async searchCurrentCode(){
    const currDate = new Date();
    const prevURL = window.location.href;
    // let code = 'PEPR_' + mux.Date.format(currDate, 'yyyy-MM-dd HH-mm-ss-fff') + '-' + this.$cookies.get(this.$configJson.cookies.id.key);
    let code = 'PEPR_' + mux.Date.format(currDate, 'yyMMdd') + '_';
    let current_code = '';
    try {
      let result = await mux.Server.post({
        path: '/api/common_rest_api/',
        params: [
          {
            "purchase_confirmation_table.code": code
          }
        ],
        "script_file_name": "rooting_구매요청_검색_24_08_08_11_45_79G.json",
        "script_file_path": "data_storage_pion\\json_sql\\purchase\\구매요청_검색_24_08_08_11_45_QAW"
      });
      if (prevURL !== window.location.href) return;

      if (typeof result === 'string'){
        result = JSON.parse(result);
      }
      if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){

        let searched = result.data;
        // 정렬
        if(searched.length > 0){
          searched.sort((a,b) => a.code.localeCompare(b.code));
          current_code = searched[searched.length-1].code;
        } else {
          current_code = '';
        }
      } else {
        mux.Util.showAlert(result['failed_info']);
      }
    } catch (error) {
      if (prevURL !== window.location.href) return;
      mux.Util.hideLoading();
      if(error.response !== undefined && error.response['data'] !== undefined && error.response['data']['failed_info'] !== undefined)
        mux.Util.showAlert(error.response['data']['failed_info'].msg);
      else
        mux.Util.showAlert(error);
    }
    return current_code;
  },

  /**
   * 최근 프로젝트코드 가져오기
   * @param {string} basic_code
   * @example
   * mux.Util.getCurrentInhouseBid(basic_code);
   * @memberof mux.Server
   * @inner
   * @private
   * @returns {Promise}
  */
  async getCurrentProjectCode(basic_code){
    return new Promise(async (resolve, reject) => {
      let currentCode = '';
      const prevURL = window.location.href;

      let reqURL = '/api/obtain-order/?inhouse_bid_number='+basic_code;
      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          const searchResult = result.data;
          searchResult.confirmation = searchResult.confirmation.filter(x=> searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          const uniqueConfirmation = [];
          const confirmationMap = new Map();

          searchResult.confirmation.forEach(item => {
            const code = item.cost_calc_code;
            const time = new Date(item.modified_time).getTime();

            if (!confirmationMap.has(code) || time > confirmationMap.get(code)) {
              confirmationMap.set(code, time);
            }
          });
          confirmationMap.forEach((time, code) => {
            const item = searchResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
            uniqueConfirmation.push(item);
          });
          searchResult.confirmation = uniqueConfirmation;

          // 프로젝트 코드 내림차순으로 정렬
          searchResult.confirmation.sort((a, b) => b.project_code.localeCompare(a.project_code));

          if(searchResult.confirmation.length === 0){
            currentCode = '';
          }else{
            currentCode = searchResult.confirmation[0].project_code;
          }
          resolve(currentCode);

        } else {
          reject(result.message);
        }
      } catch (error) {
        reject(error);
      }

    });
  }

}

/**
 * Set 관련 유틸리티 함수 그룹
 * @namespace Set
 */
mux.Set = {

  /**
   * 특정 HTML Element 에 값 표시
   * @param {HTMLElement | number | string} source
   * @param {HTMLElement} target
   */
  setValueAt(source, target) {
    let value = mux.Get.getValueAt(source);
    if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA'){
      target.value = value;
    }else {
      target.innerText = value;
    }
  },

}

/**
 * 일반 유틸리티 함수 그룹
 * @namespace Util
 */
mux.Util = {

  getDPI() {
    const dpiDiv = document.createElement("div");
    dpiDiv.style.width = "1in";
    dpiDiv.style.height = "1in";
    dpiDiv.style.position = "absolute";
    dpiDiv.style.left = "-100%";
    document.body.appendChild(dpiDiv);
    const dpi = dpiDiv.offsetWidth; // 1인치의 픽셀 수
    document.body.removeChild(dpiDiv);
    return dpi;
  },

  mmToPx(mm) {
      const dpi = this.getDPI();
      return (mm / 25.4) * dpi;
  },

  pxToMm(px) {
      const dpi = this.getDPI();
      return (px / dpi) * 25.4;
  },

  /**
   * 전달 받은 HTML 의 출력 미리보기 팝업창을 띄우며 프린트 도구 시작
   * @param {HTMLElement} element
   * @param {Object} paramObj
   * @param {number} paramObj.countingTableIndex - 테이블 인덱스(기본: 마지막 테이블)
   * @param {number} paramObj.rowCountPerPage - 페이지당 행 수(기본값: 27)
   * @param {number} paramObj.marginTopBottom - 페이지 상하 여백(기본값: 10)
   * @param {number} paramObj.marginLeftRight - 페이지 좌우 여백(기본값: 10)
   * @param {boolean} paramObj.mmWidth - 가로 mm(기본값: 210)
   * @param {boolean} paramObj.isLandscape - 가로 용지 여부(기본값: false)
   * @param {boolean} paramObj.hasTotalRow - 총합 행 여부(기본값: false
   * @param {boolean} paramObj.trTdClass - tr, td에 추가할 클래스명(기본값: '')
   * @param {boolean} paramObj.originPrintLogic - 기존 프린트 로직 사용 여부(기본값: false)
   * @example
   * mux.Util.print(element, {countingTableIndex: 3, rowCountPerPage: 27, marginTopBottom: 10, marginLeftRight: 10, mmWidth: 210, isLandscape:false, hasTotalRow: false, trTdClass: 'approve_text', originPrintLogic: false});
   * @memberof mux.Util
   * @inner
   * @private
   * @returns {Promise}
   */
  async print(element, paramObj) {
    let countingTableIndex = -1;
    let rowCountPerPage = 27;
    let marginTopBottom = 10;
    let marginLeftRight = 10;
    let mmWidth = 210;
    let isLandscape = false;
    let hasTotalRow = false;
    let trTdClass = '';
    let originPrintLogic = false;
    if (typeof paramObj === 'object'){
      if (paramObj.countingTableIndex){
        countingTableIndex = paramObj.countingTableIndex;
      }
      if (paramObj.rowCountPerPage){
        rowCountPerPage = paramObj.rowCountPerPage;
      }
      if (paramObj.marginTopBottom){
        marginTopBottom = paramObj.marginTopBottom;
      }
      if (paramObj.marginLeftRight){
        marginLeftRight = paramObj.marginLeftRight;
      }
      if (paramObj.mmWidth){
        mmWidth = paramObj.mmWidth;
      }
      if (paramObj.isLandscape){
        isLandscape = paramObj.isLandscape;
      }
      if (paramObj.hasTotalRow){
        hasTotalRow = paramObj.hasTotalRow;
      }
      if (paramObj.trTdClass){
        trTdClass = paramObj.trTdClass;
      }
      if (paramObj.originPrintLogic){
        originPrintLogic = paramObj.originPrintLogic;
      }
    }

    return new Promise(async (resolve, reject) => {
      if (!originPrintLogic){
        try {
          let thisElement;
          if (element.$el){
            thisElement = element.$el;
          }else {
            thisElement = element;
          }

          let a4Width;
          let a4Height;
          let htmlBody = '';

          let tableList = thisElement.querySelectorAll('table');
          let countingTable = tableList[countingTableIndex < 0 ? tableList.length - 1 : countingTableIndex];
          let tbody = countingTable.querySelector('tbody');
          let trList = tbody.querySelectorAll('tr:not([style*="display: none"])');

          // NodeList를 배열로 변환
          let trArray = Array.from(trList);

          // rowCountPerPage 기준으로 행을 나누기
          let startIndex = 0;
          let endIndex = rowCountPerPage;
          let pageCount = Math.ceil(trArray.length / rowCountPerPage);

          let tmpRowspanArr = [];
          // 페이지 만들기
          for (let i = 0; i < pageCount; i++) {
            let copiedElement = thisElement.cloneNode(true);

            let tables = copiedElement.querySelectorAll('table');
            let targetTable = tables[countingTableIndex < 0 ? tables.length - 1 : countingTableIndex];
            let tb = targetTable.querySelector('tbody');
            let trs = tb.querySelectorAll('tr:not([style*="display: none"])');

            // NodeList를 배열로 변환
            let array = Array.from(trs);

            let zeroDiff = false;
            for (let ii = 0; ii < array.length; ii++) {
              const node = array[ii];

              if (hasTotalRow && i === pageCount - 2 && endIndex === array.length - 1){
                endIndex -= 1;
                zeroDiff = true;
              }
              if (ii < startIndex || ii >= endIndex) {
                tb.removeChild(node);
              }else {

                if (ii === startIndex){
                  tmpRowspanArr.forEach((tmp) => {
                    let toInsertTd = tmp.node.cloneNode(true);
                    if (trs[ii].children.length >= tmp.cellIndex+1){
                      trs[ii].insertBefore(toInsertTd, trs[ii].children[tmp.cellIndex]);
                    }else {
                      trs[ii].appendChild(toInsertTd);
                    }
                    // node.insertBefore(toInsertTd, node.children[tmp.cellIndex]);
                  });
                }

                node.childNodes.forEach((child) => {
                  if (typeof child.style !== 'undefined'){
                    // display none 이 아니며 d-none 클래스가 없는 경우
                    if ((child.style.display !== 'none' && !child.classList.contains('d-none'))) {
                      // child 가 rowspan을 가지고 있을 경우
                      if (child.hasAttribute('rowspan') && parseInt(child.getAttribute('rowspan')) > 1) {
                        let tdObj = child.cloneNode(true);
                        tmpRowspanArr.push({
                          node: tdObj,
                          cellIndex: child.cellIndex,
                        });
                      }
                    }
                  }
                });

                for (let t = tmpRowspanArr.length - 1; t >= 0; t--) {
                  const tmp = tmpRowspanArr[t];
                  tmp.node.setAttribute('rowspan', parseInt(tmp.node.getAttribute('rowspan')) - 1);
                  if (parseInt(tmp.node.getAttribute('rowspan')) === 0) {
                    tmpRowspanArr.splice(t, 1);
                  }
                }

              }
            }

            let diff = zeroDiff ? 0 : rowCountPerPage - tb.querySelectorAll('tr:not([style*="display: none"])').length;
            if (diff > 0) {
              for (let ii = 0; ii < diff; ii++) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                if (trTdClass){
                  tr.classList.add(trTdClass);
                  td.classList.add(trTdClass);
                }
                // td 높이 맞춤을 위한 빈 특수문자 삽입
                td.innerText = '　';
                td.setAttribute('colspan', '100');
                tr.appendChild(td);
                if (hasTotalRow){
                  // tb 의 마지막 tr 바로 앞에 추가
                  tb.insertBefore(tr, tb.querySelector('tr:last-of-type'));
                }else {
                  tb.appendChild(tr);
                }
              }
            }

            htmlBody += `<div style="position: relative; margin-top: ${marginTopBottom}mm; margin-bottom: ${marginTopBottom}mm;">
                            ${copiedElement.outerHTML}
                          </div>`;

            startIndex = endIndex;
            endIndex += rowCountPerPage;
          }

          a4Width = `${mmWidth+marginLeftRight*2}mm`;
          a4Height = `${pageCount*((isLandscape ? mmWidth/1.4141 : mmWidth*1.4141)+marginTopBottom*2*2)}mm`;

          const styleCopy = (await this.copyStyleToNewWindowWithoutHover()).replaceAll(`32pxborder-top-left-radius:0border-top-right-radius:0border-bottom-left-radius:0border-bottom-right-radius:0`, `32px; border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;`);
          // 미리보기 팝업을 띄우기
          if (await this.showConfirm(`프린트를 위한 팝업창을 허용하시겠습니까?`) === false) {
            resolve('팝업창 허용이 필요합니다.');
            return;
          }else {
            let previewPopup;
            let previewContent;

            // 미리보기 팝업을 띄우기
            previewPopup = window.open('', '_blank', `width=${a4Width},height=${a4Height}`);
            previewContent = `<html><head><title>Print Preview</title><style>.d-none{display:none}${styleCopy}</style></head><body style="margin: 0px;">${htmlBody}</body></html>`;
            previewPopup.document.write(previewContent);

            previewPopup.document.childNodes[0].style.width = a4Width;
            previewPopup.document.childNodes[0].style.height = a4Height;


            // 포커스를 설정하고 0.5초 뒤에 프린트 도구 시작
            setTimeout(async () => {
              previewPopup.focus();

              const imgTags = previewPopup.document.childNodes[0].querySelectorAll('img');
              imgTags.forEach((img) => {
                img.style.imageRendering = 'optimizeQuality';
              });

              const pdf = new jsPDF(isLandscape ? "l" : "p", "mm", "a4");
              const pdfWidth = isLandscape ? 297 : 210; // A4 너비(mm)
              const pdfHeight = isLandscape ? 210 : 297; // A4 높이(mm)

              for (let d = 0; d < previewPopup.document.childNodes[0].childNodes[1].childNodes.length; d++) {
                const div = previewPopup.document.childNodes[0].childNodes[1].childNodes[d];
                // HTML 요소를 캡처하여 캔버스로 변환
                await html2canvas(div, { scale: 2 }).then((canvas) => {

                  // mm
                  const imgWidth = pdfWidth - 2 * marginLeftRight; // 여백을 뺀 이미지 너비
                  const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지 비율에 맞는 높이 계산

                  // mm
                  let heightLeft = imgHeight; // 남은 높이 계산
                  // let position = marginTopBottom; // 시작 위치 (상단 여백 적용)

                  // pdf 높이에서 상하 여백을 뺀 높이
                  let pdfHeightMinusMargin = pdfHeight;
                  let imgHeightPerPageArr = []; // 페이지별 이미지 높이 배열
                  while(heightLeft > 0){
                    if (heightLeft < pdfHeightMinusMargin){
                      imgHeightPerPageArr.push(heightLeft);
                    }else {
                      imgHeightPerPageArr.push(pdfHeightMinusMargin);
                    }
                    heightLeft -= pdfHeightMinusMargin;
                  }

                  let cuttedImgDataArr = [];
                  for (let i = 0; i < imgHeightPerPageArr.length; i++) {
                    let prevPxHeight = 0;
                    for (let ii = 0; ii < i; ii++) {
                      prevPxHeight += imgHeightPerPageArr[ii] * canvas.width / imgWidth;
                    }
                    const pxHeight = imgHeightPerPageArr[i] * canvas.width / imgWidth;
                    const cuttedCanvas = document.createElement('canvas');
                    cuttedCanvas.width = canvas.width;
                    cuttedCanvas.height = pxHeight;
                    const cuttedCtx = cuttedCanvas.getContext('2d');
                    // drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number)
                    cuttedCtx.drawImage(canvas, 0, prevPxHeight, canvas.width, pxHeight, 0, 0, canvas.width, pxHeight);
                    cuttedImgDataArr.push(cuttedCanvas.toDataURL("image/jpeg", 1.0));

                  }

                  // 이미지를 삽입(origin 로직이 아니라 사실상 반복문이 아님)
                  cuttedImgDataArr.forEach((imgData, index) => {
                    if (d > 0 || index > 0) pdf.addPage();
                    pdf.addImage(imgData, "JPEG", marginLeftRight, marginTopBottom, imgWidth, imgHeightPerPageArr[index]);
                  });

                  if (previewPopup.document.childNodes[0].childNodes[1].childNodes.length > 1){
                    // 페이지 번호 추가
                    const pageNumber = pdf.internal.getNumberOfPages();
                    pdf.setFontSize(10);
                    pdf.text(`${pageNumber}/${previewPopup.document.childNodes[0].childNodes[1].childNodes.length}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
                  }

                });
              }

              // // PDF 저장
              // pdf.save(fileName+'.pdf');

              // PDF 인쇄
              pdf.autoPrint();
              pdf.output('dataurlnewwindow');

              // // PDF 반환
              // const pdfBlob = pdf.output('blob');
              // const file = new File([pdfBlob], fileName + '.pdf', { type: 'application/pdf' });
              // resolve(file);

              setTimeout(() => {
                resolve();
                // 프린트 도구가 닫히면 팝업도 닫기
                setTimeout(() => {
                  previewPopup.close();
                }, 500);
              }, 500);

            }, 500);
          }


        } catch (error) {
          console.warn(error);
          reject();
        }

      }else { // originPrintLogic
        try {
          let thisElement;
          if (element.$el){
            thisElement = element.$el;
          }else {
            thisElement = element;
          }
          const imgTags = thisElement.querySelectorAll('img');
          imgTags.forEach((img) => {
            img.style.imageRendering = 'optimizeQuality';
          });

          setTimeout(async() => {

            // HTML 요소를 캡처하여 캔버스로 변환
            html2canvas(thisElement, { scale: 2 }).then((canvas) => {

              const pdf = new jsPDF("p", "mm", "a4");
              const pdfWidth = 210; // A4 너비(mm)
              const pdfHeight = 297; // A4 높이(mm)

              const imgWidth = pdfWidth - 2 * marginLeftRight; // 여백을 뺀 이미지 너비
              const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지 비율에 맞는 높이 계산

              let heightLeft = imgHeight; // 남은 높이 계산
              let position = marginTopBottom; // 시작 위치 (상단 여백 적용)

              // pdf 높이에서 상하 여백을 뺀 높이
              let pdfHeightMinusMargin = pdfHeight - 2 * marginTopBottom;
              let imgHeightPerPageArr = []; // 페이지별 이미지 높이 배열
              while(heightLeft > 0){
                if (heightLeft < pdfHeightMinusMargin){
                  imgHeightPerPageArr.push(heightLeft);
                }else {
                  imgHeightPerPageArr.push(pdfHeightMinusMargin);
                }
                heightLeft -= pdfHeightMinusMargin;
              }

              let cuttedImgDataArr = [];
              for (let i = 0; i < imgHeightPerPageArr.length; i++) {
                let prevPxHeight = 0;
                for (let ii = 0; ii < i; ii++) {
                  prevPxHeight += imgHeightPerPageArr[ii] * canvas.width / imgWidth;
                }
                const pxHeight = imgHeightPerPageArr[i] * canvas.width / imgWidth;
                const cuttedCanvas = document.createElement('canvas');
                cuttedCanvas.width = canvas.width;
                cuttedCanvas.height = pxHeight;
                const cuttedCtx = cuttedCanvas.getContext('2d');
                cuttedCtx.drawImage(canvas, 0, prevPxHeight, canvas.width, pxHeight, 0, 0, canvas.width, pxHeight);
                cuttedImgDataArr.push(cuttedCanvas.toDataURL("image/jpeg", 1.0));
              }

              // 이미지를 삽입
              cuttedImgDataArr.forEach((imgData, index) => {
                if (index > 0) pdf.addPage();
                pdf.addImage(imgData, "JPEG", marginLeftRight, position, imgWidth, imgHeightPerPageArr[index]);
              });

              // // PDF 저장
              // pdf.save(fileName+'.pdf');

              // PDF 인쇄
              pdf.autoPrint();
              pdf.output('dataurlnewwindow');

              // // PDF 반환
              // const pdfBlob = pdf.output('blob');
              // const file = new File([pdfBlob], fileName + '.pdf', { type: 'application/pdf' });
            });

            setTimeout(() => {
              resolve();
            }, 500);
          }, 1000);

        } catch (error) {
          console.warn(error);
          reject();
        }
      }
    });
  },

  /**
   * 전달 받은 HTML 의 PDF 파일 생성
   * @param {HTMLElement} element
   * @param {Object} paramObj
   * @param {string} paramObj.fileName - 파일명(기본값: 'data')
   * @param {number} paramObj.countingTableIndex - 테이블 인덱스(기본: 마지막 테이블)
   * @param {number} paramObj.rowCountPerPage - 페이지당 행 수(기본값: 27)
   * @param {number} paramObj.marginTopBottom - 페이지 상하 여백(기본값: 10)
   * @param {number} paramObj.marginLeftRight - 페이지 좌우 여백(기본값: 10)
   * @param {boolean} paramObj.mmWidth - 가로 mm(기본값: 210)
   * @param {boolean} paramObj.isLandscape - 가로 용지 여부(기본값: false)
   * @param {boolean} paramObj.hasTotalRow - 총합 행 여부(기본값: false
   * @param {boolean} paramObj.trTdClass - tr, td에 추가할 클래스명(기본값: '')
   * @param {boolean} paramObj.originPrintLogic - 기존 프린트 로직 사용 여부(기본값: false)
   * @example
   * mux.Util.getPDF(element, {fileName: 'data', countingTableIndex: 3, rowCountPerPage: 27, marginTopBottom: 10, marginLeftRight: 10, mmWidth: 210, isLandscape:false, hasTotalRow: false, trTdClass: 'approve_text', originPrintLogic: false});
   * @memberof mux.Util
   * @inner
   * @private
   * @returns {Promise}
   */
  async getPDF(element, paramObj){
    let fileName = 'data';
    let countingTableIndex = -1;
    let rowCountPerPage = 27;
    let marginTopBottom = 10;
    let marginLeftRight = 10;
    let mmWidth = 210;
    let isLandscape = false;
    let hasTotalRow = false;
    let trTdClass = '';
    let originPrintLogic = false;
    if (typeof paramObj === 'object'){
      if (paramObj.fileName){
        fileName = paramObj.fileName;
      }
      if (paramObj.countingTableIndex){
        countingTableIndex = paramObj.countingTableIndex;
      }
      if (paramObj.rowCountPerPage){
        rowCountPerPage = paramObj.rowCountPerPage;
      }
      if (paramObj.marginTopBottom){
        marginTopBottom = paramObj.marginTopBottom;
      }
      if (paramObj.marginLeftRight){
        marginLeftRight = paramObj.marginLeftRight;
      }
      if (paramObj.mmWidth){
        mmWidth = paramObj.mmWidth;
      }
      if (paramObj.isLandscape){
        isLandscape = paramObj.isLandscape;
      }
      if (paramObj.hasTotalRow){
        hasTotalRow = paramObj.hasTotalRow;
      }
      if (paramObj.trTdClass){
        trTdClass = paramObj.trTdClass;
      }
      if (paramObj.originPrintLogic){
        originPrintLogic = paramObj.originPrintLogic;
      }
    }

    return new Promise(async (resolve, reject) => {
      if (!originPrintLogic){
        try {
          let thisElement;
          if (element.$el){
            thisElement = element.$el;
          }else {
            thisElement = element;
          }

          let a4Width;
          let a4Height;
          let htmlBody = '';

          let tableList = thisElement.querySelectorAll('table');
          let countingTable = tableList[countingTableIndex < 0 ? tableList.length - 1 : countingTableIndex];
          let tbody = countingTable.querySelector('tbody');
          let trList = tbody.querySelectorAll('tr:not([style*="display: none"])');

          // NodeList를 배열로 변환
          let trArray = Array.from(trList);

          // rowCountPerPage 기준으로 행을 나누기
          let startIndex = 0;
          let endIndex = rowCountPerPage;
          let pageCount = Math.ceil(trArray.length / rowCountPerPage);

          let tmpRowspanArr = [];
          // 페이지 만들기
          for (let i = 0; i < pageCount; i++) {
            let copiedElement = thisElement.cloneNode(true);

            let tables = copiedElement.querySelectorAll('table');
            let targetTable = tables[countingTableIndex < 0 ? tables.length - 1 : countingTableIndex];
            let tb = targetTable.querySelector('tbody');
            let trs = tb.querySelectorAll('tr:not([style*="display: none"])');

            // NodeList를 배열로 변환
            let array = Array.from(trs);

            let zeroDiff = false;
            for (let ii = 0; ii < array.length; ii++) {
              const node = array[ii];

              if (hasTotalRow && i === pageCount - 2 && endIndex === array.length - 1){
                endIndex -= 1;
                zeroDiff = true;
              }
              if (ii < startIndex || ii >= endIndex) {
                tb.removeChild(node);
              }else {

                if (ii === startIndex){
                  tmpRowspanArr.forEach((tmp) => {
                    let toInsertTd = tmp.node.cloneNode(true);
                    if (trs[ii].children.length >= tmp.cellIndex+1){
                      trs[ii].insertBefore(toInsertTd, trs[ii].children[tmp.cellIndex]);
                    }else {
                      trs[ii].appendChild(toInsertTd);
                    }
                    // node.insertBefore(toInsertTd, node.children[tmp.cellIndex]);
                  });
                }

                node.childNodes.forEach((child) => {
                  if (typeof child.style !== 'undefined'){
                    // display none 이 아니며 d-none 클래스가 없는 경우
                    if ((child.style.display !== 'none' && !child.classList.contains('d-none'))) {
                      // child 가 rowspan을 가지고 있을 경우
                      if (child.hasAttribute('rowspan') && parseInt(child.getAttribute('rowspan')) > 1) {
                        let tdObj = child.cloneNode(true);
                        tmpRowspanArr.push({
                          node: tdObj,
                          cellIndex: child.cellIndex,
                        });
                      }
                    }
                  }
                });

                for (let t = tmpRowspanArr.length - 1; t >= 0; t--) {
                  const tmp = tmpRowspanArr[t];
                  tmp.node.setAttribute('rowspan', parseInt(tmp.node.getAttribute('rowspan')) - 1);
                  if (parseInt(tmp.node.getAttribute('rowspan')) === 0) {
                    tmpRowspanArr.splice(t, 1);
                  }
                }

              }
            }

            let diff = zeroDiff ? 0 : rowCountPerPage - tb.querySelectorAll('tr:not([style*="display: none"])').length;
            if (diff > 0) {
              for (let ii = 0; ii < diff; ii++) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                if (trTdClass){
                  tr.classList.add(trTdClass);
                  td.classList.add(trTdClass);
                }
                // td 높이 맞춤을 위한 빈 특수문자 삽입
                td.innerText = '　';
                td.setAttribute('colspan', '100');
                tr.appendChild(td);
                if (hasTotalRow){
                  // tb 의 마지막 tr 바로 앞에 추가
                  tb.insertBefore(tr, tb.querySelector('tr:last-of-type'));
                }else {
                  tb.appendChild(tr);
                }
              }
            }

            htmlBody += `<div style="position: relative; margin-top: ${marginTopBottom}mm; margin-bottom: ${marginTopBottom}mm;">
                            ${copiedElement.outerHTML}
                          </div>`;

            startIndex = endIndex;
            endIndex += rowCountPerPage;
          }

          a4Width = `${mmWidth+marginLeftRight*2}mm`;
          a4Height = `${pageCount*((isLandscape ? mmWidth/1.4141 : mmWidth*1.4141)+marginTopBottom*2*2)}mm`;

          const styleCopy = (await this.copyStyleToNewWindowWithoutHover()).replaceAll(`32pxborder-top-left-radius:0border-top-right-radius:0border-bottom-left-radius:0border-bottom-right-radius:0`, `32px; border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;`);
          // 미리보기 팝업을 띄우기
          if (await this.showConfirm(`PDF 파일 생성을 위한 팝업창을 허용하시겠습니까?`) === false) {
            resolve('팝업창 허용이 필요합니다.');
            return;
          }else {
            let previewPopup;
            let previewContent;

            // 미리보기 팝업을 띄우기
            previewPopup = window.open('', '_blank', `width=${a4Width},height=${a4Height}`);
            previewContent = `<html><head><title>Print Preview</title><style>.d-none{display:none}${styleCopy}</style></head><body style="margin: 0px;">${htmlBody}</body></html>`;
            previewPopup.document.write(previewContent);

            previewPopup.document.childNodes[0].style.width = a4Width;
            previewPopup.document.childNodes[0].style.height = a4Height;


            // 포커스를 설정하고 0.5초 뒤에 프린트 도구 시작
            setTimeout(async () => {
              previewPopup.focus();

              const imgTags = previewPopup.document.childNodes[0].querySelectorAll('img');
              imgTags.forEach((img) => {
                img.style.imageRendering = 'optimizeQuality';
              });

              const pdf = new jsPDF(isLandscape ? "l" : "p", "mm", "a4");
              const pdfWidth = isLandscape ? 297 : 210; // A4 너비(mm)
              const pdfHeight = isLandscape ? 210 : 297; // A4 높이(mm)

              for (let d = 0; d < previewPopup.document.childNodes[0].childNodes[1].childNodes.length; d++) {
                const div = previewPopup.document.childNodes[0].childNodes[1].childNodes[d];
                // HTML 요소를 캡처하여 캔버스로 변환
                await html2canvas(div, { scale: 2 }).then((canvas) => {

                  // mm
                  const imgWidth = pdfWidth - 2 * marginLeftRight; // 여백을 뺀 이미지 너비
                  const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지 비율에 맞는 높이 계산

                  // mm
                  let heightLeft = imgHeight; // 남은 높이 계산
                  // let position = marginTopBottom; // 시작 위치 (상단 여백 적용)

                  // pdf 높이에서 상하 여백을 뺀 높이
                  let pdfHeightMinusMargin = pdfHeight;
                  let imgHeightPerPageArr = []; // 페이지별 이미지 높이 배열
                  while(heightLeft > 0){
                    if (heightLeft < pdfHeightMinusMargin){
                      imgHeightPerPageArr.push(heightLeft);
                    }else {
                      imgHeightPerPageArr.push(pdfHeightMinusMargin);
                    }
                    heightLeft -= pdfHeightMinusMargin;
                  }

                  let cuttedImgDataArr = [];
                  for (let i = 0; i < imgHeightPerPageArr.length; i++) {
                    let prevPxHeight = 0;
                    for (let ii = 0; ii < i; ii++) {
                      prevPxHeight += imgHeightPerPageArr[ii] * canvas.width / imgWidth;
                    }
                    const pxHeight = imgHeightPerPageArr[i] * canvas.width / imgWidth;
                    const cuttedCanvas = document.createElement('canvas');
                    cuttedCanvas.width = canvas.width;
                    cuttedCanvas.height = pxHeight;
                    const cuttedCtx = cuttedCanvas.getContext('2d');
                    // drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number)
                    cuttedCtx.drawImage(canvas, 0, prevPxHeight, canvas.width, pxHeight, 0, 0, canvas.width, pxHeight);
                    cuttedImgDataArr.push(cuttedCanvas.toDataURL("image/jpeg", 1.0));

                  }

                  // 이미지를 삽입(origin 로직이 아니라 사실상 반복문이 아님)
                  cuttedImgDataArr.forEach((imgData, index) => {
                    if (d > 0 || index > 0) pdf.addPage();
                    pdf.addImage(imgData, "JPEG", marginLeftRight, marginTopBottom, imgWidth, imgHeightPerPageArr[index]);
                  });

                  if (previewPopup.document.childNodes[0].childNodes[1].childNodes.length > 1){
                    // 페이지 번호 추가
                    const pageNumber = pdf.internal.getNumberOfPages();
                    pdf.setFontSize(10);
                    pdf.text(`${pageNumber}/${previewPopup.document.childNodes[0].childNodes[1].childNodes.length}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
                  }

                });
              }

              // // PDF 저장
              // pdf.save(fileName+'.pdf');

              // // PDF 인쇄
              // pdf.autoPrint();
              // pdf.output('dataurlnewwindow');

              // PDF 반환
              const pdfBlob = pdf.output('blob');
              const file = new File([pdfBlob], fileName + '.pdf', { type: 'application/pdf' });

              setTimeout(() => {
                resolve(file);
                // 프린트 도구가 닫히면 팝업도 닫기
                setTimeout(() => {
                  previewPopup.close();
                }, 500);
              }, 500);

            }, 500);
          }


        } catch (error) {
          console.warn(error);
          reject();
        }

      }else { // originPrintLogic
        try {
          let thisElement;
          if (element.$el){
            thisElement = element.$el;
          }else {
            thisElement = element;
          }
          const imgTags = thisElement.querySelectorAll('img');
          imgTags.forEach((img) => {
            img.style.imageRendering = 'optimizeQuality';
          });

          setTimeout(async() => {

            // HTML 요소를 캡처하여 캔버스로 변환
            html2canvas(thisElement, { scale: 2 }).then((canvas) => {

              const pdf = new jsPDF("p", "mm", "a4");
              const pdfWidth = 210; // A4 너비(mm)
              const pdfHeight = 297; // A4 높이(mm)

              const imgWidth = pdfWidth - 2 * marginLeftRight; // 여백을 뺀 이미지 너비
              const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지 비율에 맞는 높이 계산

              let heightLeft = imgHeight; // 남은 높이 계산
              let position = marginTopBottom; // 시작 위치 (상단 여백 적용)

              // pdf 높이에서 상하 여백을 뺀 높이
              let pdfHeightMinusMargin = pdfHeight - 2 * marginTopBottom;
              let imgHeightPerPageArr = []; // 페이지별 이미지 높이 배열
              while(heightLeft > 0){
                if (heightLeft < pdfHeightMinusMargin){
                  imgHeightPerPageArr.push(heightLeft);
                }else {
                  imgHeightPerPageArr.push(pdfHeightMinusMargin);
                }
                heightLeft -= pdfHeightMinusMargin;
              }

              let cuttedImgDataArr = [];
              for (let i = 0; i < imgHeightPerPageArr.length; i++) {
                let prevPxHeight = 0;
                for (let ii = 0; ii < i; ii++) {
                  prevPxHeight += imgHeightPerPageArr[ii] * canvas.width / imgWidth;
                }
                const pxHeight = imgHeightPerPageArr[i] * canvas.width / imgWidth;
                const cuttedCanvas = document.createElement('canvas');
                cuttedCanvas.width = canvas.width;
                cuttedCanvas.height = pxHeight;
                const cuttedCtx = cuttedCanvas.getContext('2d');
                cuttedCtx.drawImage(canvas, 0, prevPxHeight, canvas.width, pxHeight, 0, 0, canvas.width, pxHeight);
                cuttedImgDataArr.push(cuttedCanvas.toDataURL("image/jpeg", 1.0));
              }

              // 이미지를 삽입
              cuttedImgDataArr.forEach((imgData, index) => {
                if (index > 0) pdf.addPage();
                pdf.addImage(imgData, "JPEG", marginLeftRight, position, imgWidth, imgHeightPerPageArr[index]);
              });

              // // PDF 저장
              // pdf.save(fileName+'.pdf');

              // // PDF 인쇄
              // pdf.autoPrint();
              // pdf.output('dataurlnewwindow');

              // PDF 반환
              const pdfBlob = pdf.output('blob');
              const file = new File([pdfBlob], fileName + '.pdf', { type: 'application/pdf' });

              setTimeout(() => {
                resolve(file);
              }, 500);
            });

          }, 1000);

        } catch (error) {
          console.warn(error);
          reject();
        }
      }
    });
  },

  /**
   * 전달 받은 HTML 의 PDF 파일 다운로드
   * @param {HTMLElement} element
   * @param {Object} paramObj
   * @param {string} paramObj.fileName - 파일명(기본값: 'data')
   * @param {number} paramObj.countingTableIndex - 테이블 인덱스(기본: 마지막 테이블)
   * @param {number} paramObj.rowCountPerPage - 페이지당 행 수(기본값: 27)
   * @param {number} paramObj.marginTopBottom - 페이지 상하 여백(기본값: 10)
   * @param {number} paramObj.marginLeftRight - 페이지 좌우 여백(기본값: 10)
   * @param {boolean} paramObj.mmWidth - 가로 mm(기본값: 210)
   * @param {boolean} paramObj.isLandscape - 가로 용지 여부(기본값: false)
   * @param {boolean} paramObj.hasTotalRow - 총합 행 여부(기본값: false
   * @param {boolean} paramObj.trTdClass - tr, td에 추가할 클래스명(기본값: '')
   * @param {boolean} paramObj.originPrintLogic - 기존 프린트 로직 사용 여부(기본값: false)
   * @example
   * mux.Util.downloadPDF(element, {fileName: 'data', countingTableIndex: 3, rowCountPerPage: 27, marginTopBottom: 10, marginLeftRight: 10, mmWidth: 210, isLandscape:false, hasTotalRow: false, trTdClass: 'approve_text', originPrintLogic: false});
   * @memberof mux.Util
   * @inner
   * @private
   * @returns {Promise}
   */
  async downloadPDF(element, paramObj){
    let fileName = 'data';
    let countingTableIndex = -1;
    let rowCountPerPage = 27;
    let marginTopBottom = 10;
    let marginLeftRight = 10;
    let mmWidth = 210;
    let isLandscape = false;
    let hasTotalRow = false;
    let trTdClass = '';
    let originPrintLogic = false;
    if (typeof paramObj === 'object'){
      if (paramObj.fileName){
        fileName = paramObj.fileName;
      }
      if (paramObj.countingTableIndex){
        countingTableIndex = paramObj.countingTableIndex;
      }
      if (paramObj.rowCountPerPage){
        rowCountPerPage = paramObj.rowCountPerPage;
      }
      if (paramObj.marginTopBottom){
        marginTopBottom = paramObj.marginTopBottom;
      }
      if (paramObj.marginLeftRight){
        marginLeftRight = paramObj.marginLeftRight;
      }
      if (paramObj.mmWidth){
        mmWidth = paramObj.mmWidth;
      }
      if (paramObj.isLandscape){
        isLandscape = paramObj.isLandscape;
      }
      if (paramObj.hasTotalRow){
        hasTotalRow = paramObj.hasTotalRow;
      }
      if (paramObj.trTdClass){
        trTdClass = paramObj.trTdClass;
      }
      if (paramObj.originPrintLogic){
        originPrintLogic = paramObj.originPrintLogic;
      }
    }

    return new Promise(async (resolve, reject) => {
      if (!originPrintLogic){
        try {
          let thisElement;
          if (element.$el){
            thisElement = element.$el;
          }else {
            thisElement = element;
          }

          let a4Width;
          let a4Height;
          let htmlBody = '';

          let tableList = thisElement.querySelectorAll('table');
          let countingTable = tableList[countingTableIndex < 0 ? tableList.length - 1 : countingTableIndex];
          let tbody = countingTable.querySelector('tbody');
          let trList = tbody.querySelectorAll('tr:not([style*="display: none"])');

          // NodeList를 배열로 변환
          let trArray = Array.from(trList);

          // rowCountPerPage 기준으로 행을 나누기
          let startIndex = 0;
          let endIndex = rowCountPerPage;
          let pageCount = Math.ceil(trArray.length / rowCountPerPage);

          let tmpRowspanArr = [];
          // 페이지 만들기
          for (let i = 0; i < pageCount; i++) {
            let copiedElement = thisElement.cloneNode(true);

            let tables = copiedElement.querySelectorAll('table');
            let targetTable = tables[countingTableIndex < 0 ? tables.length - 1 : countingTableIndex];
            let tb = targetTable.querySelector('tbody');
            let trs = tb.querySelectorAll('tr:not([style*="display: none"])');

            // NodeList를 배열로 변환
            let array = Array.from(trs);

            let zeroDiff = false;
            for (let ii = 0; ii < array.length; ii++) {
              const node = array[ii];

              if (hasTotalRow && i === pageCount - 2 && endIndex === array.length - 1){
                endIndex -= 1;
                zeroDiff = true;
              }
              if (ii < startIndex || ii >= endIndex) {
                tb.removeChild(node);
              }else {

                if (ii === startIndex){
                  tmpRowspanArr.forEach((tmp) => {
                    let toInsertTd = tmp.node.cloneNode(true);
                    if (trs[ii].children.length >= tmp.cellIndex+1){
                      trs[ii].insertBefore(toInsertTd, trs[ii].children[tmp.cellIndex]);
                    }else {
                      trs[ii].appendChild(toInsertTd);
                    }
                    // node.insertBefore(toInsertTd, node.children[tmp.cellIndex]);
                  });
                }

                node.childNodes.forEach((child) => {
                  if (typeof child.style !== 'undefined'){
                    // display none 이 아니며 d-none 클래스가 없는 경우
                    if ((child.style.display !== 'none' && !child.classList.contains('d-none'))) {
                      // child 가 rowspan을 가지고 있을 경우
                      if (child.hasAttribute('rowspan') && parseInt(child.getAttribute('rowspan')) > 1) {
                        let tdObj = child.cloneNode(true);
                        tmpRowspanArr.push({
                          node: tdObj,
                          cellIndex: child.cellIndex,
                        });
                      }
                    }
                  }
                });

                for (let t = tmpRowspanArr.length - 1; t >= 0; t--) {
                  const tmp = tmpRowspanArr[t];
                  tmp.node.setAttribute('rowspan', parseInt(tmp.node.getAttribute('rowspan')) - 1);
                  if (parseInt(tmp.node.getAttribute('rowspan')) === 0) {
                    tmpRowspanArr.splice(t, 1);
                  }
                }

              }
            }

            let diff = zeroDiff ? 0 : rowCountPerPage - tb.querySelectorAll('tr:not([style*="display: none"])').length;
            if (diff > 0) {
              for (let ii = 0; ii < diff; ii++) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                if (trTdClass){
                  tr.classList.add(trTdClass);
                  td.classList.add(trTdClass);
                }
                // td 높이 맞춤을 위한 빈 특수문자 삽입
                td.innerText = '　';
                td.setAttribute('colspan', '100');
                tr.appendChild(td);
                if (hasTotalRow){
                  // tb 의 마지막 tr 바로 앞에 추가
                  tb.insertBefore(tr, tb.querySelector('tr:last-of-type'));
                }else {
                  tb.appendChild(tr);
                }
              }
            }

            htmlBody += `<div style="position: relative; margin-top: ${marginTopBottom}mm; margin-bottom: ${marginTopBottom}mm;">
                            ${copiedElement.outerHTML}
                          </div>`;

            startIndex = endIndex;
            endIndex += rowCountPerPage;
          }

          a4Width = `${mmWidth+marginLeftRight*2}mm`;
          a4Height = `${pageCount*((isLandscape ? mmWidth/1.4141 : mmWidth*1.4141)+marginTopBottom*2*2)}mm`;

          const styleCopy = (await this.copyStyleToNewWindowWithoutHover()).replaceAll(`32pxborder-top-left-radius:0border-top-right-radius:0border-bottom-left-radius:0border-bottom-right-radius:0`, `32px; border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;`);
          // 미리보기 팝업을 띄우기
          if (await this.showConfirm(`PDF 파일 다운로드를 위한 팝업창을 허용하시겠습니까?`) === false) {
            resolve('팝업창 허용이 필요합니다.');
            return;
          }else {
            let previewPopup;
            let previewContent;

            // 미리보기 팝업을 띄우기
            previewPopup = window.open('', '_blank', `width=${a4Width},height=${a4Height}`);
            previewContent = `<html><head><title>Print Preview</title><style>.d-none{display:none}${styleCopy}</style></head><body style="margin: 0px;">${htmlBody}</body></html>`;
            previewPopup.document.write(previewContent);

            previewPopup.document.childNodes[0].style.width = a4Width;
            previewPopup.document.childNodes[0].style.height = a4Height;


            // 포커스를 설정하고 0.5초 뒤에 프린트 도구 시작
            setTimeout(async () => {
              previewPopup.focus();

              const imgTags = previewPopup.document.childNodes[0].querySelectorAll('img');
              imgTags.forEach((img) => {
                img.style.imageRendering = 'optimizeQuality';
              });

              const pdf = new jsPDF("p", "mm", "a4");
              const pdfWidth = 210; // A4 너비(mm)
              const pdfHeight = 297; // A4 높이(mm)

              for (let d = 0; d < previewPopup.document.childNodes[0].childNodes[1].childNodes.length; d++) {
                const div = previewPopup.document.childNodes[0].childNodes[1].childNodes[d];
                // HTML 요소를 캡처하여 캔버스로 변환
                await html2canvas(div, { scale: 2 }).then((canvas) => {

                  // mm
                  const imgWidth = pdfWidth - 2 * marginLeftRight; // 여백을 뺀 이미지 너비
                  const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지 비율에 맞는 높이 계산

                  // mm
                  let heightLeft = imgHeight; // 남은 높이 계산
                  // let position = marginTopBottom; // 시작 위치 (상단 여백 적용)

                  // pdf 높이에서 상하 여백을 뺀 높이
                  let pdfHeightMinusMargin = pdfHeight;
                  let imgHeightPerPageArr = []; // 페이지별 이미지 높이 배열
                  while(heightLeft > 0){
                    if (heightLeft < pdfHeightMinusMargin){
                      imgHeightPerPageArr.push(heightLeft);
                    }else {
                      imgHeightPerPageArr.push(pdfHeightMinusMargin);
                    }
                    heightLeft -= pdfHeightMinusMargin;
                  }

                  let cuttedImgDataArr = [];
                  for (let i = 0; i < imgHeightPerPageArr.length; i++) {
                    let prevPxHeight = 0;
                    for (let ii = 0; ii < i; ii++) {
                      prevPxHeight += imgHeightPerPageArr[ii] * canvas.width / imgWidth;
                    }
                    const pxHeight = imgHeightPerPageArr[i] * canvas.width / imgWidth;
                    const cuttedCanvas = document.createElement('canvas');
                    cuttedCanvas.width = canvas.width;
                    cuttedCanvas.height = pxHeight;
                    const cuttedCtx = cuttedCanvas.getContext('2d');
                    // drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number)
                    cuttedCtx.drawImage(canvas, 0, prevPxHeight, canvas.width, pxHeight, 0, 0, canvas.width, pxHeight);
                    cuttedImgDataArr.push(cuttedCanvas.toDataURL("image/jpeg", 1.0));

                  }

                  // 이미지를 삽입(origin 로직이 아니라 사실상 반복문이 아님)
                  cuttedImgDataArr.forEach((imgData, index) => {
                    if (d > 0 || index > 0) pdf.addPage();
                    pdf.addImage(imgData, "JPEG", marginLeftRight, marginTopBottom, imgWidth, imgHeightPerPageArr[index]);
                  });

                  if (previewPopup.document.childNodes[0].childNodes[1].childNodes.length > 1){
                    // 페이지 번호 추가
                    const pageNumber = pdf.internal.getNumberOfPages();
                    pdf.setFontSize(10);
                    pdf.text(`${pageNumber}/${previewPopup.document.childNodes[0].childNodes[1].childNodes.length}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
                  }

                });
              }

              // PDF 저장
              pdf.save(fileName+'.pdf');

              // // PDF 인쇄
              // pdf.autoPrint();
              // pdf.output('dataurlnewwindow');

              // // PDF 반환
              // const pdfBlob = pdf.output('blob');
              // const file = new File([pdfBlob], fileName + '.pdf', { type: 'application/pdf' });
              // resolve(file);

              setTimeout(() => {
                resolve();
                // 프린트 도구가 닫히면 팝업도 닫기
                setTimeout(() => {
                  previewPopup.close();
                }, 500);
              }, 500);

            }, 500);
          }


        } catch (error) {
          console.warn(error);
          reject();
        }

      }else { // originPrintLogic
        try {
          let thisElement;
          if (element.$el){
            thisElement = element.$el;
          }else {
            thisElement = element;
          }
          const imgTags = thisElement.querySelectorAll('img');
          imgTags.forEach((img) => {
            img.style.imageRendering = 'optimizeQuality';
          });

          setTimeout(async() => {

            // HTML 요소를 캡처하여 캔버스로 변환
            html2canvas(thisElement, { scale: 2 }).then((canvas) => {

              const pdf = new jsPDF("p", "mm", "a4");
              const pdfWidth = 210; // A4 너비(mm)
              const pdfHeight = 297; // A4 높이(mm)

              const imgWidth = pdfWidth - 2 * marginLeftRight; // 여백을 뺀 이미지 너비
              const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지 비율에 맞는 높이 계산

              let heightLeft = imgHeight; // 남은 높이 계산
              let position = marginTopBottom; // 시작 위치 (상단 여백 적용)

              // pdf 높이에서 상하 여백을 뺀 높이
              let pdfHeightMinusMargin = pdfHeight - 2 * marginTopBottom;
              let imgHeightPerPageArr = []; // 페이지별 이미지 높이 배열
              while(heightLeft > 0){
                if (heightLeft < pdfHeightMinusMargin){
                  imgHeightPerPageArr.push(heightLeft);
                }else {
                  imgHeightPerPageArr.push(pdfHeightMinusMargin);
                }
                heightLeft -= pdfHeightMinusMargin;
              }

              let cuttedImgDataArr = [];
              for (let i = 0; i < imgHeightPerPageArr.length; i++) {
                let prevPxHeight = 0;
                for (let ii = 0; ii < i; ii++) {
                  prevPxHeight += imgHeightPerPageArr[ii] * canvas.width / imgWidth;
                }
                const pxHeight = imgHeightPerPageArr[i] * canvas.width / imgWidth;
                const cuttedCanvas = document.createElement('canvas');
                cuttedCanvas.width = canvas.width;
                cuttedCanvas.height = pxHeight;
                const cuttedCtx = cuttedCanvas.getContext('2d');
                cuttedCtx.drawImage(canvas, 0, prevPxHeight, canvas.width, pxHeight, 0, 0, canvas.width, pxHeight);
                cuttedImgDataArr.push(cuttedCanvas.toDataURL("image/jpeg", 1.0));
              }

              // 이미지를 삽입
              cuttedImgDataArr.forEach((imgData, index) => {
                if (index > 0) pdf.addPage();
                pdf.addImage(imgData, "JPEG", marginLeftRight, position, imgWidth, imgHeightPerPageArr[index]);
              });

              // PDF 저장
              pdf.save(fileName+'.pdf');

              // // PDF 인쇄
              // pdf.autoPrint();
              // pdf.output('dataurlnewwindow');

              // // PDF 반환
              // const pdfBlob = pdf.output('blob');
              // const file = new File([pdfBlob], fileName + '.pdf', { type: 'application/pdf' });
              // resolve(file);

              setTimeout(() => {
                resolve();
              }, 500);
            });

          }, 1000);

        } catch (error) {
          console.warn(error);
          reject();
        }
      }
    });
  },

  uint8ArrayToHexString(uint8Array) {
      return '0x' + Array.from(uint8Array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
  },

  hexToUint8Array(hexString) {
    if (hexString.length % 2 !== 0) {
        throw new Error('Invalid hex string');
    }
    if(hexString.startsWith('0x')){
      hexString = hexString.slice(2);
    }
    const uint8Array = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        uint8Array[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return uint8Array;
  },

  imageBinary(thumbnail){
    if(thumbnail){
      try {
        let imgURL = mux.Util.binaryToURL(mux.Util.hexToUint8Array(thumbnail));
        return imgURL
      } catch{
        return '';
      }
    }
  },

  binaryToURL(binary){
    if (binary){
      return URL.createObjectURL(new Blob([binary]));
    }else {
      return '';
    }
  },

  /**
   * URL을 바이너리 데이터로 변환
   * @param {string} url
   * @returns {Promise<Uint8Array>}
   */
  async urlToBinary(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        if (xhr.status === 200) {
          const arrayBuffer = xhr.response;
          const binaryData = new Uint8Array(arrayBuffer);
          resolve(binaryData);
        } else {
          reject(new Error('Failed to load binary data from URL'));
        }
      };
      xhr.onerror = function () {
        reject(new Error('Failed to load binary data from URL'));
      };
      xhr.send();
    });
  },

  resizeImageToBinary(file, maxWidth, maxHeight){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
          let width = img.width;
          let height = img.height;

          // 이미지가 목표치보다 큰 경우에만 리사이징
          if (width > maxWidth || height > maxHeight) {
            const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
            width *= scaleFactor;
            height *= scaleFactor;
          }

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // 캔버스의 이미지 데이터를 JPEG 형식의 바이너리로 반환
          canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = function() {
              const binaryData = new Uint8Array(reader.result);
              resolve(binaryData);
            };
            reader.onerror = function(error) {
              reject(error);
            };
          }, 'image/jpeg');
        };
      };
      reader.onerror = function(error) {
        reject(error);
      };
    });
  },

  getPdfThumbnail(file, pageNumber = 1, getURL = false, maxWidth = 9999, maxHeight = 9999){
    return new Promise((resolve, reject) => {
      try {
        // PDF 파일을 로드합니다.
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const worker = new pdfjsLib.PDFWorker();
          const arrayBuffer = fileReader.result;
          const pdf = await pdfjsLib.getDocument({data: arrayBuffer, worker: worker}).promise.then(pdf => pdf);

          // 첫 번째 페이지를 렌더링합니다.
          const page = await pdf.getPage(pageNumber);

          // Canvas에 페이지를 렌더링합니다.
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          let viewport = page.getViewport({ scale: 2 });
          if (viewport.width > maxWidth || viewport.height > maxHeight) {
            const scaleFactor = Math.min(maxWidth / viewport.width, maxHeight / viewport.height);
            viewport = page.getViewport({ scale: scaleFactor });
          }
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;

          if (getURL){
            // Canvas를 이미지로 변환합니다.
            const imageDataUrl = canvas.toDataURL();
            resolve(imageDataUrl);
          }else {
            // 캔버스의 이미지 데이터를 JPEG 형식의 바이너리로 반환
            canvas.toBlob((blob) => {
              const reader = new FileReader();
              reader.readAsArrayBuffer(blob);
              reader.onload = function() {
                const binaryData = new Uint8Array(reader.result);
                resolve(binaryData);
              };
              reader.onerror = function(error) {
                reject(error);
              };
            }, 'image/jpeg');
            // // 이미지 데이터를 바이너리로 변환합니다.
            // const binaryData = atob(imageDataUrl.split(',')[1]);
            // resolve(binaryData);
          }
        };
        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  },

  checkTypeImage(files, self) {
    return new Promise((resolve) => {
      // Get the selected file
      if (!files) {
        resolve(false);
        return;
      }

      if (Array.isArray(files)) {
        // files is an array of file objects
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // Check the file type
          if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
            // Invalid file type, show an error message
            mux.Util.showAlert('허용되지 않는 파일 형식입니다. jpeg, jpg, png 확장자의 이미지 파일만 첨부 가능합니다.');
            files.length = 0;
            resolve(false);
            return;
          }
        }
      } else {
        // files is a single file object
        const file = files;
        // Check the file type
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
          // Invalid file type, show an error message
          mux.Util.showAlert('허용되지 않는 파일 형식입니다. jpeg, jpg, png 확장자의 이미지 파일만 첨부 가능합니다.');
          self.reset();
          self.$el.querySelector('input[type="file"]').value = '';
          resolve(false);
          return;
        }
      }
      resolve(true);
    });
  },

  checkTypePdf(files, self) {
    return new Promise((resolve) => {
      // Get the selected file
      if (!files) {
        resolve(false);
        return;
      }

      if (Array.isArray(files)) {
        // files is an array of file objects
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // Check the file type
          if (file.type !== 'application/pdf') {
            // Invalid file type, show an error message
            mux.Util.showAlert('허용되지 않는 파일 형식입니다. pdf 파일만 첨부 가능합니다.');
            files.length = 0;
            resolve(false);
            return;
          }
        }
      } else {
        // files is a single file object
        const file = files;
        // Check the file type
        if (file.type !== 'application/pdf') {
          // Invalid file type, show an error message
          mux.Util.showAlert('허용되지 않는 파일 형식입니다. pdf 파일만 첨부 가능합니다.');
          self.reset();
          self.$el.querySelector('input[type="file"]').value = '';
          resolve(false);
          return;
        }
      }
      resolve(true);
    });
  },

  checkTypeExcel(files, self) {
    return new Promise((resolve) => {
      // Get the selected file
      if (!files) {
        resolve(false);
        return;
      }

      if (Array.isArray(files)) {
        // files is an array of file objects
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // Check the file type
          if (file.name.split('.').pop() !== 'xlsx' && file.name.split('.').pop() !== 'xls') {
            // Invalid file type, show an error message
            mux.Util.showAlert('허용되지 않는 파일 형식입니다. xlsx, xls 확장자의 엑셀 파일만 첨부 가능합니다.');
            files.length = 0;
            resolve(false);
            return;
          }
        }
      } else {
        // files is a single file object
        const file = files;
        // Check the file type
        if (file.name.split('.').pop() !== 'xlsx' && file.name.split('.').pop() !== 'xls') {
          // Invalid file type, show an error message
          mux.Util.showAlert('허용되지 않는 파일 형식입니다. xlsx, xls 확장자의 엑셀 파일만 첨부 가능합니다.');
          self.reset();
          self.$el.querySelector('input[type="file"]').value = '';
          resolve(false);
          return;
        }
      }
      resolve(true);
    });
  },

  copyStyleToNewWindow() {
    var styles = '';
    var styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
    styleElements.forEach(function(styleElement) {
      styles += styleElement.outerHTML;
    });

    return styles;
  },
  
  async copyStyleToNewWindowWithoutHover() {
    var styles = '';
    var styleElements = document.querySelectorAll('style, link[rel="stylesheet"]');
    
    for (let styleElement of styleElements) {
        if (styleElement.tagName === 'LINK') {
            // 외부 CSS 파일을 가져옴 (비동기 처리)
            const response = await fetch(styleElement.href);
            let css = await response.text();
            css = css.replace(/(?:^|\})([^{]*):hover([^{]*)\{/g, ''); // :hover 제거
            styles += `<style type="text/css">${css}</style>`;
        } else {
            // 인라인 스타일 복제 (동기 처리)
            var clonedElement = styleElement.cloneNode(true);
            
            // textContent 대신 innerHTML 사용
            var styleText = clonedElement.innerHTML; // CSS를 포함한 HTML을 복사
            styleText = styleText.replace(/(?:^|\})([^{]*):hover([^{]*)\{/g, ''); // :hover 제거

            // 수정된 스타일을 다시 설정
            clonedElement.innerHTML = styleText;

            // 복제된 스타일 태그를 결과에 추가
            styles += clonedElement.outerHTML;
        }
    }
    return styles;
  },

  showAlert(message, title = '알림', timeout = 0) {
    let messageStr = '';
    if (typeof message !== 'object') {
      try {
        message = JSON.parse(message);
      } catch (error) {
        messageStr = message;
      }
    }
    if (typeof message === 'object') {
      if (message.response){
        if (message.response.response){
          if (message.response.response.data.message){
            messageStr = message.response.response.data.message;
          }else if (message.response.response.data.msg){
            messageStr = message.response.response.data.msg;
          }else if (message.response.response.data.failed_info){
            if (message.response.response.data.failed_info.message){
              messageStr = message.response.response.data.failed_info.message;
            }else if (message.response.response.data.failed_info.msg){
              messageStr = message.response.response.data.failed_info.msg;
            }else {
              messageStr = message.response.response.data.failed_info;
            }
          }else {
            messageStr = message.response.response.data;
          }
        }else if (message.response.data){
          if (message.response.data.message){
            messageStr = message.response.data.message;
          }else if (message.response.data.msg){
            messageStr = message.response.data.msg;
          }else if (message.response.data.failed_info){
            if (message.response.data.failed_info.message){
              messageStr = message.response.data.failed_info.message;
            }else if (message.response.data.failed_info.msg){
              messageStr = message.response.data.failed_info.msg;
            }else {
              messageStr = message.response.data.failed_info;
            }
          }else {
            messageStr = message.response.data;
          }
        }else {
          messageStr = message.response;
        }
      }else if (message.data){
        if (message.data.message){
          messageStr = message.data.message;
        }else if (message.data.msg){
          messageStr = message.data.msg;
        }else if (message.data.failed_info){
          if (message.data.failed_info.message){
            messageStr = message.data.failed_info.message;
          }else if (message.data.failed_info.msg){
            messageStr = message.data.failed_info.msg;
          }else {
            messageStr = message.data.failed_info;
          }
        }else {
          messageStr = message.data;
        }
      }else if (message.msg){
        messageStr = message.msg;
      }else if (message.failed_info){
        if (message.failed_info.message){
          messageStr = message.failed_info.message;
        }else if (message.failed_info.msg){
          messageStr = message.failed_info.msg;
        }else {
          messageStr = message.failed_info;
        }
      }else if (message.message){
        messageStr = message.message;
      }else if (message.error){
        if (message.error.message){
          messageStr = message.error.message;
        }else if (message.error.msg){
          messageStr = message.error.msg;
        }else {
          messageStr = message.error;
        }
      }else {
        messageStr = message;
      }
    }

    if (typeof messageStr !== 'string'){
      messageStr = JSON.stringify(messageStr);
    }

    const modalInstance = new AlertConstructor({
      propsData: { message: messageStr, title, timeout }
    });

    modalInstance.$mount();
    document.body.appendChild(modalInstance.$el);
    modalInstance.show();

    modalInstance.$on('close', () => {
      document.body.removeChild(modalInstance.$el);
      modalInstance.$destroy();
    });

    return modalInstance;
  },

  showConfirm(message, title = '확인', useInput = false, confirmText = '확인', cancelText = '취소') {
    return new Promise((resolve) => {
      let messageStr = '';
      if (typeof message === 'object') {
        if (message.message){
          messageStr = message.message;
        }else if (message.msg){
          messageStr = message.msg;
        }else {
          messageStr = message;
        }
      }else {
        messageStr = message;
      }
      if (typeof messageStr !== 'string'){
        messageStr = JSON.stringify(messageStr);
      }

      const confirmInstance = new ConfirmConstructor({
        propsData: { message: messageStr, title, useInput, confirmText, cancelText }
      });

      confirmInstance.$mount();
      document.body.appendChild(confirmInstance.$el);
      confirmInstance.show();

      confirmInstance.$on('close', (result) => {
        resolve(result);
        document.body.removeChild(confirmInstance.$el);
        confirmInstance.$destroy();
      });
    });
  },

  showLoading(hideOverlay = false) {
    this.hideLoading();

    loadingInstance = new LoadingConstructor({
      propsData: { dialogValue: true, hideOverlay }
    });

    loadingInstance.$mount();
    document.body.appendChild(loadingInstance.$el);
  },
  hideLoading() {
    if (loadingInstance) {
      document.body.removeChild(loadingInstance.$el); // DOM에서 제거
      loadingInstance.$destroy(); // 인스턴스 파괴
      loadingInstance = null; // 참조 초기화
    }
  }

}

/**
 * 유효성 검사 관련 함수 그룹
 * @namespace Valid
 */
mux.Valid = {

  /**
   * 주어진 값이 유효한지 여부를 검사하는 함수입니다.
   *
   * @param {string|number|HTMLElement} value - 검사할 값
   * @param {(string|RegExp)} method - 사용할 유효성 검사 방법 또는 사용자 정의 정규식
   *  - num, str, date, tel, telGlobal, email, password, url, zipCode, username,
        creditCard, time24, hexColor, ipv4, hexNumber, slug, ssn, creditCardExpiration,
        currency, alphaNumeric, uuid, creditCardCVV, percentage, macAddress,
        ISBN, vin, hexCode
   * @returns {boolean} 유효하면 true, 그렇지 않으면 false
   *
   * @example
   * // 날짜 형식 유효성 검사
   * validate('2024-02-02', 'date'); // true
   *
   * // 사용자 정의 정규식을 사용한 검사
   * const customRegex = /^[a-z]+$/;
   * validate('john_doe', customRegex); // true
   *
   * num: 숫자만 허용 (예시: '123')
    str: 알파벳 문자만 허용 (예시: 'aBc')
    date: 날짜 형식 (YYYY-MM-DD) (예시: '2024-02-02')
    tel: 전화번호 형식 (10자리 숫자) (예시: '1234567890')
    telGlobal: 국제 전화번호 형식 (예시: '+123 4567 8901')
    email: 이메일 형식 (예시: 'user@mail.com')
    password: 비밀번호 형식 (문자, 숫자, 특수문자 2가지 이상 조합. 8자리 이상. (금지 : ' " ` \) ) (예시: 'Passw0rd')
    url: URL 형식 (예시: 'http://www.example.com')
    zipCode: 우편번호 형식 (예시: '12345' 또는 '12345-6789')
    username: 사용자 이름 형식 (예시: 'user_123')
    creditCard: 신용카드 번호 형식 (예시: '1234-5678-9012-3456')
    time24: 24시간 형식 시간 (예시: '14:30')
    hexColor: 16진수 색상 코드 (예시: '#ff0000' 또는 'a1b2c3')
    ipv4: IPv4 주소 (예시: '192.168.1.1')
    hexNumber: 16진수 숫자 (예시: '0x1a2b3c')
    slug: Slug 형식 (예시: 'my-awesome-slug')
    ssn: SSN 형식 (예시: '123-45-6789')
    creditCardExpiration: 신용카드 만료일 형식 (예시: '01/23')
    currency: 통화 형식 (예시: '123' 또는 '123.45')
    alphaNumeric: 알파벳 및 숫자 (예시: 'abc123')
    uuid: UUID 형식 (예시: '123e4567-e89b-12d3-a456-426614174001')
    creditCardCVV: 신용카드 CVV (예시: '123')
    percentage: 백분율 (예시: '50' 또는 '99.99')
    macAddress: MAC 주소 (예시: '01:23:45:67:89:ab')
    ISBN: ISBN 형식 (예시: '9780123456789' 또는 '979012345678X')
    vin: VIN 형식 (예시: '1HGCM82633A123456')
    hexCode: 16진수 색상 코드 또는 단축 코드 (예시: '#f00' 또는 '#a1b2c3')
   */
  validate(value, method) {

    /**
     * 미리 정의된 유효성 검사 방법과 정규식을 포함하는 객체입니다.
     * @type {Object.<string, RegExp>}
     */
    const methods = {
        num: /^[0-9]+$/, // 숫자만 허용 (예시: '123')
        str: /^[a-zA-Z]+$/, // 알파벳 문자만 허용 (예시: 'aBc')
        date: /^\d{4}-\d{2}-\d{2}$/, // 날짜 형식 (YYYY-MM-DD) (예시: '2024-02-02')
        tel: /^\d{10}$/, // 전화번호 형식 (10자리 숫자) (예시: '1234567890')
        telGlobal: /^\+(?:[0-9] ?){6,14}[0-9]$/, // 국제 전화번호 형식 (예시: '+123 4567 8901')
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // 이메일 형식 (예시: 'user@example.com')
        // 비밀번호 형식 (문자, 숫자, 특수문자 2가지 이상 조합. 8자리 이상. (금지 : ' " ` \) ) (예시: 'Passw0rd')
        password: /^(?:(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[~!@#$%^&*()\-_=+[{\]}|;:/?.>,<])|(?=.*\d)(?=.*[~!@#$%^&*()\-_=+[{\]}|;:/?.>,<]))[^' "`\\]{8,}$/,
        url: /^(https?|ftp):\/\/[^\s/$.?#]\.[^\s]*$/i, // URL 형식 (예시: 'http://www.example.com')
        zipCode: /^\d{5}(-\d{4})?$/, // 우편번호 형식 (예시: '12345' 또는 '12345-6789')
        username: /^[a-zA-Z0-9_]{3,20}$/, // 사용자 이름 형식 (예시: 'user_123')
        creditCard: /^\d{4}-\d{4}-\d{4}-\d{4}$/, // 신용카드 번호 형식 (예시: '1234-5678-9012-3456')
        time24: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // 24시간 형식 시간 (예시: '14:30')
        hexColor: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, // 16진수 색상 코드 (예시: '#ff0000' 또는 'a1b2c3')
        ipv4: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // IPv4 주소 (예시: '192.168.1.1')
        hexNumber: /^0x[0-9a-fA-F]+$/, // 16진수 숫자 (예시: '0x1a2b3c')
        slug: /^[a-z0-9-]+$/, // Slug 형식 (예시: 'my-awesome-slug')
        ssn: /^\d{3}-\d{2}-\d{4}$/, // SSN 형식 (예시: '123-45-6789')
        creditCardExpiration: /^(0[1-9]|1[0-2])\/\d{2}$/, // 신용카드 만료일 형식 (예시: '01/23')
        currency: /^\d+(\.\d{1,2})?$/, // 통화 형식 (예시: '123' 또는 '123.45')
        alphaNumeric: /^[a-zA-Z0-9]+$/, // 알파벳 및 숫자 (예시: 'abc123')
        uuid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, // UUID 형식 (예시: '123e4567-e89b-12d3-a456-426614174001')
        creditCardCVV: /^[0-9]{3,4}$/, // 신용카드 CVV (예시: '123')
        percentage: /^100(?:\.0{1,2})?$|^\d{0,2}(?:\.\d{1,2})?$/, // 백분율 (예시: '50' 또는 '99.99')
        macAddress: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, // MAC 주소 (예시: '01:23:45:67:89:ab')
        ISBN: /^(97(8|9))?\d{9}(\d|X)$/, // ISBN 형식 (예시: '9780123456789' 또는 '979012345678X')
        vin: /^[A-HJ-NPR-Za-hj-npr-z\d]{17}$/, // VIN 형식 (예시: '1HGCM82633A123456')
        hexCode: /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/, // 16진수 색상 코드 또는 단축 코드 (예시: '#f00' 또는 '#a1b2c3')
        customRegex: null
    };

    // 사용자 정의 유효성 검사 추가
    if (method instanceof RegExp) {
        methods.customRegex = method;
    }

    // HTMLElement 의 내부 값 또는 숫자를 문자열로 변환
    value = mux.Get.getValueAt(value) + "";

    /**
     * 주어진 값이 주어진 유효성 검사 방법에 부합하는지 여부를 확인합니다.
     * @param {string} value - 검사할 값
     * @returns {boolean} 부합하면 true, 그렇지 않으면 false
     * @private
     */
    function validateWithMethod(value) {
        if (typeof methods[method] !== 'undefined' && methods[method] instanceof RegExp) {
            return methods[method].test(value);
        } else {
            if (methods.customRegex instanceof RegExp) {
                return methods.customRegex.test(value);
            } else {
                // console.error('Invalid validation method');
                return false;
            }
        }
    }

    return validateWithMethod(value);
  }

}

/**
 * 스타일 관련 유틸리티 함수 그룹
 * @namespace Style
 */
mux.Style = {

  /**
   * 주어진 HTMLElement에 대해 주어진 방향에 해당하는 테두리 색상을 변경합니다.
   *
   * @param {HTMLElement} element - 색상을 변경할 HTMLElement.
   * @param {string} color - 적용할 테두리 색상 (CSS 색상 문자열).
   *                         헥스코드, 색상 이름 등 모든 유효한 CSS 색상 형식이 가능합니다.
   * @param {string} [direction] - 적용할 방향. "top" 또는 "up", "right", "left", "bottom" 또는 "down" 중 하나.
   *                               전달하지 않거나 유효한 값이 아닌 경우 모든 방향에 적용됩니다.
   * @example
   * var myElement = document.getElementById("myElement");
   * mux.Style.borderColor(myElement, "orange");  // 모든 테두리에 색상 적용
   * mux.Style.borderColor(myElement, "red", "top");    // 위쪽 테두리에만 색상 적용
   * mux.Style.borderColor(myElement, "rgb(0, 255, 0)", "up");    // 위쪽 테두리에만 색상 적용
   * mux.Style.borderColor(myElement, "green", "right"); // 오른쪽 테두리에만 색상 적용
   */
  borderColor(element, color, direction) {
    // 전달된 element가 유효한지 확인
    if (!(element instanceof HTMLElement)) {
        // console.error("borderColor(): 유효한 HTMLElement를 전달해주세요.");
        return;
    }

    // 전달된 direction이 유효한지 확인하고, 적용할 방향을 설정
    let validDirections = ["top", "up", "right", "bottom", "down", "left"];
    let applyAllDirections = !direction || !validDirections.includes(direction.toLowerCase());

    // 테두리 색상 변경
    if (applyAllDirections || direction === "top" || direction === "up") {
        element.style.borderTopColor = color;
    }
    if (applyAllDirections || direction === "right") {
        element.style.borderRightColor = color;
    }
    if (applyAllDirections || direction === "bottom" || direction === "down") {
        element.style.borderBottomColor = color;
    }
    if (applyAllDirections || direction === "left") {
        element.style.borderLeftColor = color;
    }
  },

  /**
   * 주어진 HTMLElement의 테두리 굵기를 변경합니다.
   *
   * @param {HTMLElement} element - 굵기를 변경할 HTMLElement.
   * @param {string | number} thickness - 적용할 테두리 굵기. "thin", "medium", "thick", "bold" 또는 숫자(단위는 px) 중 하나.
   *                                      전달하지 않거나 유효한 값이 아닌 경우 기본 굵기로 설정됩니다.
   * @example
   * var myElement = document.getElementById("myElement");
   * mux.Style.borderWidth(myElement, "medium");  // 중간 굵기의 테두리
   * mux.Style.borderWidth(myElement, "thick");   // 두꺼운 테두리
   * mux.Style.borderWidth(myElement, "bold");    // 굵은 테두리
   * mux.Style.borderWidth(myElement, 1);         // 숫자로 지정 (단위: px)
   * mux.Style.borderWidth(myElement, 10);        // 숫자로 지정 (단위: px)
   * mux.Style.borderWidth(myElement, '2px');     // 문자열로 지정 (단위: px)
   * mux.Style.borderWidth(myElement);            // 기본 굵기로 설정
   */
  borderWidth(element, thickness) {
    // 전달된 element가 유효한지 확인
    if (!(element instanceof HTMLElement)) {
        // console.error("borderWidth(): 유효한 HTMLElement를 전달해주세요.");
        return;
    }

    // 전달된 thickness가 유효한지 확인하고, 테두리 굵기를 설정
    let borderThickness;

    if (typeof thickness === 'string') {
        // 문자열인 경우 "thin", "medium", "thick" 또는 숫자(단위: px) 중 하나인지 확인
        borderThickness = isNaN(parseFloat(thickness)) ? thickness : `${parseFloat(thickness)}px`;
    } else if (typeof thickness === 'number') {
        // 숫자인 경우 px 단위를 추가
        borderThickness = `${thickness}px`;
    } else {
        // 그 외의 경우 기본 값으로 설정
        borderThickness = 'initial';
    }

    // 테두리 굵기 변경
    element.style.borderWidth = borderThickness;
  },

  /**
   * 주어진 HTMLElement의 텍스트 크기를 변경합니다.
   *
   * @param {HTMLElement} element - 크기를 변경할 HTMLElement.
   * @param {string | number} size - 적용할 텍스트 크기. 유효한 CSS 크기 문자열 또는 숫자(단위는 px) 중 하나.
   *                                전달하지 않거나 유효한 값이 아닌 경우 기본 크기로 설정됩니다.
   * @example
   * var myElement = document.getElementById("myElement");
   * mux.Style.fontSize(myElement, "16px");    // 크기를 16px로 설정
   * mux.Style.fontSize(myElement, "1.5em");   // 크기를 1.5em로 설정
   * mux.Style.fontSize(myElement, 20);        // 숫자로 지정 (단위: px)
   * mux.Style.fontSize(myElement);            // 기본 크기로 설정
   */
  fontSize(element, size) {
    // 전달된 element가 유효한지 확인
    if (!(element instanceof HTMLElement)) {
        // console.error("fontSize(): 유효한 HTMLElement를 전달해주세요.");
        return;
    }

    // 전달된 size가 유효한지 확인하고, 크기를 설정
    let fontSize;

    if (typeof size === 'string') {
        // 문자열인 경우 유효한 CSS 크기인지 확인
        let validSizeRegex = /^\d+(\.\d+)?(px|em|rem|%|vw|vh|vmin|vmax|cm|mm|in|pt|pc)$/;
        fontSize = validSizeRegex.test(size) ? size : 'initial';
    } else if (typeof size === 'number') {
        // 숫자인 경우 px 단위를 추가
        fontSize = `${size}px`;
    } else {
        // 그 외의 경우 기본 값으로 설정
        fontSize = 'initial';
    }

    // 텍스트 크기 변경
    element.style.fontSize = fontSize;
  },

  /**
   * 주어진 HTMLElement의 텍스트 굵기를 변경합니다.
   *
   * @param {HTMLElement} element - 굵기를 변경할 HTMLElement.
   * @param {string} weight - 적용할 굵기. "normal", "bold" 또는 숫자(100, 200, ..., 900) 중 하나.
   *                         전달하지 않거나 유효한 값이 아닌 경우 기본 굵기로 설정됩니다.
   * @example
   * var myElement = document.getElementById("myElement");
   * mux.Style.fontWeight(myElement, "bold");  // 굵게
   * mux.Style.fontWeight(myElement, "normal"); // 일반 굵기
   * mux.Style.fontWeight(myElement, 700);      // 숫자로 지정 (700은 bold에 가까움)
   * mux.Style.fontWeight(myElement);            // 기본 굵기로 설정
   */
  fontWeight(element, weight) {
    // 전달된 element가 유효한지 확인
    if (!(element instanceof HTMLElement)) {
        // console.error("fontWeight(): 유효한 HTMLElement를 전달해주세요.");
        return;
    }

    // 전달된 weight이 유효한지 확인하고, 굵기를 설정
    let validWeights = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
    let fontWeight = validWeights.includes(String(weight)) ? weight : "normal";

    // 텍스트 굵기 변경
    element.style.fontWeight = fontWeight;
  },

  /**
   * 주어진 HTMLElement의 텍스트 색상을 변경합니다.
   *
   * @param {HTMLElement} element - 색상을 변경할 HTMLElement.
   * @param {string} color - 적용할 텍스트 색상 (CSS 색상 문자열).
   *                         헥스코드, 색상 이름 등 모든 유효한 CSS 색상 형식이 가능합니다.
   * @example
   * var myElement = document.getElementById("myElement");
   * mux.Style.fontColor(myElement, "red");    // 빨간색 텍스트
   * mux.Style.fontColor(myElement, "#00ff00"); // 초록색 텍스트
   * mux.Style.fontColor(myElement, "blue");   // 파란색 텍스트
   */
  fontColor(element, color) {
    // 전달된 element가 유효한지 확인
    if (!(element instanceof HTMLElement)) {
        // console.error("fontColor(): 유효한 HTMLElement를 전달해주세요.");
        return;
    }

    // 텍스트 색상 변경
    element.style.color = color;
  },

}

/**
 * 테이블 관련 유틸리티 함수 그룹
 * @namespace Table
 */

mux.Table = {

  /**
   * 테이블 데이터 가져오기 함수
   * @param {Array} headers - 테이블 헤더 정보 배열
   * @param {Array} items - 테이블 내용 정보 배열
   * @returns {Array} - 테이블 데이터 배열
   */
  getTableData(headers, items) {
    const rows = [];

    // 테이블 내용 가져오기
    items.forEach((rowData) => {
      const row = {};
      headers.forEach((header) => {
        row[header.text] = rowData[header.value];
      });
      rows.push(row);
    });

    return rows;
  },

  /**
   * 그룹, 확장테이블 데이터 가져오기 함수
   * @param {Array} headers - 테이블 헤더 정보 배열
   * @param {Array} items - 테이블 내용 정보 배열
   * @returns {Array} - 테이블 데이터 배열
   */
  getGroupTableData(headers, items) {
    const rows = [];

    // 테이블 내용 가져오기
    items.forEach((rowData) => {
      var row = {};
      headers.forEach((header) => {
        row[header.text] = rowData[header.value];
      });
      rows.push(row);
      if (rowData.belong_data){
        rowData.belong_data.forEach((innerData) => {
          var row = {};
          headers.forEach((header) => {
            row[header.text] = innerData[header.value];
          });
          rows.push(row);
          if (innerData.belong_data){
            innerData.belong_data.forEach((innerBelongData) => {
              var row = {};
              headers.forEach((header) => {
                row[header.text] = innerBelongData[header.value];
              });
              rows.push(row);
            });
          }
        });
      }
    });

    return rows;
  },

  /**
   * 테이블에 행 추가 및 추가되는 셀들의 데이터 입력
   * @param {Array} headers
   * @param {Array} items
   * @param {Array} [dataArr] - 미입력시 빈 문자열로 채움
   * @param {number} [rowIndex] - 미입력시 마지막 행 밑
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.addRow(headers, items, ['Cell 1', 'Cell 2', 'Cell 3'], 1);
   */
  addRow(headers, items, dataArr = [], rowIndex = items.length) {
    const newRowData = {};

    headers.forEach((header, index) => {
      // dataArr이 없거나 데이터가 비어있을 경우 빈 문자열을 삽입
      const data = dataArr[index] || '';
      newRowData[header.value] = data;
    });

    items.splice(rowIndex, 0, newRowData);
  },

  /**
   * 테이블에 복수 행 추가 및 추가되는 셀들의 데이터 입력
   * @param {Array} headers
   * @param {Array} items
   * @param {Array[]} [dataArrs] - 미입력시 한 줄 추가 + 빈 문자열로 채움
   * @param {number} [rowIndex] - 미입력시 마지막 행 밑
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * const newDataArrs = [
   *   ['Row 1 Cell 1', 'Row 1 Cell 2'],
   *   ['Row 2 Cell 1', 'Row 2 Cell 2']
   *   // ... 나머지 행들
   * ];
   * mux.Table.addRows(headers, items, newDataArrs, 1);
   */
  addRows(headers, items, dataArrs = [[]], rowIndex = items.length) {
    dataArrs.forEach((dataArr) => {
      this.addRow(headers, items, dataArr, rowIndex);
      rowIndex++;
    });
  },

  /**
   * 테이블의 행 삭제
   * @param {Array} items
   * @param {number} [rowIndex] - 미입력시 마지막 행
   * @example
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.removeRow(items, 2);
   */
  removeRow(items, rowIndex = items.length-1) {
    if (rowIndex >= 0 && rowIndex < items.length) {
      items.splice(rowIndex, 1);
    }
  },

  /**
   * 테이블의 복수 행 삭제
   * @param {Array} items
   * @param {number[]} [rowIndexArr] - 미입력시 전체 행
   * @example
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.removeRows(items, [1, 3, 5]);
   */
  removeRows(items, rowIndexArr = ['ALL']) {
    if (rowIndexArr.length === 1 && rowIndexArr[0] === 'ALL'){
      rowIndexArr = [];
      items.forEach((item, index) => {
        rowIndexArr.push(index);
      });
    }
    rowIndexArr.sort((a, b) => b - a);
    rowIndexArr.forEach(rowIndex => {
      this.removeRow(items, rowIndex);
    });
  },

  /**
   * 테이블의 행 복제
   * @param {Array} items
   * @param {number} [rowIndex] - 미입력시 마지막 행
   * @example
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.copyRow(items, 2);
   */
  copyRow(items, rowIndex = items.length-1) {
    const rowCount = items.length;
    if (rowIndex >= 0 && rowIndex < rowCount) {
      const originalRowData = items[rowIndex];
      const newRowData = { ...originalRowData };
      items.splice(rowIndex + 1, 0, newRowData);
    }
  },

  /**
   * 테이블의 복수 행 복제
   * @param {Array} items
   * @param {number[]} [rowIndexArr] - 미입력시 전체 행
   * @example
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.copyRows(items, [1, 3, 5]);
   */
  copyRows(items, rowIndexArr = ['ALL']) {
    if (rowIndexArr.length === 1 && rowIndexArr[0] === 'ALL'){
      rowIndexArr = [];
      items.forEach((item, index) => {
        rowIndexArr.push(index);
      });
    }
    rowIndexArr.sort((a, b) => b - a);
    rowIndexArr.forEach(rowIndex => {
      this.copyRow(items, rowIndex);
    });
  },

  /**
   * 테이블의 열 추가 및 추가되는 셀들의 데이터 입력
   * @param {Array} headers
   * @param {Array} items
   * @param {number} colIndex
   * @param {Object} headerObj
   * @param {Array} [dataArr] - 미입력시 빈 문자열로 채움
   * @example
   * const headers = [...]; // 헤더 정의
   * const headerObj = [...]; // 추가할 헤더 객체 정의
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.addColumn(headers, items, 2, headerObj, ['Column 1', 'Column 2']);
   */
  addColumn(headers, items, colIndex, headerObj, dataArr = []) {
    headers.splice(colIndex, 0, headerObj);
    items.forEach((rowData, rowIndex) => {
      // dataArr이 없거나 데이터가 비어있을 경우 빈 문자열을 삽입
      const data = dataArr[rowIndex] || '';
      rowData[headers[colIndex].value] = data;
    });
  },

  /**
   * 테이블의 열 삭제
   * @param {Array} headers
   * @param {Array} items
   * @param {number} colIndex
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.removeColumn(headers, items, 1);
   */
  removeColumn(headers, items, colIndex) {
    items.forEach(rowData => {
      delete rowData[headers[colIndex].value];
    });
    headers.splice(colIndex, 1);
  },

  /**
   * 테이블의 앞에 1열 추가 후 추가되는 셀 안에 순서대로 번호를 부여
   * @param {Array} headers
   * @param {Array} items
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.setNumbering(headers, items);
   */
  setNumbering(headers, items) {
    // 맨 앞에 번호를 추가할 때 헤더도 함께 업데이트
    headers.unshift({ text: '번호', value: 'number' });

    items.forEach((rowData, index) => {
      // 각 행의 맨 앞에 번호 추가
      rowData['number'] = index + 1;
    });
  },

  /**
   * 테이블의 특정 열을 기준으로 오름차순 또는 내림차순으로 행들을 정렬
   * @param {Array} headers
   * @param {Array} items
   * @param {number} colIndex
   * @param {string} [upDown] - 미입력시 오름차순
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.sort(headers, items, 2, 'up');
   */
  sort(headers, items, colIndex, upDown = 'up') {
    items.sort((a, b) => {
      const aValue = a[headers[colIndex].value];
      const bValue = b[headers[colIndex].value];
      return upDown === 'up' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  },

  /**
   * 특정 셀의 기존 내용을 value로 가지는 input 태그를 만들어 해당 셀 안에 구성
   * @param {Object} table - v-data-table 객체
   * @param {Array} headers
   * @param {Array} items
   * @param {number} rowIndex
   * @param {number} colIndex
   * @param {string} [type]
   * @param {Array} [datalist] - 입력 제안 리스트(미입력시 생성X)
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * const datalist = [...]; // datalist 정의
   * mux.Table.cellToInput(this.$refs.memberTable, headers, items, 2, 1, 'text', datalist);
   */
  cellToInput(table, headers, items, rowIndex, colIndex, type = 'text', datalist = []) {
    const cellData = items[rowIndex][headers[colIndex].value];
    const inputElement = document.createElement('input');
    inputElement.type = type;
    inputElement.value = cellData;

        const cellToEdit = table.$el.getElementsByTagName('table')[0].rows[rowIndex + 1].cells[colIndex];
        cellToEdit.innerHTML = '';
        cellToEdit.appendChild(inputElement);

    if (datalist.length > 0) {
      const dataListElement = document.createElement('datalist');
      const dataListId = `datalist-${rowIndex}-${colIndex}`;
      dataListElement.id = dataListId;

      datalist.forEach((item) => {
        const optionElement = document.createElement('option');
        optionElement.value = item;
        dataListElement.appendChild(optionElement);
      });

      inputElement.setAttribute('list', dataListId);
      cellToEdit.appendChild(dataListElement);
    }

    // // 입력 요소의 값이 변경될 때마다 items에 값을 반영
    // inputElement.addEventListener('input', function () {
    //   items[rowIndex][headers[colIndex].value] = inputElement.value;
    // });
  },

  /**
   * 특정 셀의 기존 내용을 value로 가지는 select 태그를 만들어 해당 셀 안에 구성
   * @param {Object} table - v-data-table 객체
   * @param {Array} headers
   * @param {Array} items
   * @param {number} rowIndex
   * @param {number} colIndex
   * @param {Array} options - select의 옵션들
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * const options = [...]; // select의 옵션 정의
   * mux.Table.cellToSelect(this.$refs.memberTable, headers, items, 2, 1, options);
   */
  cellToSelect(table, headers, items, rowIndex, colIndex, options) {
    const cellData = items[rowIndex][headers[colIndex].value];
    const selectElement = document.createElement('select');
    selectElement.style.minWidth = '30px';
    selectElement.style.minHeight = '20px';

    // 옵션 추가
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.text = option;
      selectElement.appendChild(optionElement);
    });

    // 현재 값으로 선택
    selectElement.value = cellData;

    const cellToEdit = table.$el.getElementsByTagName('table')[0].rows[rowIndex + 1].cells[colIndex];
    cellToEdit.innerHTML = '';
    cellToEdit.appendChild(selectElement);

    // 선택이 변경될 때마다 items에 값을 반영
    selectElement.addEventListener('change', function () {
      items[rowIndex][headers[colIndex].value] = selectElement.value;
    });
  },

  /**
   * 특정 셀 안의 모든 입력 태그를 없애며 해당 입력 태그의 value를 셀 안의 InnerText로 변환
   * @param {Object} table - v-data-table 객체
   * @param {Array} headers
   * @param {Array} items
   * @param {number} rowIndex
   * @param {number} colIndex
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * mux.Table.cellToText(this.$refs.memberTable, headers, items, 2, 1);
   */
  cellToText(table, headers, items, rowIndex, colIndex) {
    const targetCell = table.$el.getElementsByTagName('table')[0].rows[rowIndex + 1].cells[colIndex];

    // 셀 안의 모든 입력 요소를 찾음
    const inputElements = targetCell.querySelectorAll('input, select, textarea');

    // 입력 요소가 하나 이상 있는 경우에만 처리
    if (inputElements.length > 0) {
      // 각 입력 요소의 값을 배열로 저장
      const inputValues = Array.from(inputElements).map(inputElement => inputElement.value);

      // 배열을 InnerText로 설정
      targetCell.innerHTML = inputValues.join(', ');

      // items 배열에 각 입력 요소의 값을 저장
      inputValues.forEach((value, index) => {
        items[rowIndex][headers[colIndex].value + `_element_${index}`] = value;
      });
    }
  },

  /**
   * 특정 행의 각 셀 안의 InnerText 혹은 input 태그의 value 를 모아서 Array 로 반환
   * @param {Array} headers
   * @param {Array} items
   * @param {number} rowIndex
   * @returns {Array}
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * const rowData = mux.Table.getRowData(headers, items, 2);
   */
  getRowData(headers, items, rowIndex) {
    const rowData = headers.map(header => items[rowIndex][header.value]);
    return rowData;
  },

  /**
   * Array 로 받은 데이터를 특정 행의 각 셀 안에 입력
   * @param {Array} headers
   * @param {Array} items
   * @param {number} rowIndex
   * @param {Array} valueArr
   * @example
   * const headers = [...]; // 헤더 정의
   * const items = [...];   // 초기 데이터 정의
   * const newData = ['New Cell 1', 'New Cell 2'];
   * mux.Table.setRowData(headers, items, 2, newData);
   */
  setRowData(headers, items, rowIndex, valueArr) {
    if (rowIndex >= items.length){
      items.push({});
    }
    headers.forEach((header, index) => {
      items[rowIndex][header.value] = valueArr[index];
    });
  },
};


/**
 * 엑셀 관련 유틸리티 함수 그룹
 * @namespace Excel
 */
mux.Excel = {
  /**
   * input 태그 엑셀 파일 업로드로 테이블에 출력
   * @param {File} file - 업로드할 엑셀 파일
   * @param {Array} headers - 테이블 헤더 정보 배열
   * @param {Array} items - 테이블 내용 정보 배열
   * @param {String} parentCode - item의 관리코드를 자동 조합하기 위한 부모 관리코드
   * @example
   * <input type="file" @change="handleFileUpload" />
   * <table ref="myTable">
   * </table>
   *
   * methods: {
   *   handleFileUpload(event) {
   *     const file = event.target.files[0];
   *     const headers = this.headers; // 헤더 정보
   *     const items = this.items; // 테이블 내용 정보
   *     mux.Excel.open(file, headers, items);
   *   }
   * }
   */
  open(file, headers, items, parentCode) {
    const self = this;
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        let shrinkedJsonData = [];
        for (let i = 0; i < jsonData.length; i++) {
          const data = jsonData[i];
          if (i === 0){
            headers.forEach((header, index) => {
              if (header.text !== data[index]){
                mux.Util.showAlert('헤더 정보와 엑셀 파일의 헤더 정보가 일치하지 않습니다.');
                return;
              }
            });
          }
          for (let j = 0; j < data.length; j++) {
            if (data[j] !== ''){
              shrinkedJsonData.push(data);
              break;
            }
          }
        }

        self.updateTableData(headers, items, shrinkedJsonData, parentCode);

      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      // console.error(error);
    }
  },

  /**
   * 엑셀 파일 업로드로 테이블에 출력
   * @param {Array} headers - 테이블 헤더 정보 배열
   * @param {Array} items - 테이블 내용 정보 배열
   * @example
   * <button @click="openExcel" />
   * <table ref="myTable">
   * </table>
   *
   * methods: {
   *   openExcel() {
   *     const headers = this.headers; // 헤더 정보
   *     const items = this.items; // 테이블 내용 정보
   *     mux.Excel.openExcelFile(headers, items);
   *   }
   * }
   */
  openExcelFile(headers, items){
    const self = this;
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx'; // 확장자가 xxx, yyy 일때, ".xxx, .yyy"
      input.onchange = function () {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0]; // 첫 번째 시트를 사용한다고 가정
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          self.updateTableData(headers, items, excelData, false);
        };
        reader.readAsArrayBuffer(this.files[0]);
      };
      input.click();

    } catch (error) {
      // console.error(error);
    }
  },

  /**
   * 테이블 내용을 엑셀 파일로 다운로드
   * @param {Array} headers - 테이블 헤더 정보 배열
   * @param {Array} items - 테이블 내용 정보 배열
   * @param {string} [fileName] - 다운로드될 엑셀 파일명
   * @example
   * <button @click="handleDownloadExcel">Download Excel</button>
   * <table ref="myTable">
   * </table>
   *
   * methods: {
   *   handleDownloadExcel() {
   *     const headers = this.headers; // 헤더 정보
   *     const items = this.items; // 테이블 내용 정보
   *     mux.Excel.downloadTable(headers, items, 'example_data');
   *   }
   * }
   */
  downloadTable(headers, items, fileName = 'data') {
    const tableData = mux.Table.getGroupTableData(headers, items);
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  },

  /**
   * 테이블 데이터 업데이트 함수
   * @private
   * @param {Array} headers - 테이블 헤더 정보 배열
   * @param {Array} items - 테이블 내용 정보 배열
   * @param {Array} jsonData - 엑셀에서 읽어온 데이터 배열
   * @param {String} parentCode - item의 관리코드를 자동 조합하기 위한 부모 관리코드
   */
  updateTableData(headers, items, jsonData, parentCode) {
    let arrExcelColIndex = [];
    headers.forEach(h => {
      const index = jsonData[0].findIndex(colName => colName === h.text);
      if(index >= 0){
        arrExcelColIndex.push(index);
      }
    });

    // 테이블 내용 업데이트
    items.splice(0, items.length, ...jsonData.slice(1).map((row, idx) => {
      const newRow = {};
      headers.forEach((header, index) => {
        if (header.type && header.type === 'number'){
          if (!row[arrExcelColIndex[index]]){
            newRow[header.value] = 0;
          }else {
            newRow[header.value] = row[arrExcelColIndex[index]];
          }
        }else {
          if(parentCode !== false){
            if(header.text === '관리코드'){
              newRow[header.value] = parentCode + '-' + ('00' + (idx + 1)).slice(-3);
            }else{
              newRow[header.value] = row[arrExcelColIndex[index]];
            }
            newRow['directly_written'] = 1;
          }else{
            newRow[header.value] = row[arrExcelColIndex[index]];
          }
        }
      });
      return newRow;
    }));
  },
};

/**
 * 날짜 관련 유틸리티 함수 그룹
 * @namespace Date
 */
mux.Date = {

  /**
   * Date 객체나 날짜 형식의 문자열을 원하는 형태의 문자열로 변환하여 반환
   * @param {Date | string} date
   * @param {string} format - yyyy, yy, y, Y, MM, M, dd, d, D, HH, H, mm, m, ss, s, fff, f
   * @returns {string}
   * @example mux.Date.format('2024.1-02', 'yy-MM-dd') -> '24-01-02'
   * @example mux.Date.format('2024.1-02 1:03:31.033', 'Y년 M월 D일 시간: H:mm.fff') -> '2024년 1월 2일 시간: 1:03.033'
   * @example mux.Date.format('2024.1-02', 'D') -> '2'
   */
  format(date, format) {
    if (!(date instanceof Date)) {
      // 문자열 형태의 날짜를 Date 객체로 변환
      date = new Date(date);
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliSeconds = date.getMilliseconds();

    const formatTokens = {
      'yyyy': year,
      'yy': year.toString().slice(-2),
      'y' : year,
      'Y' : year,
      'MM': month.toString().padStart(2, '0'),
      'M': month,
      'dd': day.toString().padStart(2, '0'),
      'd': day,
      'D': day,
      'HH': hours.toString().padStart(2, '0'),
      'H': hours,
      'mm': minutes.toString().padStart(2, '0'),
      'm': minutes,
      'ss': seconds.toString().padStart(2, '0'),
      's': seconds,
      'fff': milliSeconds.toString().padStart(3, '0'),
      'f': milliSeconds
    };

    const regex = new RegExp(Object.keys(formatTokens).join('|'), 'g');

    return format.replace(regex, match => formatTokens[match] || match);
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 기간 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @param {string} [년]
   * @param {string} [개월]
   * @param {string} [일]
   * @returns {string}
   * @example mux.Date.range('2024.1-02', '2025-01-03') -> '1년 2일'
   * @example mux.Date.range('2024.1-02', '2025-02-03', 'year', 'month', 'day') -> '1year 1month 2day'
   */
  range(date1, date2, 년, 개월, 일) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));

    let result = '';
    if (years > 0) {
      result += `${years}${년 ? 년 : '년'} `;
    }
    if (months > 0) {
      result += `${months}${개월 ? 개월 : '개월'} `;
    }
    if (days > 0 || (years === 0 && months === 0 && days === 0)) {
      result += `${days}${일 ? 일 : '일'}`;
    }

    return result.trim();
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 기간과 시간 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @param {string} [년] - 미입력시 '년'
   * @param {string} [개월] - 미입력시 '개월'
   * @param {string} [일] - 미입력시 '일'
   * @param {string} [시간] - 미입력시 '시간'
   * @param {string} [분] - 미입력시 '분'
   * @param {string} [초] - 미입력시 '초'
   * @returns {string}
   * @example mux.Date.rangeTime('2024.1-02 13:00:00', '2025-01-03 14:00:10') -> '1년 1일 1시간 10초'
   * @example mux.Date.rangeTime('2024.1-02 13:00:00', '2025-02-03 14:00:10', 'year', 'month', 'day', 'hour', 'minute', 'second') -> '1year 1month 2day 1hour 10second'
   */
  rangeTime(date1, date2, 년, 개월, 일, 시간, 분, 초) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    let result = '';
    if (years > 0) {
      result += `${years}${년 ? 년 : '년'} `;
    }
    if (months > 0) {
      result += `${months}${개월 ? 개월 : '개월'} `;
    }
    if (days > 0) {
      result += `${days}${일 ? 일 : '일'} `;
    }
    if (hours > 0) {
      result += `${hours}${시간 ? 시간 : '시간'} `;
    }
    if (minutes > 0) {
      result += `${minutes}${분 ? 분 : '분'} `;
    }
    if (seconds > 0 || (years === 0 && months === 0 && days === 0 && hours === 0 && minutes === 0)) {
      result += `${seconds}${초 ? 초 : '초'}`;
    }

    return result.trim();
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 연 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {number}
   */
  rangeYear(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 월 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {number}
   */
  rangeMonth(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

    return years * 12 + months;
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 일 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {number}
   */
  rangeDate(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    return Math.floor(diff / (24 * 60 * 60 * 1000));
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 시간 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {number}
   */
  rangeHour(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    return Math.floor(diff / (60 * 60 * 1000));
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 분 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {number}
   */
  rangeMinute(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    return Math.floor(diff / (60 * 1000));
  },

  /**
   * 두 Date 객체나 날짜 형식의 문자열을 비교하여 초 차이를 반환(절대값)
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {number}
   */
  rangeSecond(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diff = Math.abs(date2 - date1);
    return Math.floor(diff / 1000);
  },

  /**
   * 시간의 차이를 밀리세컨드로 반환
   * date1 이 과거 = 양수
   * date2 가 과거 = 음수
   * date1 과 date2 가 동일 = 0
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {number}
   */
  twoDateValidate(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    return date2 - date1;
  },
}

/**
 * 숫자 관련 유틸리티 함수 그룹
 * @namespace Number
 */
mux.Number = {
  /**
   * 콤마가 표기된 문자로 반환
   * @param {number | string} value
   * @returns {string}
   * @example mux.Number.withComma(1000000) -> '1,000,000'
   */
  withComma(value) {
    let valueStr;
    if (typeof value === 'string'){
      valueStr = value.trim();
    }else if (typeof value === 'undefined'){
      valueStr = '';
    }else {
      valueStr = value.toString();
    }
    return valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  /**
   * 콤마를 제거하여 숫자로 반환
   * @param {string} value
   * @returns {number}
   * @example mux.Number.noComma('1,000,000') -> 1000000
   */
  noComma(value) {
    let valueStr;
    if (typeof value === 'string'){
      valueStr = value.trim();
    }else if (typeof value === 'undefined') {
      valueStr = '';
    }else {
      valueStr = value.toString();
    }
    return Number(valueStr.replaceAll(",", ""));
  },

  /**
   * 조 단위까지의 숫자를 한글로 변환하고 붙일 문자를 뒤에 표기하여 반환
   * @param {number | string} val
   * @param {string} [붙일문자]
   * @returns {string}
   * @example mux.Number.toKorean('78000000',' 달러') -> '칠천팔백만 달러'
   */
  toKorean(val, 붙일문자) {
    var numKor = new Array("", "일", "이", "삼", "사","오","육","칠","팔","구","십");
    // 숫자 문자
    var danKor = new Array("", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천");

    val = this.noComma(val);
    val = parseInt(val);
    // 만위 문자열
    var result = "";
    if(val && !isNaN(val)) {
      val = val.toString();
      // CASE: 금액이 공란/NULL/문자가 포함된 경우가 아닌 경우에만 처리
      for(let i=0; i < val.length; i++) {
        var str = "";
        var num = numKor[val.charAt(val.length - (i+1))];
        if(num != "") str += num + danKor[i];	// 숫자가 0인 경우 텍스트를 표현하지 않음
        switch(i){
          case 4:str += "만"; break;  // 4자리인 경우 '만'을 붙여줌 ex) 10000 -> 일만
          case 8:str += "억"; break;  // 8자리인 경우 '억'을 붙여줌 ex) 100000000 -> 일억
          case 12:str += "조"; break; // 12자리인 경우 '조'를 붙여줌 ex) 1000000000000 -> 일조
        }
        result = str + result;
      }
    }else {
      result = "NaN";
    }

    if (붙일문자){
      result = result + 붙일문자;
    }
    return result;
  },

  /**
   * +82, - 있든 없든 010-1111-2222 형식으로 반환하는 함수
   * @param {string} phoneNumber
   * @returns {string}
   * @example mux.Number.formatPhoneNumber('+8201011112222') -> '010-1111-2222'
   */
  formatPhoneNumber(phoneNumber) {
    // +82 제거
    var cleaned = ('' + phoneNumber).replace('+82', '').replace(/\D/g, '').trim();

    var match = cleaned.match(/^(01[0|1|6|7|8|9])(\d{3,4})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }

    // 형식에 맞지 않는 경우에는 그대로 반환
    return phoneNumber;
  },
  formatTelNumber(phoneNumber) {
    // +82 제거
    var cleaned = ('' + phoneNumber).replace('+82', '').replace(/\D/g, '').trim();

    var match = cleaned.match(/^(0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70))(\d{3,4})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[3] + '-' + match[4];
    }

    // 형식에 맞지 않는 경우에는 그대로 반환
    return phoneNumber;
  },

  /**
   * N의 자리까지 반올림
   * @param {number | string} value
   * @param {number} 단위 - ex) 1000, 0.1
   * @returns {number} - Math.round(value / 단위) * 단위
   * @example mux.Number.round(123, 10) -> 120
   */
  round(value, 단위) {
    value = parseFloat(value);
    return Math.round(value / 단위) * 단위;
  },

  /**
   * N의 자리까지만 반올림하여 표시 후 문자 붙이기
   * @param {number | string} value
   * @param {number} 단위 - ex) 1000, 1000000
   * @param {string} [붙일문자] - ex) 'M', '원', '백만원'
   * @returns {number} - Math.round(value / 단위) + 붙일문자
   * @example mux.Number.roundCut(12345678, 1000000, 'M') -> 12M
   */
  roundCut(value, 단위, 붙일문자) {
    value = parseFloat(value);
    if (!붙일문자){
      붙일문자 = '';
    }
    return Math.round(value / 단위) + 붙일문자;
  },

  /**
   * N의 자리까지 올림
   * @param {number | string} value
   * @param {number} 단위 - ex) 1000, 0.1
   * @returns {number} - Math.ceil(value / 단위) * 단위
   * @example mux.Number.ceil(123, 10) -> 130
   */
  ceil(value, 단위) {
    value = parseFloat(value);
    return Math.ceil(value / 단위) * 단위;
  },

  /**
   * N의 자리까지만 올림하여 표시 후 문자 붙이기
   * @param {number | string} value
   * @param {number} 단위 - ex) 1000, 1000000
   * @param {string} [붙일문자] - ex) 'M', '원', '백만원'
   * @returns {number} - Math.ceil(value / 단위) + 붙일문자
   * @example mux.Number.ceilCut(12345678, 1000000, 'M') -> 13M
   */
  ceilCut(value, 단위, 붙일문자) {
    value = parseFloat(value);
    if (!붙일문자){
      붙일문자 = '';
    }
    return Math.ceil(value / 단위) + 붙일문자;
  },

  /**
   * N의 자리까지 내림
   * @param {number | string} value
   * @param {number} 단위 - ex) 1000, 0.1
   * @returns {number} - Math.floor(value / 단위) * 단위
   * @example mux.Number.floor(123, 10) -> 120
  */
  floor(value, 단위) {
    value = parseFloat(value);
    return Math.round(value / 단위) * 단위;
  },

  /**
   * N의 자리까지만 내림하여 표시 후 문자 붙이기
   * @param {number | string} value
   * @param {number} 단위 - ex) 1000, 1000000
   * @param {string} [붙일문자] - ex) 'M', '원', '백만원'
   * @returns {number} - Math.floor(value / 단위) + 붙일문자
   * @example mux.Number.floorCut(12345678, 1000000, 'M') -> 12M
   */
  floorCut(value, 단위, 붙일문자) {
    value = parseFloat(value);
    if (!붙일문자){
      붙일문자 = '';
    }
    return Math.floor(value / 단위) + 붙일문자;
  },

  /**
   * 소수점 자리수 구하기
   * @param {number | string} value
   * @returns {number}
   * @example mux.Number.getDecimalPlaces(0.123) -> 3
   */
  getDecimalPlaces(value) {
    let valueStr;
    if (typeof value === 'string'){
      valueStr = value.trim();
    }else {
      valueStr = value.toString();
    }
    const match = valueStr.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) return 0;
    return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
  },

  /**
   * 정수 변환 방식 더하기(소수점 계산 오류 방지)
   * @param {Array<number | string | HTMLElement>} values
   * @returns {number}
   */
  sum(values) {
    if (!Array.isArray(values) || values.length < 2) {
        throw new Error('계산할 요소가 두 개 이상이어야 합니다.');
    }
    values = values.map(mux.Get.getValueAt);
    values = values.map(parseFloat);

    const decimalPlaces = Math.max(...values.map(this.getDecimalPlaces));
    const multiplier = 10 ** decimalPlaces;

    const result = values.reduce((acc, value) => acc + value * multiplier, 0) / multiplier;

    return result;
  },

  /**
   * 정수 변환 방식 빼기(소수점 계산 오류 방지)
   * @param {Array<number | string | HTMLElement>} values
   * @returns {number}
   */
  sub(values) {
    if (!Array.isArray(values) || values.length < 2) {
        throw new Error('계산할 요소가 두 개 이상이어야 합니다.');
    }
    values = values.map(mux.Get.getValueAt);
    values = values.map(parseFloat);

    const decimalPlaces = Math.max(...values.map(this.getDecimalPlaces));
    const multiplier = 10 ** decimalPlaces;

    const result = values.slice(1).reduce((acc, value) => acc - value * multiplier, values[0] * multiplier) / multiplier;

    return result;
  },

  /**
   * 정수 변환 방식 곱하기(소수점 계산 오류 방지)
   * @param {Array<number | string | HTMLElement>} values
   * @returns {number}
   */
  multiple(values) {
    if (!Array.isArray(values) || values.length < 2) {
        throw new Error('계산할 요소가 두 개 이상이어야 합니다.');
    }
    values = values.map(mux.Get.getValueAt);
    values = values.map(parseFloat);

    const decimalPlaces = Math.max(...values.map(this.getDecimalPlaces));
    const multiplier = 10 ** decimalPlaces;

    const result = values.reduce((acc, value) => acc * (value * multiplier), 1) / multiplier;

    return result;
  },

  /**
   * 정수 변환 방식 나누기(소수점 계산 오류 방지)
   * @param {Array<number | string | HTMLElement>} values
   * @returns {number}
   */
  divide(values) {
    if (!Array.isArray(values) || values.length < 2) {
        throw new Error('계산할 요소가 두 개 이상이어야 합니다.');
    }
    values = values.map(mux.Get.getValueAt);
    values = values.map(parseFloat);

    const decimalPlaces = Math.max(...values.map(this.getDecimalPlaces));
    const multiplier = 10 ** decimalPlaces;

    const result = values.slice(1).reduce((acc, value) => acc / (value * multiplier), values[0] * multiplier) / multiplier;

    return result;
  },
}

/**
 * Input List 관련 유틸리티 함수 그룹
 * @namespace List
 */
mux.List = {
  /**
   * 불러온 분류, 제조사 리스트를 해당하는 검색 조건 list:[]에 추가
   * @param {Array} inputType
   * @param {Array} classificationList
   * @param {Array} manufacturerList
   */
  addProductBasicInfoLists(inputType, classificationList, manufacturerList, useAll){
    inputType.forEach( inputs => {
      if(inputs.label == '분류'){
        inputs.list = classificationList;
        if(useAll){
          inputs.list.unshift('All');
        }else{
          inputs.list = inputs.list.filter((e) => e !== 'All');
        }
      }else if(inputs.label == '제조사'){
        inputs.list = manufacturerList;
      }
    })
  },
  /**
   * 불러온 Member를 해당하는 검색 조건 list:[]에 추가
   * @param {Array} inputType
   * @param {Array} membersList
   */
   addMembersLists(inputType, label, membersList){
    inputType.forEach( inputs => {
      if(inputs.label == label){
        let member_list = [];
        for(let m=0; m<membersList.length; m++){
          member_list.push(membersList[m].name + "(" + membersList[m].id + ")");
        }
        inputs.list = member_list;
      }
    })
  },
}

/**
 * 유효성 검사 관련 유틸리티 함수 그룹
 * @namespace Rules
 */

mux.Rules = {
  /**
   * InputsFormComponent 혹은 InputsCardComponent Value 유효성 검사
   * @param {Array} inputs
   */
    rulesSet(inputs){
      inputs.forEach(input =>{
        if(input.rule_set === true){
          if(input.text_type == 'number'){
            input.rules =  [v => !!v || input.label + " 입력(숫자)"]
          }else if(input.type == 'number_comma'){
            input.rules =  [v => !!v || input.label + " 입력(숫자)",
                            v => !!(/^[0-9,]*$/.test(v.replace(/,/g,'')) ) || '숫자만 입력']
          }else if(input.column_name == 'formula2'){
            input.rules =  [v => !!v || '백분율(%) 혹은 숫자 입력']
          }else if(input.type != 'file'){
            input.rules =  [v => !!v || input.label + " 입력"]
          }else if(input.type == 'file'){
            input.rules =  [v => !!v || input.label + " 첨부"]
          }
        }
      })
    },

}


export default mux;
