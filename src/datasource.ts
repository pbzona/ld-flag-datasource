// import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { getBackendSrv } from "@grafana/runtime";
import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  url?: string;
  
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) =>
    this.allFlagsRequest(query).then((response) => {
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'flag_key', type: FieldType.string},
          { name: 'targeting_state', type: FieldType.string },
        ],
      });

      for (let flag of response.data.items) {
        const env = query.env ? query.env : 'production'
        const key: string = flag.key;
        const state: boolean = flag.environments[env].on;
        
        frame.appendRow([key, state ? "true" : "false"])
      }

      return frame;
    }));

    return Promise.all(promises).then((data) => ({ data }));
  }

  async allFlagsRequest(query: MyQuery) {
    const routePath = '/flags';
    const result = await getBackendSrv().datasourceRequest({
      method: "GET",
      url: this.url + routePath// + '/api/v2/flags/phil-z-test-project',
    })
  
    return result;
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
