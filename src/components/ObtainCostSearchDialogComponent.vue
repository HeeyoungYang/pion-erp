<template>
  <v-dialog
  v-model="dialog"
  :max-width="maxWidth ? maxWidth : '50%'"
  :persistent="persistent ? persistent : false"
  :transition="dialogTransition ? dialogTransition : ''"
  :content-class="dialogCustom ? dialogCustom : ''"
  @click:outside="persistent ? null : close()">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="attrs" v-on="on"></slot>
    </template>
    <v-card elevation="0">
      <v-card-title style="width:100%;">
        <InputsFormComponent
          dense
          clearable
          hide-details
          :inputs="searchCardInputs"
          @enter="search"
        >
          <v-col
            cols="12"
            sm="3"
            align-self="center"
          >
            <v-btn
              small
              color="primary"
              elevation="2"
              @click="search"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-icon class="float-right" @click="close">mdi-close-circle</v-icon>
          </v-col>
        </InputsFormComponent>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          dense
        >
          <template v-slot:[`item.set`]="{ item }">
            <v-btn x-small color="primary" @click="apply(item)">적용</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ObtainCostSearchDialogConfig from "@/configure/ObtainCostSearchDialogConfig.json";
import InputsFormComponent from "@/components/InputsFormComponent.vue";
import mux from "@/mux";
// import DataTableComponent from "@/components/DataTableComponent";
/**
 * @file ModalDialogComponent.vue
 * @description 모달 다이얼로그 컴포넌트
 *
 * @typedef {Object} props
 * @property {Boolean} dialogValue - 모달 오픈 여부
 * @property {Boolean} [persistent] - 외부 클릭 방지 여부(default:false)
 * @property {Boolean} [fullscreen] - 외부 클릭 방지 여부(default:false)
 * @property {Boolean} [hideOverlay] - 외부 클릭 방지 여부(default:false)
 * @property {String} [maxWidth] - 최대 가로 길이(defalt:500px)
 * @property {String} [dialogTransition] - 모달 오픈 방식 (슬라이드 등) (defalt:'')
 * @property {String} [dialogCustom] - 모달 커스텀 css (defalt:'')
 * @property {String} [cardElevation] - 카드 그림자 설정 (defalt:'2')
 * @property {String} [title] - 제목 텍스트
 * @property {String} [titleClass] - 제목 클래스
 * @property {String} [textClass] - 본문 클래스
 * @property {String} [saveText] - 저장 버튼 텍스트
 * @property {String} [confirmText] - 확인 버튼 텍스트
 * @property {String} [closeText] - 취소 버튼 텍스트
 *
 * @emits ModalDialogComponent#save
 * @emits ModalDialogComponent#confirm
 * @emits ModalDialogComponent#close
 */
