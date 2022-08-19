import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryText: event.target.value });
  };

  onEnvChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, env: event.target.value });
    // executes the query
    onRunQuery();
  };

  onTagChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, tag: event.target.value });
    // executes the query
    onRunQuery();
  };

  onLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, limit: parseInt(event.target.value, 10) });
    // executes the query
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryText, env, tag, limit } = query;

    return (
      <div className="gf-form">
        <FormField
          width={20}
          value={env || ''}
          onChange={this.onEnvChange}
          label="Env"
          type="string"
        />
        <FormField
          width={20}
          value={tag || ''}
          onChange={this.onTagChange}
          label="Tag"
          type="string"
        />
        <FormField
          width={4}
          value={limit || ''}
          onChange={this.onLimitChange}
          label="Limit"
          type="number"
          step="1"
        />
        <FormField
          labelWidth={8}
          value={queryText || ''}
          onChange={this.onQueryTextChange}
          label="Query Text"
          tooltip="Not used yet"
        />
      </div>
    );
  }
}
