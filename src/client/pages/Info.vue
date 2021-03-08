<template>
  <div
    :class="[
      'container',
      'container-ticketstatus',
      `lang-${currentLang}`,
      { onerror: $store.state.errorMsgStr },
    ]"
  >
    <errorOneline
      v-if="$store.state.errorMsgStr"
      :errorMsgStr="`通信エラーが発生しています ${$store.state.errorMsgStr}`"
    ></errorOneline>

    <div class="area area-info" v-once>
      <div class="mainvisual">
        <p>
          <shine-icon targetEvent="langChanged"></shine-icon>
        </p>
      </div>
      <div class="prices">
        <section
          v-for="ticketinfo in ticketinfoArray"
          :key="ticketinfo.ticket_id"
        >
          <div>
            <h2>
              <span
                v-for="lang in langArray"
                :key="`ticketname_${lang}`"
                :class="`langcontent langcontent-${lang}`"
                >{{ ticketinfo[lang].name }}</span
              >
              <span class="cap">
                <span
                  v-for="lang in langArray"
                  :key="`ticketcap_${lang}`"
                  :class="`langcontent langcontent-${lang}`"
                  >{{ ticketinfo[lang].cap }}</span
                >
              </span>
            </h2>
            <p>{{ echoPrice(ticketinfo.price) }}</p>
          </div>
        </section>
      </div>
    </div>

    <div class="area area-schedule">
      <div class="header" v-once>
        <span class="tdt">
          <span
            v-for="lang in langArray"
            :key="`tdt_${lang}`"
            :class="`langcontent langcontent-${lang}`"
            >{{ locale.tdt[lang] }}</span
          >
        </span>
        <span class="separator"></span>
        <clock class="iconBefore icon-clock"></clock>
      </div>
      <table class="table-main">
        <thead v-once>
          <tr>
            <th>
              <span
                v-for="lang in langArray"
                :key="`tourNumber_${lang}`"
                :class="`langcontent langcontent-${lang}`"
                >{{ locale.tourNumber[lang] }}</span
              >
            </th>
            <th class="time">
              <span
                v-for="lang in langArray"
                :key="`entranceTime_${lang}`"
                :class="`langcontent langcontent-${lang}`"
                >{{ locale.entranceTime[lang] }}</span
              >
            </th>
            <th>
              <span
                v-for="lang in langArray"
                :key="`availability_${lang}`"
                :class="`langcontent langcontent-${lang}`"
                >{{ locale.availability[lang] }}</span
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="performance in nearStatusArray"
            :key="performance.id"
            :class="[
              'item',
              getStatusClassNameByPerformance(
                $store.state.moment,
                performance,
                10
              ),
            ]"
          >
            <td>{{ performance.tour_number }}</td>
            <td class="time">
              {{ performance.start_time }} ～ {{ performance.end_time }}
            </td>
            <td class="wrapper-status">
              <span class="status">{{ performance.seat_status }}</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">
              <div
                v-for="(futureAvgStatus, nearIndex) in futureAvgStatusArray"
                :key="nearIndex"
                :class="[
                  'houritem',
                  getStatusClassNameByPerformance(
                    $store.state.moment,
                    futureAvgStatus
                  ),
                ]"
              >
                <p class="hours">{{ futureAvgStatus.hours }}</p>
                <div class="wrapper-status">
                  <p class="status">{{ futureAvgStatus.seat_status }}</p>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>


<script lang="ts">
import Info from './Info';

export default Info;
</script>

<style lang="scss">
.langcontent {
  display: none;
}

$langArray: "ja", "en", "zh-hans";
@each $lang in $langArray {
  .lang-#{$lang} {
    .langcontent-#{$lang} {
      display: inline;
    }
  }
}

