import defaultConfig from '@/config/defaultConfig';
import defaultSymbol from '@/config/defaultSymbol';
import { log, toMicroSeconds } from '../utils';

export default class Datafeed {
  constructor(target) {
    this.vm = target;
    this.defaultConfig = defaultConfig();
    this.defaultSymbol = defaultSymbol;
  }

  onReady(callback) {
    return new Promise((resolve) => {
      resolve(this.defaultConfig);
    }).then((data) => callback(data));
  }

  async getBars(
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest,
  ) {
    log('--- getBars ---', symbolInfo);
    const data = await this.vm.delayAwait();
    const { klineData } = this.vm;
    // 只返回有数据的时间段
    if (data && data[0] && toMicroSeconds(from) < data[0].time) {
      const result = klineData.filter(
        (i) => i.time >= toMicroSeconds(from) && i.time <= toMicroSeconds(to),
      );
      onHistoryCallback(result);
      return;
    }
    onHistoryCallback(data, {
      noData: !data.length,
    });
  }

  searchSymbols(
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback,
  ) {
    log('--- searchSymbols ---', {
      userInput,
      exchange,
      symbolType,
    });
    new Promise((resolve) => {
      const { symbols } = this.vm;
      console.log('symbols', symbols);
      let founds = [];
      if (exchange) {
        const isAll = exchange === 'All';
        founds = isAll
          ? [...symbols]
          : symbols.filter(
            (it) => it.exchange === exchange,
          ) || [];
      }
      if (userInput === '' && exchange === '') {
        founds = [...symbols];
      }
      log('founds', founds);
      resolve(founds);
    }).then((data) => {
      onResultReadyCallback(data);
    });
  }

  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback,
  ) {
    const { subscribers } = this.vm;
    const found = subscribers.some((i) => i.uid === subscriberUID);
    if (found) return false;


    subscribers.push({
      symbol: symbolInfo,
      resolution,
      uid: subscriberUID,
      callback: onRealtimeCallback,
    });
  }


  resolveSymbol(
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) {
    log('--- resolveSymbols ---', symbolName);
    const { onSymbolChange } = this.vm;
    onSymbolChange(symbolName);
    return new Promise((resolve) => {
      resolve(this.defaultSymbol);
    }).then((data) => {
      onSymbolResolvedCallback(data);
    }).catch((e) => {
      onResolveErrorCallback(e);
    });
  }
}
