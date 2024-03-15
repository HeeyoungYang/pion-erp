/* eslint-disable no-async-promise-executor */
import * as XLSX from "xlsx"; // npm install xlsx
import axios from 'axios'; // npm install axios
import router from '@/router/index'; // npm install vue-router
import configJson from '@/mux.json';
import Vue from 'vue';
import VueCookies from 'vue-cookies';

Vue.use(VueCookies);

// @ts-check

/**
 * @namespace mux
 */
const mux = {};


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
      if (process.env.NODE_ENV === 'production'){

        if (sendData.path !== '/'){
          try {
            let result = await this.get(sendData); // 페이지 이동 전 path 로 Get 요청을 통해 토큰 및 권한 인증
            if (result){
              router.push(sendData.path);
            }else {
              this.logOut();
            }
          } catch (error) {
            this.logOut();  
          }
        }else {
          this.logOut();
        }

      }else {
        router.push(sendData.path);
      }

    } catch (error) {
      if (axios.isCancel(error)) {
        console.error(defaultObj.path+' Move canceled:', error.message); // 요청이 취소된 경우
      } else if (error.response) {
        // 요청은 성공했으나 서버가 상태 코드를 반환한 경우
        console.error(defaultObj.path+' Move Server responded with a non 2xx status:', error.message);
      } else if (error.message === 'timeout') {
        console.error(defaultObj.path+' Move timeout:', error.message); // 타임아웃이 발생한 경우
      } else {
        console.error(defaultObj.path+' Move error:', error.message); // 기타 에러
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
   * 파일 업로드
   * @param {Object} reqObj 
   * 필수 key: path, (folder, file) | {obj}files : {folder,file}
   * 선택 key: timeout, ...
   */
  async uploadFile(reqObj) {
    new Promise(async (resolve, reject) => {
      try {

        if (!reqObj.files && (!reqObj.folder || !reqObj.file)){
          reject('upload file error: 폴더명, 파일 정보와 함께 요청해야 합니다.');
        }

        if (!reqObj.path) {
          reject('upload file error: path 정보와 함께 요청해야 합니다.');
        }

        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        if (reqObj.timeout){
          this.axiosInstance.defaults.timeout = reqObj.timeout;
        }

        let formData = new FormData();
        if (reqObj.files && Array.isArray(reqObj.files)){
          reqObj.files.forEach((file, index) => {
            if (file.folder){
              formData.append('folder'+index, file.folder);
            }else {
              if (reqObj.folder){
                formData.append('folder'+index, reqObj.folder);
              }else {
                reject('upload file error: 폴더명, 파일 정보와 함께 요청해야 합니다.');
              }
            }
            formData.append('fileName_'+index, file.name);
            formData.append('fileType_'+index, file.type);
            formData.append('file_'+index, file.file);
          });
        }else if (reqObj.file && reqObj.folder) {
          formData.append('folder_0', reqObj.folder);
          formData.append('fileName_0', reqObj.file.name);
          formData.append('fileType_0', reqObj.file.type);
          formData.append('file_0', reqObj.file);
        }else {
          reject('upload file error: 업로드 대상이 없습니다.');
        }

        Object.keys(reqObj).forEach(key => {
          if (key !== 'files' && key !== 'file' && key !== 'folder' && key !== 'path' && key !== 'timeout'){
            formData.append(key, reqObj[key]);
          }
        });


        const response = await this.axiosInstance.post(reqObj.path, formData);
  
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
   * @param {Object} reqObj 
   * 필수 key: path, folder, fileName
   * 선택 key: timeout, ...
   */
  async downloadFile(reqObj) {
    new Promise(async (resolve, reject) => {
      try {
        let sendData = {};
        sendData.path = reqObj.path;
        if(reqObj.folder && reqObj.fileName){
          sendData.path += '/' + reqObj.folder;
          sendData.path += '/' + reqObj.fileName;
        }else {
          reject('download file error: 폴더명, 파일 정보와 함께 요청해야 합니다.');
        }
        Object.keys(reqObj).forEach(key => {
          if (key !== 'path' && key !== 'folder' && key !== 'fileName'){
            sendData[key] = reqObj[key];
          }
        });
        const result = await mux.Server.get(sendData);
        resolve(result);
      } catch (error) {
        reject(error);
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

        // 응답에 accessToken 이 있으면 localStorage 에, refreshToken 이 있으면 쿠키에 저장
        if (response.data){
          if (response.data.accessToken){
            localStorage.setItem('accessToken', response.data.accessToken)
          }
          if (response.data.refreshToken){
            Vue.$cookies.set(configJson.$cookies.refreshToken, response.data.refreshToken, configJson.refreshTokenCookieExpiration);
          }
        }
        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        resolve(response);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Request canceled:', error.message); // 요청이 취소된 경우
        } else if (error.response) {
          // 요청은 성공했으나 서버가 상태 코드를 반환한 경우
          console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Server responded with a non 2xx status:', error.message);
        } else if (error.message === 'timeout') {
          console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Request timeout:', error.message); // 타임아웃이 발생한 경우
        } else {
          console.error(`${method.toUpperCase()} ${defaultObj.path} `+'Request error:', error.message); // 기타 에러
        }
        this.axiosInstance.defaults.timeout = this.defaultTimeout;
        reject(error);
      }
    });

  },

  /**
   * 로그아웃 함수 - 로컬 스토리지와 쿠키 clear + 로그인 페이지('/')로 이동
   * @example
   * mux.Server.logOut();
   */
  logOut() {
    localStorage.clear();
    Vue.$cookies.keys().forEach(key =>{
      if (key !== configJson.cookies.id)
      Vue.$cookies.remove(key);
    });
    router.push('/');
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

}
// Axios인스턴스 설정: 요청 시마다 헤더에 토큰을 추가
mux.Server.axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Vue.$cookies.get(configJson.$cookies.refreshToken);
      if (refreshToken) {
        try {
          // RefreshToken을 사용하여 새로운 AccessToken을 요청합니다.
          const response = await axios.post('/token-refresh', { refreshToken });
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          // 기존 요청을 재시도합니다.
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // RefreshToken을 사용하여 AccessToken을 갱신하는데 실패한 경우 로그아웃 처리 등을 수행할 수 있습니다.
          console.error('AccessToken 갱신 실패:', refreshError);
          // 로그아웃
          mux.Server.logOut();
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

  /**
   * 전달 받은 HTML 의 출력 미리보기 팝업창을 띄우며 프린트 도구 시작
   * @param {HTMLElement} element 
   */
  print(element) {

    const a4Width = 595;
    const a4Height = 842;

    // 미리보기 팝업을 띄우기
    const previewPopup = window.open('', '_blank', `width=${a4Width},height=${a4Height}`);
    const previewContent = `<html><head><title>Print Preview</title></head><body>${element.outerHTML}</body></html>`;
    previewPopup.document.write(previewContent);

    // 포커스를 설정하고 0.5초 뒤에 프린트 도구 시작
    setTimeout(() => {
      previewPopup.focus();

      previewPopup.print();

      // 프린트 도구가 닫히면 팝업도 닫기
      setTimeout(() => {
        previewPopup.close();
      }, 500);
    }, 500);


    // let $container =  $("#idPrint").clone()    // 프린트 할 특정 영역 복사
    // let cssText = ""                            // 스타일 복사
    // for (const node of $("style")) {
    //     cssText += node.innerHTML
    // }
    // /** 팝업 */
    // let innerHtml = $container[0].innerHTML
    // let popupWindow = window.open("", "_blank", "width=1000,height=900")
    // popupWindow.document.write("<!DOCTYPE html>"+
    //   "<html>"+
    //     "<head>"+
    //     // "<link>"+cssText+"</link>"+
    //     "<script src=\"https://code.jquery.com/jquery-latest.js\" type=\"text/javascript\"></script>" +
    //     "<script src=\"assets/js/config.navbar-vertical.js\"></script>" +
    //     "<link href=\"assets/lib/dropzone/dropzone.min.css\" rel=\"stylesheet\">" +
    //     "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com/\">" +
    //     "<link href=\"assets/lib/perfect-scrollbar/perfect-scrollbar.css\" rel=\"stylesheet\">" +
    //     "<link href=\"assets/lib/datatables-bs4/dataTables.bootstrap4.min.css\" rel=\"stylesheet\">" +
    //     "<link href=\"assets/lib/datatables.net-responsive-bs4/responsive.bootstrap4.css\" rel=\"stylesheet\">" +
    //     "<link href=\"assets/lib/leaflet/leaflet.css\" rel=\"stylesheet\">" +
    //     "<link href=\"assets/lib/leaflet.markercluster/MarkerCluster.css\" rel=\"stylesheet\">" +
    //     "<link href=\"assets/lib/leaflet.markercluster/MarkerCluster.Default.css\" rel=\"stylesheet\">" +
    //     "<link href=\"assets/css/theme.css\" rel=\"stylesheet\">" +
    //     "<link href=\"assets/lib/flatpickr/flatpickr.min.css\" rel=\"stylesheet\">" +
    //     "<link rel=\"stylesheet\" href=\"assets/css/mkor_print_portrait_inbound.css\"></link>" +
    //     "<link rel=\"stylesheet\" href=\"assets/css/mkor_css.css\"></link>" +
    //     "</head>"+
    //     "<style>"+
    //     "#searched_result_table_for_print_wrapper .dataTables_paginate {display: none;}"+
    //     "#searched_result_table_for_print thead {background-color:black; color:white; font-weight:bold; font-size:18px;}"+
    //     "#searched_result_table_for_print tbody {font-size: 13px;}"+
    //     "#searched_result_table_for_print th,#searched_result_table_for_print td {border:1px solid #cdcdcd}"+
    //     ".dataTables_wrapper .sort:after {display:none!important;}"+
    //     ".inbound_date_for_print_wrapper{color:#333; font-size:15px}"+
    //     "#searched_result_table_for_print tbody tr td:nth-child(n+5){font-size:15px; font-weight: bold; color: black;}"+
    //     "</style>"+
    //     "<body style=\"padding:20px;\">"+innerHtml+"</body>"+
    //   "</html>")
  
    // popupWindow.document.close()
    // popupWindow.focus()

    // /** 0.5초 지연 */
    // setTimeout(() => {
    //     popupWindow.print()         // 팝업의 프린트 도구 시작
    //     popupWindow.close()         // 프린트 도구 닫혔을 경우 팝업 닫기
    // }, 500)
    
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
                console.error('Invalid validation method');
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
        console.error("borderColor(): 유효한 HTMLElement를 전달해주세요.");
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
        console.error("borderWidth(): 유효한 HTMLElement를 전달해주세요.");
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
        console.error("fontSize(): 유효한 HTMLElement를 전달해주세요.");
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
        console.error("fontWeight(): 유효한 HTMLElement를 전달해주세요.");
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
        console.error("fontColor(): 유효한 HTMLElement를 전달해주세요.");
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
  open(file, headers, items) {
    const self = this;
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        self.updateTableData(headers, items, jsonData);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
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
          const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          self.updateTableData(headers, items, excelData);
        };
        reader.readAsArrayBuffer(this.files[0]);
      };
      input.click();
      
    } catch (error) {
      console.error(error);
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
    const tableData = mux.Table.getTableData(headers, items);
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
   */
  updateTableData(headers, items, jsonData) {
    let arrExcelColIndex = [];
    jsonData[0].forEach(excelColName => {
      const index = headers.findIndex(h=>h.text === excelColName);
      if(index >= 0){
        arrExcelColIndex.push(index);
      }
    });

    // 테이블 내용 업데이트
    items.splice(0, items.length, ...jsonData.slice(1).map((row) => {
      const newRow = {};
      headers.forEach((header, index) => {
        newRow[header.value] = row[arrExcelColIndex[index]];
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
   * @param {string} format - yyyy, yy, y, Y, MM, M, dd, d, D, HH, H, mm, m, ss, s
   * @returns {string}
   * @example mux.Date.format('2024.1-02', 'yy-MM-dd') -> '24-01-02'
   * @example mux.Date.format('2024.1-02 1:03:31', 'Y년 M월 D일 시간: H:mm') -> '2024년 1월 2일 시간: 1:03'
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
      's': seconds
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


export default mux;