.container-ticketstatus {
  display: table;
  // width: 100%;
  // height: 100%;
  width: 1920px;
  height: 1080px;
  margin: auto;
  overflow: hidden;
  background-color: #000;
  pointer-events: none;
  user-select: none;

  > .area {
    mix-blend-mode: screen;
    display: table-cell;
    vertical-align: top;
  }
  .area-info {
    width: 23%;
  }

  .mainvisual {
    display: table;
    width: 100%;
    padding: 12%;
    height: 44%;
    > p {
      vertical-align: middle;
      display: table-cell;
      width: 100%;
      height: 100%;
    }
  }

  .prices {
    height: 54%;
    color: #fff;
    section {
      border-top: 1px solid #999;
      padding: 1em;
      display: table;
      width: 100%;
      height: 25%;
      > div {
        display: table-cell;
        vertical-align: middle;
        height: 100%;
      }
      h2,
      p {
        margin: 0;
      }
      h2 {
        font-size: 36px;
        font-weight: normal;
        span.cap {
          font-size: 32px;
          margin-left: 10px; // 0.5vw;
        }
      }
      p {
        font-size: 42px;
      }
    }
  }
  &.lang-en {
    .prices section {
      h2 {
        span.cap {
          font-size: 26px;
          margin-left: 2px;
        }
      }
    }
  }

  .error-oneline {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 9999;
    opacity: 0.9;
  }

  .header {
    display: table;
    width: 100%;
    background-color: #2d2d2d;
    color: #fff;
    position: relative;
    z-index: 16;
    height: 160px;
    .tdt {
      display: table-cell;
      vertical-align: middle;
      font-size: 70px;
      text-align: right;
      width: 48%;
      .langcontent-ja {
        font-size: 64px;
      }
    }
    .separator {
      display: table-cell;
      width: 4%;
      text-align: center;
      vertical-align: middle;
      &::after {
        content: "";
        display: inline-block;
        height: 64%;
        vertical-align: middle;
        border-right: 1px solid #666;
      }
    }
    .clock {
      font-size: 96px;
      display: table-cell;
      text-align: left;
      vertical-align: middle;
      width: 48%;
      margin: 0;
    }
  }

  .icon-clock {
    &::before {
      width: 58px; // 3vw;
      height: 58px; // 3vw;
      margin-right: 18px; // 1vw;
    }
  }

  .wrapper-status {
    display: table;
    width: 100%;
    height: 100%;
    user-select: none;
    .status {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      font-size: 0;
      &::before {
        content: "";
        display: inline-block;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
  }

  .table-main {
    width: 100%;
    table-layout: fixed;
    border-spacing: 0;
    background-color: #fff;
    padding-top: 160px;
    margin-top: -160px;
    height: 100%;
    td {
      font-size: 64px; // 58px; // 3vw;
      text-align: center;
    }
    .time {
      border-left: 1px solid #686866;
      border-right: 1px solid #686866;
      width: 58%;
    }
    thead {
      background-color: #444;
      color: #fff;
      th {
        font-size: 40px;
        font-weight: normal;
        line-height: 2;
      }
    }
    tbody {
      tr:nth-child(odd) {
        background-color: #ededed;
      }
      .status {
        &::before {
          width: 100px; // 5.2vw;
          height: 100px; // 5.2vw;
        }
      }
    }
    tfoot {
      color: #fff;
      background-color: #999;
      td {
        text-align: left;
      }
      .houritem {
        width: 25%;
        display: inline-block;
        text-align: center;
        vertical-align: top;
        padding: 0;
      }
      .houritem:nth-child(odd) {
        background-color: #7c7c7c;
        .hours {
          background-color: #545454;
        }
      }
      .hours {
        background-color: #777;
        margin: 0;
        font-size: 48px;
        line-height: 1.5;
        height: 64px; // 3.4vw;
      }
      .status {
        height: 130px;
        &::before {
          vertical-align: middle;
          width: 84px;
          height: 84px;
        }
      }
      .houritem:not(.item-last) .status::before {
        filter: invert(100%); // last以外はアイコン色を反転
      }
    }
  }

  .item-capable {
    .status::before {
      background-image: url(../assets/icon-status-capable.svg);
    }
  }
  .item-crowded {
    .status::before {
      background-image: url(../assets/icon-status-crowded.svg);
    }
  }
  .item-soldout {
    .wrapper-status {
      color: #fff;
    }
    .status::before {
      background-image: url(../assets/icon-status-soldout.svg);
    }
  }
  .item-suspended,
  .item-unavailable {
    .status::before {
      background-image: url(../assets/icon-status-unavailable.svg);
    }
  }
}
</style>
