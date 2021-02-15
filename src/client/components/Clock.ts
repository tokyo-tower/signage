import moment from "moment";
import Vue from 'vue';
import { schedule } from "../mixins";

export default Vue.extend({
  data() {
    return {
      moment_now: moment(),
      timeoutInstance_updateMoment: <NodeJS.Timeout | null>null,
    };
  },
  computed: {
    HH() {
      return this.$data.moment_now.format("HH");
    },
    mm() {
      return this.$data.moment_now.format("mm");
    },
  },
  methods: {
    getNextTickUnixtime: schedule.getNextTickUnixtime,
    setTimeoutUpdateMoment() {
      if (this.timeoutInstance_updateMoment !== null) {
        clearTimeout(this.timeoutInstance_updateMoment);
      }
      this.timeoutInstance_updateMoment = setTimeout(() => {
        this.moment_now = moment();
        this.setTimeoutUpdateMoment();
      }, this.getNextTickUnixtime());
    },
  },
  created() {
    this.setTimeoutUpdateMoment();
  },
  beforeDestroy() {
    if (this.timeoutInstance_updateMoment !== null) {
      clearTimeout(this.timeoutInstance_updateMoment);
    }
  },
});