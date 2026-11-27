import { Loader } from '@wavelo/vue';

const valid: InstanceType<typeof Loader>['$props'] = { type: 'ring', size: 32, 'data-analytics': 'catalog' };

// @ts-expect-error Known Wavelo props must reject the wrong value type.
const invalid: InstanceType<typeof Loader>['$props'] = { size: true };
