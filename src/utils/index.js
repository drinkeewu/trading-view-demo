export const log = (string, data = ' ', color = 'yellow') => {
  console.log(`%c${string}`, `color: ${color}`, data);
};

export const toMicroSeconds = (value) => value * 1000;

export const chartResolution = {
  1: '1min',
  5: '5min',
  15: '15min',
  30: '30min',
  60: '60min',
  D: '1day',
  '1W': '1week',
  '1M': '1mon',
};
