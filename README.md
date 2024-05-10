# pion_electric_erp

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# DB 등록 수정 삭제 요청 가이드

## 모든 요청 형식의 "???_where" 키에 들어가는 값은 {"컬럼명1": 값A, "컬럼명2": 값B} 와 같은 형태로, 각각의 키 값은 AND 조건으로 검사한다.
## 검사 예시: SELECT * FROM 테이블명 WHERE 컬럼명1 = 값A AND 컬럼명2 = 값B
let sendData = {};

## insert 예시
### rollback = yes : 있으면 롤백
### rollback = no : 있어도 수행
### rollback = ignore : 있으면 패스
sendData["테이블명-insert"] = [
  {
    "user_info": {
      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
      "role": "creater"
    },
    "data":{
      "컬럼명1": 값1,
      "컬럼명2": 값2
    },
    "select_where": {"중복 검사 컬럼명1": 값A, "중복 검사 컬럼명2": 값B},
    "rollback": "중복시 롤백 실행 여부"
  }
];

## update 예시
### rollback = yes : 없으면 롤백
### rollback = no : 없어도 수행(=없으면 패스)
let sendData = {};
sendData["테이블명-update"] = [
  {
    "user_info": {
      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
      "role": "modifier"
    },
    "data":{
      "컬럼명1": 값1,
      "컬럼명2": 값2
    },
    "update_where": {"대상 컬럼명1": 값A, "대상 컬럼명2": 값B},
    "rollback": "대상 미존재시 롤백 실행 여부"
  }
];

## delete 예시
### rollback = yes : 없으면 롤백
### rollback = no : 없어도 수행(=없으면 패스)
let sendData = {};
sendData["테이블명-delete"] = [
  {
    "user_info": {
      "user_id": this.$cookies.get(this.$configJson.cookies.id.key),
      "role": "modifier"
    },
    "data":{},
    "delete_where": {"대상 컬럼명1": 값A, "대상 컬럼명2": 값B},
    "rollback": "대상 미존재시 롤백 실행 여부"
  }
];

## cancel 예시
### 있으면 롤백, 없으면 패스
let sendData = {};
sendData["테이블명-cancel"] = [
  {
    "data":{},
    "cancel_where": {"존재 검사 컬럼명1": 값A, "존재 검사 컬럼명2": 값B},
  }
];

## 최종 요청 예시
let result = await mux.Server.post({
  path: '/api/sample_rest_api/',
  params: sendData
});