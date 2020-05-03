export default (
  exchanges,
  symbolsTypes,
) => ({
  supports_search: true,
  supports_group_request: false,
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: exchanges || [
    { value: 'All', name: '', desc: '' },
    { value: 'NasdaqNM', name: 'NasdaqNM', desc: 'NasdaqNM' },
    { value: 'NYSE', name: 'NYSE', desc: 'NYSE' },
    { value: 'NCM', name: 'NCM', desc: 'NCM' },
    { value: 'NGM', name: 'NGM', desc: 'NGM' },
    { value: 'BTB', name: 'BTB', desc: 'BTB' },
  ],
  symbols_types: symbolsTypes || [
    { name: 'All types', value: '' },
  ],
  supported_resolutions: ['1', '5', '15', '30', '60', 'D', '1W', '1M'],
});