export default {
  props: {
    dialogValue: Boolean,
    persistent: Boolean,
    fullscreen: Boolean,
    hideOverlay: Boolean,
    maxWidth: String,
    dialogTransition: String,
    cardElevation: String,
    dialogCustom: String,
    title: String,
    titleClass: String,
    textClass: String,
    saveText: String,
    confirmText: String,
    closeText: String
  },
  components:{
    InputsFormComponent
    // DataTableComponent,
  },
  data() {
    return {
      items:[],
      dialog: this.dialogValue,
      thisfunc: this.thisfunc,
      eventAdded: false,
      headers:[],
      searchCardInputs: ObtainCostSearchDialogConfig.searchCardInputs,
      searchResult: {}
    };
  },
  watch: {
    dialogValue(value) {
      this.dialog = value;
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      this.headers = ObtainCostSearchDialogConfig.table_header;
      this.items = [];
      this.searchResult = {};
    },
    async search() {
      mux.Util.showLoading();

      let inputs = [];
      this.searchCardInputs.forEach((input) => {
        if (input.value && String(input.value).trim()) {
          inputs.push(String(input.value).trim());
        }else {
          inputs.push("");
        }
      });
      console.log('inputs :>> ', inputs);

      const prevURL = window.location.href;
      let reqURL = '/api/obtain-order/';
      reqURL += '?send_production_request_id=' + this.$cookies.get(this.$configJson.cookies.id.key);
      reqURL += '&approval_phase=승인';
      let reqURL2 = '/api/design-production-search/';
      // project_code = '';
      if (inputs[0]){
        reqURL += '&inhouse_bid_number=' + inputs[0];
        reqURL2 += '?inhouse_bid_number=' + inputs[0];
      }
      if (inputs[1]){
        reqURL += '&company_bid_number=' + inputs[1];
        reqURL2 += inputs[0] ? '&company_bid_number=' + inputs[1] : '?company_bid_number=' + inputs[1];
      }
      if (inputs[2]){
        reqURL += '&company_name=' + inputs[2];
        reqURL2 += (inputs[0] || inputs[1]) ? '&company_name=' + inputs[2] : '?company_name=' + inputs[2];
      }
      
      try {
        let result = await mux.Server.get({path: reqURL});
        if (prevURL !== window.location.href) return;

        if (typeof result === 'string'){
          result = JSON.parse(result);
        }
        if(result['code'] == 0 || (typeof result['data'] === 'object' && result['data']['code'] == 0) || (typeof result['response'] === 'object' && typeof result['response']['data'] === 'object' && result['response']['data']['code'] == 0)){
          this.searchResult = result.data;
          // this.searchResult = JSON.parse(JSON.stringify(ObtainCostSearchDialogConfig.test_product_cost_data));
          this.searchResult.confirmation = this.searchResult.confirmation.filter(x => this.searchResult.last_confirmation.find(xx=>xx.cost_calc_code === x.cost_calc_code) && x.send_production_request_id === this.$cookies.get(this.$configJson.cookies.id.key));

          let result2 = await mux.Server.get({path: reqURL2});
          if (prevURL !== window.location.href) return;

          if (typeof result2 === 'string'){
            result2 = JSON.parse(result2);
          }
          if(result2['code'] == 0 || (typeof result2['data'] === 'object' && result2['data']['code'] == 0) || (typeof result2['response'] === 'object' && typeof result2['response']['data'] === 'object' && result2['response']['data']['code'] == 0)){
            this.searchResult.confirmation = this.searchResult.confirmation.filter(x => result2.data.confirmation.findIndex(xx=>xx.obtain_cost_calc_code === x.cost_calc_code) === -1);
            
          }else{
            mux.Util.showAlert(result2['failed_info']);
          }

          this.searchResult.product_cost = this.searchResult.product_cost.filter(x => this.searchResult.confirmation.find(xx=>xx.cost_calc_code === x.cost_calc_code));
          this.searchResult.confirmation.reverse(); // 최신순으로 정렬
          this.searchResult.confirmation = this.searchResult.confirmation.filter(x=> this.searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          const uniqueConfirmation = [];
          const confirmationMap = new Map();

          this.searchResult.confirmation.forEach(item => {
            const code = item.cost_calc_code;
            const time = new Date(item.modified_time).getTime();

            if (!confirmationMap.has(code) || time > confirmationMap.get(code)) {
              confirmationMap.set(code, time);
            }
          });
          confirmationMap.forEach((time, code) => {
            const item = this.searchResult.confirmation.find(item => item.cost_calc_code === code && new Date(item.modified_time).getTime() === time);
            uniqueConfirmation.push(item);
          });
          this.searchResult.confirmation = uniqueConfirmation;
          this.searchResult.product_cost = this.searchResult.product_cost.filter(x=> this.searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          this.searchResult.labor_cost_calc_detail = this.searchResult.labor_cost_calc_detail.filter(x=> this.searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          this.searchResult.product_cost_calc_detail = this.searchResult.product_cost_calc_detail.filter(x=> this.searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          this.searchResult.construction_materials_data = this.searchResult.construction_materials_data.filter(x=> this.searchResult.last_confirmation.find(last => last.cost_calc_code === x.cost_calc_code));
          this.searchDataCalcProcess(this.searchResult);

        }else{
          mux.Util.showAlert(result['failed_info']);
        }

      } catch (error) {
        if (prevURL !== window.location.href) return;
        mux.Util.hideLoading();
        mux.Util.showAlert(error);
      }

      mux.Util.hideLoading();
    },
    close() {
      this.$emit("update:dialogValue", false);
      this.$emit("close");
      this.initialize();
    },
    apply(item) {
      let applyObj = {};
      Object.keys(this.searchResult).forEach(key => {
        if (Array.isArray(this.searchResult[key])){
          this.searchResult[key].forEach(a=>{
            if (a.cost_calc_code === item.cost_calc_code){
              if (applyObj[key] === undefined){
                applyObj[key] = [];
              }
              applyObj[key].push(a);
            }
          });
        }
      });
      
      this.$emit("apply", applyObj);
      this.initialize();
    },
    save() {
      this.$emit("save");
    },
    confirm() {
      this.$emit("confirm");
    },


    searchDataCalcProcess(searchResult, isFirst){
      const productTotalCost = {};
      searchResult.product_cost_calc_detail.forEach(a=>{
        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.product_num && a.product_unit_price ? a.product_num * a.product_unit_price : a.module_num && a.module_unit_price ? a.module_num * a.module_unit_price : a.material_num && a.material_unit_price ? a.material_num * a.material_unit_price : 0);
        }
      });
      searchResult.construction_materials_data.forEach(a=>{
        if (!productTotalCost[a.cost_calc_code]){
          productTotalCost[a.cost_calc_code] = Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }else {
          productTotalCost[a.cost_calc_code] += Math.round(a.construction_materials_num * a.construction_materials_unit_price);
        }
      });
      const directLaborCost = {};
      searchResult.labor_cost_calc_detail.forEach(a=>{
        if (!directLaborCost[a.cost_calc_code]){
          directLaborCost[a.cost_calc_code] = Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }else {
          directLaborCost[a.cost_calc_code] += Math.round(a.unit_price * a.quantity * a.man_per_hour);
        }
      });

      const productCostArr = searchResult.product_cost.map((info)=> {
        const productTotalCostInfo = productTotalCost[info.cost_calc_code] ? productTotalCost[info.cost_calc_code] : 0;
        const directLaborCostInfo = directLaborCost[info.cost_calc_code];

        let indirectLaborUnitPrice = Math.round(directLaborCostInfo * info.indirect_labor_ratio);
        const indirectLaborCost = Math.round(indirectLaborUnitPrice * info.indirect_labor_num);
        const totalLaborCost = directLaborCostInfo + indirectLaborCost;
        let employmentInsuranceUnitPrice = Math.round(totalLaborCost * info.employment_insurance_ratio);
        const employmentInsuranceCost = Math.round(employmentInsuranceUnitPrice * info.employment_insurance_num);
        let toolRentFeeUnitPrice = Math.round(directLaborCostInfo * info.tool_rent_fee_ratio);
        const toolRentFeeCost = Math.round(toolRentFeeUnitPrice * info.tool_rent_fee_num);
        let transportationFeeUnitPrice = Math.round(totalLaborCost * info.transportation_fee_ratio);
        const transportationFeeCost = Math.round(transportationFeeUnitPrice * info.transportation_fee_num);
        let industrialAccidentUnitPrice = Math.round(totalLaborCost * info.industrial_accident_ratio);
        const industrialAccidentCost = Math.round(industrialAccidentUnitPrice * info.industrial_accident_num);
        let taxesDuesUnitPrice = Math.round(totalLaborCost * info.taxes_dues_ratio);
        const taxesDuesCost = Math.round(taxesDuesUnitPrice * info.taxes_dues_num);
        let welfareBenefitsUnitPrice = Math.round(totalLaborCost * info.welfare_benefits_ratio);
        const welfareBenefitsCost = Math.round(welfareBenefitsUnitPrice * info.welfare_benefits_num);
        let retirementUnitPrice = Math.round(directLaborCostInfo * info.retirement_ratio);
        const retirementCost = Math.round(retirementUnitPrice * info.retirement_num);
        let expendablesUnitPrice = Math.round(totalLaborCost * info.expendables_ratio);
        const expendablesCost = Math.round(expendablesUnitPrice * info.expendables_num);
        let industrialSafetyUnitPrice = Math.round(directLaborCostInfo * info.industrial_safety_ratio);
        const industrialSafetyCost = Math.round(industrialSafetyUnitPrice * info.industrial_safety_num);
        const totalExpenseFeeCost = employmentInsuranceCost + toolRentFeeCost + transportationFeeCost + industrialAccidentCost + taxesDuesCost + welfareBenefitsCost + retirementCost + expendablesCost + industrialSafetyCost;
        let normalMaintenanceFeeUnitPrice = Math.round((productTotalCostInfo + totalLaborCost + totalExpenseFeeCost) * info.normal_maintenance_fee_ratio);
        const normalMaintenanceFeeCost = Math.round(normalMaintenanceFeeUnitPrice * info.normal_maintenance_fee_num);
        let profiteUnitPrice = Math.round((totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost) * info.profite_ratio);
        const profiteCost = Math.round(profiteUnitPrice * info.profite_num);

        const allTotalCost = productTotalCostInfo + totalLaborCost + totalExpenseFeeCost + normalMaintenanceFeeCost + profiteCost;
        info.cost_total_amount = mux.Number.withComma(allTotalCost);
        if (isFirst){
          info.product_name += '('+info.product_spec+')';
        }
        if (info.created_time){
          info.full_created_time = info.created_time + "";
          info.created_time = mux.Date.format(info.created_time, 'yyyy-MM-dd');
        }

        searchResult.confirmation.forEach(confirmation => {
          if (confirmation.cost_calc_code === info.cost_calc_code){
            Object.keys(confirmation).forEach(key=> {
              if (key === 'created_time'){
                confirmation[key] = mux.Date.format(confirmation[key], 'yyyy-MM-dd');
              }
              info[key] = confirmation[key];
            });
          }
        });

        return info;
      });

      this.items = productCostArr;
    },
  }
};
</script>

