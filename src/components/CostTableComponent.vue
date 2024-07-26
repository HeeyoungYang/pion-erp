<template>
  <v-data-table
    dense
    :headers="headers"
    :items="items"
    :hide-default-footer="true"
    :item-key="itemKey"
    :class="tableClass ? tableClass : 'elevation-1'"
    disable-sort
  >

    <template v-slot:item="{ item, index }">
      <tr :class="trClass ? trClass : ''" :style="trStyle ? trStyle : ''">
        <td>{{ index+1 }}</td>
        <td :colspan="!hideChildren || (showChildsParentIndexArr && showChildsParentIndexArr.includes(index)) ? item.cost_list_colspan : ''">
          {{ item.cost_list_sub ? '' : item.cost_list }}
          <strong v-if="item.cost_list_sub">{{ item.cost_list }}</strong>
          <br v-if="item.cost_list_sub">
          <v-text-field v-if="item.cost_list_sub && !costNumEditDisabled && !preventEditable && item.cost_list_sub_editable" v-model="item.cost_list_sub" dense style="max-width: 200px;"></v-text-field>
          {{ item.cost_list_sub && !costNumEditDisabled && !preventEditable && item.cost_list_sub_editable ? '' : item.cost_list_sub ? item.cost_list_sub : '' }}
          <v-btn v-if="!preventButton && item.costListBtn"
            :color="item.costListBtn.color ? item.costListBtn.color : 'primary'"
            x-small
            :class="'dont_print ' + (item.costListBtn.class ? item.costListBtn.class : 'ml-3')"
            data-html2canvas-ignore="true"
            :elevation="item.costListBtn.elevation ? item.costListBtn.elevation : '0'"
            @click="item.costListBtn.click"
          >{{ item.costListBtn.text }}
          </v-btn>
        </td>
        <td v-if="!item.cost_list_colspan || item.cost_list_colspan < 2 || (hideChildren && (!showChildsParentIndexArr || !showChildsParentIndexArr.includes(index)))">
          {{
            item.cost_unit ? item.cost_unit
              : (item.belong_data && item.belong_data.length > 0 ?
                  (item.belong_data[0].cost_unit ? item.belong_data[0].cost_unit
                  : (item.belong_data[0].belong_data && item.belong_data[0].belong_data.length > 0 ?
                      (item.belong_data[0].belong_data[0].cost_unit ? item.belong_data[0].belong_data[0].cost_unit
                      : '')
                    : '')
                  )
                : '')
          }}
        </td>
        <td v-if="!item.cost_list_colspan || item.cost_list_colspan < 3 || (hideChildren && (!showChildsParentIndexArr || !showChildsParentIndexArr.includes(index)))">
          <v-text-field v-if="!preventEditable && item.cost_num_editable"
            dense
            style="max-width: 50px;"
            :rules="item.allow_integer ? integerRules : item.allow_one_or_greater ? integerOneOrGreaterRules : item.allow_edit_decimal_point ? profiteMaintenanceFeeNumRules : expensesNumRules"
            :disabled="costNumEditDisabled"
            type="number"
            v-model="item.cost_num"
          ></v-text-field>
          {{
            !preventEditable && item.cost_num_editable ? ''
              : item.cost_num ? item.cost_num
                : (item.belong_data && item.belong_data.length > 0 ?
                    (item.belong_data.findIndex(x=>x.cost_num) >= 0 ? 1
                    : (item.belong_data.findIndex(x=>x.belong_data && x.belong_data.length > 0) >= 0 ?
                        (item.belong_data.find(x=>x.belong_data && x.belong_data.length > 0).belong_data[0].cost_num ? item.belong_data.find(x=>x.belong_data && x.belong_data.length > 0).belong_data[0].cost_num
                        : 0)
                      : 0)
                    )
                  : 0)
          }}
        </td>
        <td v-if="!item.cost_list_colspan || item.cost_list_colspan < 4 || (hideChildren && (!showChildsParentIndexArr || !showChildsParentIndexArr.includes(index)))">
          <v-text-field v-if="!costNumEditDisabled && !preventEditable && item.cost_unit_price_editable"
            dense
            style="max-width: 100px;"
            :rules="integerRules"
            :disabled="costNumEditDisabled"
            type="number"
            v-model="item.cost_unit_price"
          ></v-text-field>
          {{ 
            !costNumEditDisabled && !preventEditable && item.cost_unit_price_editable ? ''
            : mux.Number.withComma(item.cost_unit_price ? item.cost_unit_price : item.cost_total ? item.cost_total :
              (item.belong_data ? (item.belong_data.reduce((prev, cur)=>{
                return (prev += cur.cost_total ? cur.cost_total : cur.cost_num * cur.cost_unit_price ? cur.cost_num * cur.cost_unit_price :
                cur.belong_data ? cur.belong_data.reduce((prevB, curB)=>{
                  return (prevB += curB.cost_total ? curB.cost_total : curB.cost_num && curB.cost_unit_price ? curB.cost_num * curB.cost_unit_price : 0);
                }, 0) : 0 );
              }, 0)) : 0)
          ) }}
        </td>
        <td v-if="!item.cost_list_colspan || item.cost_list_colspan < 5 || (hideChildren && (!showChildsParentIndexArr || !showChildsParentIndexArr.includes(index)))">
          {{ mux.Number.withComma(Math.round(item.cost_total ? item.cost_total : item.cost_num * item.cost_unit_price ? item.cost_num * item.cost_unit_price :
            (item.belong_data ? (item.belong_data.reduce((prev, cur)=>{
              return (prev += cur.cost_total ? cur.cost_total : cur.cost_num * cur.cost_unit_price ? cur.cost_num * cur.cost_unit_price :
              cur.belong_data ? cur.belong_data.reduce((prevB, curB)=>{
                return (prevB += curB.cost_total ? curB.cost_total : curB.cost_num && curB.cost_unit_price ? curB.cost_num * curB.cost_unit_price : 0);
              }, 0) : 0 );
            }, 0)) : 0)
          )) }}
        </td>
      </tr>
      <template v-for="(innerItem, idx) in item.belong_data">
        <tr :class="childTrClass ? childTrClass : ''"
          :style="childTrStyle ? childTrStyle : ''"
          :key="'surveycost_'+index+'_'+idx"
          v-show="!hideChildren || (showChildsParentIndexArr && showChildsParentIndexArr.includes(index))">
          <td>
            <v-icon v-if="!preventEditable && !costNumEditDisabled && innerItem.deletable_row" small color="error" style="cursor:pointer" @click="item.belong_data.splice(idx, 1)">mdi-minus-thick</v-icon>
            {{ preventEditable || !innerItem.deletable_row ? innerItem.cost_no : '' }}
          </td>
          <td :colspan="!hideChildren && !hideGrandChildren || (showGrandChildsParentIndexArr && showGrandChildsParentIndexArr.includes(idx)) ? innerItem.cost_list_colspan : ''">
            {{ innerItem.cost_list_sub ? '' : innerItem.cost_list }}
            <strong v-if="innerItem.cost_list_sub">{{ innerItem.cost_list }}</strong>
            <br v-if="innerItem.cost_list_sub">
            <v-text-field v-if="innerItem.cost_list_sub && !costNumEditDisabled && !preventEditable && innerItem.cost_list_sub_editable" v-model="innerItem.cost_list_sub" dense style="max-width: 200px;"></v-text-field>
            {{ innerItem.cost_list_sub && !costNumEditDisabled && !preventEditable && innerItem.cost_list_sub_editable ? '' : innerItem.cost_list_sub ? innerItem.cost_list_sub : '' }}
            <v-btn v-if="!preventButton && innerItem.costListBtn"
              :color="innerItem.costListBtn.color ? innerItem.costListBtn.color : 'primary'"
              x-small
              :class="'dont_print ' + (innerItem.costListBtn.class ? innerItem.costListBtn.class : 'ml-3')"
              data-html2canvas-ignore="true"
              :elevation="innerItem.costListBtn.elevation ? innerItem.costListBtn.elevation : '0'"
              @click="innerItem.costListBtn.click"
            >{{ innerItem.costListBtn.text }}
            </v-btn>
          </td>
          <td v-if="!innerItem.cost_list_colspan || innerItem.cost_list_colspan < 2 || (hideGrandChildren && (!showGrandChildsParentIndexArr || !showGrandChildsParentIndexArr.includes(index)))">
            {{
              innerItem.cost_unit ? innerItem.cost_unit
                : (innerItem.belong_data && innerItem.belong_data.length > 0 ?
                    (innerItem.belong_data[0].cost_unit ? innerItem.belong_data[0].cost_unit
                    : (innerItem.belong_data[0].belong_data && innerItem.belong_data[0].belong_data.length > 0 ?
                        (innerItem.belong_data[0].belong_data[0].cost_unit ? innerItem.belong_data[0].belong_data[0].cost_unit
                        : '')
                      : '')
                    )
                  : '')
            }}
          </td>
          <td v-if="!innerItem.cost_list_colspan || innerItem.cost_list_colspan < 3 || (hideGrandChildren && (!showGrandChildsParentIndexArr || !showGrandChildsParentIndexArr.includes(index)))">
            <v-text-field v-if="!preventEditable && innerItem.cost_num_editable"
              dense
              style="max-width: 50px;"
              :rules="innerItem.allow_integer ? integerRules : innerItem.allow_one_or_greater ? integerOneOrGreaterRules : innerItem.allow_edit_decimal_point ? profiteMaintenanceFeeNumRules : expensesNumRules"
              :disabled="costNumEditDisabled"
              type="number"
              v-model="innerItem.cost_num"
            ></v-text-field>
            {{
              !preventEditable && innerItem.cost_num_editable ? ''
                : innerItem.cost_num ? innerItem.cost_num
                  : (innerItem.belong_data && innerItem.belong_data.length > 0 ?
                      (innerItem.belong_data.findIndex(x=>x.cost_num) >= 0 ? 1
                      : (innerItem.belong_data.findIndex(x=>x.belong_data && x.belong_data.length > 0) >= 0 ?
                          (innerItem.belong_data.find(x=>x.belong_data && x.belong_data.length > 0).belong_data[0].cost_num ? innerItem.belong_data.find(x=>x.belong_data && x.belong_data.length > 0).belong_data[0].cost_num
                          : 0)
                        : 0)
                      )
                    : 0)
            }}
          </td>
          <td v-if="!innerItem.cost_list_colspan || innerItem.cost_list_colspan < 4 || (hideGrandChildren && (!showGrandChildsParentIndexArr || !showGrandChildsParentIndexArr.includes(index)))">
            <v-text-field v-if="!costNumEditDisabled && !preventEditable && innerItem.cost_unit_price_editable"
              dense
              style="max-width: 100px;"
              :rules="integerRules"
              :disabled="costNumEditDisabled"
              type="number"
              v-model="innerItem.cost_unit_price"
            ></v-text-field>
            {{ 
              !costNumEditDisabled && !preventEditable && innerItem.cost_unit_price_editable ? ''
                : mux.Number.withComma(innerItem.cost_unit_price ? innerItem.cost_unit_price : innerItem.cost_num * innerItem.cost_unit_price ? innerItem.cost_num * innerItem.cost_unit_price :
                innerItem.belong_data ? innerItem.belong_data.reduce((prev, cur)=>{
                  return (prev += cur.cost_total ? cur.cost_total : cur.cost_num && cur.cost_unit_price ? cur.cost_num * cur.cost_unit_price : 0);
                }, 0) : 0
              ) 
            }}</td>
          <td v-if="!innerItem.cost_list_colspan || innerItem.cost_list_colspan < 5 || (hideGrandChildren && (!showGrandChildsParentIndexArr || !showGrandChildsParentIndexArr.includes(index)))">{{ mux.Number.withComma(Math.round(innerItem.cost_total ? innerItem.cost_total : innerItem.cost_num * innerItem.cost_unit_price ? innerItem.cost_num * innerItem.cost_unit_price :
            innerItem.belong_data ? innerItem.belong_data.reduce((prev, cur)=>{
              return (prev += cur.cost_total ? cur.cost_total : cur.cost_num && cur.cost_unit_price ? cur.cost_num * cur.cost_unit_price : 0);
            }, 0) : 0
          )) }}</td>
        </tr>
        <tr v-for="(innerBelongItem, inIdx) in innerItem.belong_data"
          :class="grandChildTrClass ? grandChildTrClass : ''"
          :style="grandChildTrStyle ? grandChildTrStyle : ''"
          :key="'surveycost_'+index+'_'+idx+'_'+inIdx"
          v-show="!hideChildren && !hideGrandChildren || (showChildsParentIndexArr && showChildsParentIndexArr.includes(index) && showGrandChildsParentIndexArr && showGrandChildsParentIndexArr.includes(idx))">
          <td>
            <v-icon v-if="!preventEditable && !costNumEditDisabled && innerBelongItem.deletable_row" small color="error" style="cursor:pointer" @click="innerItem.belong_data.splice(inIdx, 1)">mdi-minus-thick</v-icon>
            {{ preventEditable || !innerBelongItem.deletable_row ? innerBelongItem.cost_no : '' }}
          </td>
          <td style="padding-left:40px;" :colspan="innerBelongItem.cost_list_colspan">
            {{ innerBelongItem.cost_list_sub ? '' : innerBelongItem.cost_list }}
            <strong v-if="innerBelongItem.cost_list_sub">{{ innerBelongItem.cost_list }}</strong>
            <br v-if="innerBelongItem.cost_list_sub">
            <v-text-field v-if="innerBelongItem.cost_list_sub && !costNumEditDisabled && !preventEditable && innerBelongItem.cost_list_sub_editable" v-model="innerBelongItem.cost_list_sub" dense style="max-width: 200px;"></v-text-field>
            {{ innerBelongItem.cost_list_sub && !costNumEditDisabled && !preventEditable && innerBelongItem.cost_list_sub_editable ? '' : innerBelongItem.cost_list_sub ? innerBelongItem.cost_list_sub : '' }}
            <v-btn v-if="!preventButton && innerBelongItem.costListBtn"
              :color="innerBelongItem.costListBtn.color ? innerBelongItem.costListBtn.color : 'primary'"
              x-small
              :class="'dont_print ' + (innerBelongItem.costListBtn.class ? innerBelongItem.costListBtn.class : 'ml-3')"
              data-html2canvas-ignore="true"
              :elevation="innerBelongItem.costListBtn.elevation ? innerBelongItem.costListBtn.elevation : '0'"
              @click="innerBelongItem.costListBtn.click"
            >{{ innerBelongItem.costListBtn.text }}
            </v-btn>
          </td>
          <td v-if="!innerBelongItem.cost_list_colspan || innerBelongItem.cost_list_colspan < 2">{{ innerBelongItem.cost_unit }}</td>
          <td v-if="!innerBelongItem.cost_list_colspan || innerBelongItem.cost_list_colspan < 3">
            <v-text-field v-if="!preventEditable && innerBelongItem.cost_num_editable"
              dense
              style="max-width: 50px;"
              :rules="innerBelongItem.allow_integer ? integerRules : innerBelongItem.allow_one_or_greater ? integerOneOrGreaterRules : innerBelongItem.allow_edit_decimal_point ? profiteMaintenanceFeeNumRules : expensesNumRules"
              :disabled="costNumEditDisabled"
              type="number"
              v-model="innerBelongItem.cost_num"
            ></v-text-field>
            {{ !preventEditable && innerBelongItem.cost_num_editable ? '' : innerBelongItem.cost_num }}
          </td>
          <td v-if="!innerBelongItem.cost_list_colspan || innerBelongItem.cost_list_colspan < 4">
            <v-text-field v-if="!costNumEditDisabled && !preventEditable && innerBelongItem.cost_unit_price_editable"
              dense
              style="max-width: 100px;"
              :rules="integerRules"
              :disabled="costNumEditDisabled"
              type="number"
              v-model="innerBelongItem.cost_unit_price"
            ></v-text-field>
            {{ 
              !costNumEditDisabled && !preventEditable && innerBelongItem.cost_unit_price_editable ? ''
              : mux.Number.withComma(innerBelongItem.cost_unit_price) 
            }}
          </td>
          <td v-if="!innerBelongItem.cost_list_colspan || innerBelongItem.cost_list_colspan < 5">{{ mux.Number.withComma(Math.round(innerBelongItem.cost_total ? innerBelongItem.cost_total : innerBelongItem.cost_num && innerBelongItem.cost_unit_price ? innerBelongItem.cost_num * innerBelongItem.cost_unit_price : '')) }}</td>
        </tr>
      </template>
      <tr v-if="index === items.length-1" class="font-weight-black amber lighten-5">
        <td colspan="5" style="font-size: 15px;">합계 (TOTAL)</td>
        <td style="font-size: 15px;">{{ mux.Number.withComma(Math.round(items.reduce((prev, cur)=>{
          return (prev += cur.cost_total ? cur.cost_total : cur.cost_num * cur.cost_unit_price ? cur.cost_num * cur.cost_unit_price :
          (cur.belong_data ? cur.belong_data.reduce((prevB, curB)=>{
            return (prevB += curB.cost_total ? curB.cost_total : curB.cost_num * curB.cost_unit_price ? curB.cost_num * curB.cost_unit_price :
            (curB.belong_data ? curB.belong_data.reduce((prevC, curC)=>{
              return (prevC += curC.cost_total ? curC.cost_total : curC.cost_num && curC.cost_unit_price ? curC.cost_num * curC.cost_unit_price : 0);
            }, 0) : 0) );
          }, 0) : 0) );
        }, 0) )) }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import mux from "@/mux";

/**
 * @file CostTableComponent.vue
 * @description 원가 계산서 테이블 컴포넌트
 *
 * @typedef {Object} props
 * @property {Array} headers - 테이블 헤더 배열 ex) [ {text: '부제품', align: 'center', value: 'product_type'}, {text: '관리코드', align: 'center', value: 'product_code'} ]
 * @property {Array} items - 테이블 아이템 데이터 배열
 * ex )
 * items: [
          {
            cost_no: 1,
            cost_list: '재료비',
            cost_list_colspan: 4,

            belong_data: [
              {
                cost_list: '제품A',
                cost_unit: '제품',
                cost_num: 1,
                cost_unit_price: 15000
              },
              {
                cost_list: '제품B',
                cost_unit: '제품',
                cost_num: 2,
                cost_unit_price: 10000
              }
            ]
          },
          {
            cost_no: 2,
            cost_list: '노무비',
            cost_unit: '식',
            cost_num: 1,
            cost_unit_price: 220290071
          }
        ]
 * @property {String} itemKey - 아이템 키
 * @property {Boolean} [costNumEditDisabled] - 수량 편집 토글 Boolean 변수
 * @property {Boolean} [preventEditable] - 편집 제한 여부(default:false)
 * @property {Boolean} [preventButton] - 버튼 제한 여부(default:false)
 * @property {String} [tableClass] - 테이블 클래스(default:elevation-1)
 * @property {String} [trClass] - 기본 행 클래스(default:'')
 * @property {String} [trStyle] - 기본 행 스타일(default:'')
 * @property {Boolean} [hideChildren] - 자식 행 숨김 여부(default:false)
 * @property {Boolean} [hideGrandChildren] - 손자 행 숨김 여부(default:false)
 * @property {Array} [showChildsParentIndexArr] - 숨기지 않을 자식 행의 부모 행 인덱스 배열(default:undefind)
 * @property {Array} [showGrandChildsParentIndexArr] - 숨기지 않을 손자 행의 부모 행 인덱스 배열(default:undefind)
 * @property {String} [childTrClass] - 자식 행 클래스(default:'')
 * @property {String} [childTrStyle] - 자식 행 스타일(default:'')
 * @property {String} [grandChildTrClass] - 손자 행 클래스(default:'')
 * @property {String} [grandChildTrStyle] - 손자 행 스타일(default:'')
 *
 */
export default {
  props: {
    headers: Array,
    items: Array,
    itemKey: String,
    costNumEditDisabled: Boolean,
    preventEditable: Boolean,
    preventButton: Boolean,
    tableClass: String,
    trClass: String,
    trStyle: String,
    hideChildren: Boolean,
    hideGrandChildren: Boolean,
    showChildsParentIndexArr: Array,
    showGrandChildsParentIndexArr: Array,
    childTrClass: String,
    childTrStyle: String,
    grandChildTrClass: String,
    grandChildTrStyle: String,
  },
  data() {
    return {
      mux: mux,
      profiteMaintenanceFeeNumRules: [
          v => (!!v || v==0) || '0 ~ 1',
          v => v<=1  || '0 ~ 1',
          v => v>=0  || '0 ~ 1',
          v => !!((v || v==0) && /^(?=.{1,6}$)/.test(v) ) || '최대4자리',
        ],
      expensesNumRules: [
        v => (!!v || v==0) || '0 또는 1',
        v => v<=1  || '0 또는 1',
        v => v>=0  || '0 또는 1',
        v => !!((v || v==0) && /^(?=.{1,1}$)/.test(v) ) || '0 또는 1',
      ],
      integerOneOrGreaterRules: [
        v => (!!v) || '1 이상의 정수',
        v => Number.isInteger(Number(v)) || '1 이상의 정수',
        v => v>=1 || '1 이상의 정수',
      ],
      integerRules: [
        v => (!!v) || '정수',
        v => Number.isInteger(Number(v)) || '정수',
      ],
    };
  }
};
</script>
<style>
  .cost_table_border th{border-right: 1px solid #b6b6b6;}
  .cost_table_border thead th:first-child{width: 35px;}
  .cost_table_border thead th:last-child,
  .cost_table_border tbody td:last-child{border-right: 0px;}
  .cost_table_border td{border-right: 1px solid #b6b6b6; }
</style>
