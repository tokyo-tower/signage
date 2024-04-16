<template>
  <transition name="fadeup">
    <div
      :class="[
        'container',
        'container-checkintime',
        `lang-${currentLang}`,
        {
          onerror: $store.state.errorMsgStr,
        },
      ]"
    >
      <errorOneline
        v-if="$store.state.errorMsgStr"
        :errorMsgStr="`データ取得エラーが発生しています ${$store.state.errorMsgStr}`"
      ></errorOneline>

      <header v-once>
        <div class="inner">
          <div class="iconwrapper">
            <shine-icon class="logo" targetEvent="langChanged"></shine-icon>
          </div>
          <div class="clockwrapper">
            <clock class="icon-clock"></clock>
          </div>
        </div>
      </header>

      <table class="table-tours">
        <thead>
          <tr>
            <th>{{ locale.tourNumber[currentLang] }}</th>
            <th>{{ locale.entranceTime[currentLang] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!currentPerformanceArray.length">
            <td></td>
            <td></td>
          </tr>
          <tr
            v-for="currentPerformance in currentPerformanceArray"
            :key="currentPerformance.id"
          >
            <td>{{ currentPerformance.tour_number }}</td>
            <td>
              {{ currentPerformance.start_time }} ～
              {{ currentPerformance.end_time }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr
            v-for="(currentPerformance, index) in currentPerformanceArray" v-if="index === currentPerformanceArray.length - 1"
            :key="index"
          >
            <td colspan="2">{{ locale.entranceTimeInfomation[currentLang].replace('%time%', currentPerformance.end_time) }}</td>
          </tr>
          <tr>
            <td colspan="2">{{ locale.pleasePrepare[currentLang] }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </transition>
</template>


<script lang="ts">
import GuideGate from './GuideGate';

export default GuideGate;
</script>

<style lang="scss" scoped>
.langcontent {
  display: none;
}
.lang-en {
  .langcontent-en {
    display: block;
  }
}
.lang-ja {
  .langcontent-ja {
    display: block;
  }
}
.container {
  width: 1920px; // 100%;
  height: 1080px; // 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
}
h2,
h3,
p {
  font-weight: normal;
  margin: 0;
}
header {
  color: #fff;
  background-color: #000;
  height: 200px; // 10.5vw;
  text-align: center;
  > .inner {
    display: table;
    width: 100%;
    height: 100%;
    > div {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }
  }
  .iconwrapper {
    width: 200px; // 10.5vw;
    .logo {
      width: 150px; // 8vw;
      height: 150px; // 8vw;
    }
  }
  .clockwrapper {
    background: #212121;
  }
  .clock {
    margin-left: -200px; // -10.5vw;
    font-size: 110px;
  }
  .icon-clock {
    &::before {
      width: 76px; // 4vw;
      height: 76px; // 4vw;
      margin-right: 30px; // 1.6vw;
    }
  }
}
.table-tours {
  width: 100%;
  height: 100%;
  table-layout: fixed;
  position: absolute;
  margin-top: -200px; // -10.5vw;
  padding-top: 200px; // 10.5vw;
  z-index: -1;
  border-spacing: 0;
  background-color: #fff;
  td {
    font-size: 192px; // 3vw;
    text-align: center;
  }
  thead,
  tbody {
    th:first-child,
    td:first-child {
      border-right: 1px solid #686866;
      width: 28%;
    }
  }
  thead {
    background-color: #444;
    color: #fff;
    th {
      font-size: 60px;
      font-weight: normal;
      line-height: 1.2;
    }
  }
  tbody {
    tr:nth-child(odd) {
      background-color: #ededed;
    }
    td:first-child {
      font-size: 192px; // 10vw;
    }
    td:last-child {
      font-size: 172px; // 7vw;
    }
  }
  tfoot {
    color: #000;
    background-color: #e8e8e8;
    height: 100px;
    text-align: center;
    td {
      font-size: 54px; // 2.8vw;
      line-height: 1.8;
    }
  }
}
</style>
