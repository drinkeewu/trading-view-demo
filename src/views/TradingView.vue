<template>
  <div id="tv_chart_container" />
</template>

<script>
import Datafeed from '@/config/datafeed';
import { chartResolution } from '@/utils';
import { TradingView } from 'trader-view';


export default {
  name: 'TradingView',
  data() {
    return {
      datafeed: '',
      isLoading: false,
      resolution: 'D',
      awaitCount: 0,

      klineData: [],
      subscribers: [],
      symbols: [
        {
          symbol: 'BTC/USDT',
          full_name: 'BTC/USDT',
          description: 'BTC/USDT',
          ticker: 'bitcoin',
          type: 'currency',
          exchange: 'BTB',
        },
        {
          symbol: 'symbol',
          full_name: 'full_name',
          description: 'description',
          exchange: 'NasdaqNM',
          ticker: 'ticker1',
          type: 'type1',
        },
        {
          symbol: 'symbol2',
          full_name: 'full_name2',
          description: 'description',
          exchange: 'NYSE',
          ticker: 'ticker1',
          type: 'type2',
        },
      ],
    };
  },
  created() {
    this.initDatafeed();
    this.initWebSocket();
  },
  mounted() {
    this.initTradingView();
  },
  methods: {
    /**
     * 初始化datafeed / JS Api
     * */
    initDatafeed() {
      this.datafeed = new Datafeed(this);
    },
    initWebSocket() {
      this.socket = new WebSocket('wss://www.btb.io/websocket/api');
      this.socket.onopen = () => {
        if (!this.socket) return;
        const data = {
          event: 'addChannel',
          channel: `market.BTC/USDT.kline.${chartResolution[this.resolution]}`,
        };
        this.socket.send(JSON.stringify(data));
      };
      this.socket.onmessage = (ev) => {
        this.onSocketMessage(ev.data);
      };
    },
    initTradingView() {
      this.widget = new TradingView({
        // debug: true,

        fullscreen: true,
        symbol: 'BTC/USDT',
        interval: this.resolution,
        container_id: 'tv_chart_container',

        datafeed: this.datafeed,
        library_path: '/charting_library/',
        locale: 'zh',

        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: 'http://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        // debug: true,
        theme: 'Dark',
        timezone: 'Asia/Shanghai',
      });
    },
    /**
   * 监听WebSocket响应
   * @param msg
   */
    onSocketMessage(msg) {
      try {
        const _msg = JSON.parse(msg);
        const c = `market.BTC/USDT.kline.${chartResolution[this.resolution]}`;
        if (_msg && _msg.data && !this.isLoading && _msg.channel === c) {
          this.onHistoryData(_msg.data);
        }
        if (_msg && _msg.ticker && this.isLoading && _msg.channel === c) {
          this.onTickerData(_msg.ticker);
        }
      } catch (err) {
        console.error(err);
      }
    },
    /** 处理历史数据 */
    onHistoryData(data) {
      const list = [];
      const is1D = this.resolution === 'D';
      for (let i = 0; i < data.length; i++) {
        list.push({
          time: is1D ? data[i].time + 86400000 : data[i].time,
          open: data[i].open,
          high: data[i].hight,
          low: data[i].low,
          close: data[i].close,
          volume: data[i].amount,
        });
      }
      list.sort((a, b) => a.time - b.time);
      this.klineData = list;
      this.isLoading = true;
    },
    /** 处理实时数据 */
    onTickerData(data) {
      const is1D = this.resolution === 'D';
      const bar = {
        time: is1D ? data.time + 86400000 : data.time,
        open: data.open,
        high: data.hight,
        low: data.low,
        close: data.close,
        volume: data.amount,
      };
      if (!this.datafeed) {
        return false;
      }
      this.subscribers[0] && this.subscribers[0].callback(bar);
    },
    onSymbolChange(symbol) {
      // TODO
    },
    /**
     * 异步延迟等待
     */
    delayAwait() {
      return new Promise((resolve, reject) => {
        this.awaitCount++;
        // console.log(`>> Await count:: ${this.awaitCount * 300}ms`);
        if (this.isLoading) {
          return resolve(this.klineData);
        }
        return this.awaitCount < 100 ? reject() : resolve();
      }).catch(() => new Promise((resolve) => {
        setTimeout(resolve, 300);
      }).then(() => this.delayAwait()));
    },
  },
};
</script>

<style></style>
