<template>
  <div>
    <!-- ▼ 상단 바, 좌측 메뉴 (기본 레이아웃) -->
    <NavComponent></NavComponent>

    <!-- ▼ 본문 영역 -->
    <v-main>
      Home
    </v-main>

  </div>
</template>
<script>
import NavComponent from "@/components/NavComponent";
export default {
  components: {
                NavComponent,
              },
  data(){
    return {

    }
  }
}

</script>
<style>

</style>
