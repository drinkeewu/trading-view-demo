export default {

  name: 'BTC/USDT',
  full_name: 'BTC/USDT',

  description: 'BTC/USDT',

  session: '24x7',
  ticker: 'bitcoin',

  exchange: 'BTB',
  listed_exchange: 'BTB',
  timezone: 'Asia/Shanghai',

  format: 'price',

  pricescale: Math.pow(10, 2),

  minmov: 1,

  has_intraday: true,

  supported_resolutions: ['1', '5', '15', '30', '60', 'D', '1W', '1M'],

};
