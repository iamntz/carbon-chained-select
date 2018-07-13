/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  withState,
  compose,
  withHandlers,
  branch,
  withProps,
  renderComponent,
  lifecycle,
  setStatic
} from 'recompose';

import {
  cloneDeep,
  without,
  isMatch,
  isString,
  sortBy,
  includes,
  field,
  find
} from 'lodash';

/**
 * The internal dependencies.
 */
import { preventDefault } from 'lib/helpers';

import Select from 'react-select';
import { Async } from 'react-select';
import { AsyncCreatable } from 'react-select';

import 'react-select/dist/react-select.css';

export const SelectField = ({
  item,
  field,
  name,
  value,
  joinValues,
  delimiter,
  disabled,
  handleChange,
  getOptions
}) => {
  if (!item.options) {
    return '';
  }

  let label = '';
  let component = '';

  if (item.config.label) {
    label = <label>{item.config.label}</label>
  }

  component = <Async
    name={name}
    onChange={handleChange}
    value={value}
    field={field}
    multi={item.config && item.config.multiple}
    closeOnSelect={!(item.config && item.config.multiple)}
    joinValues={joinValues}
    delimiter={delimiter}
    disabled={disabled}
    loadOptions={getOptions}
    {...field.selectConfig} />

  return <div>
    {label}
    {component}
  </div>;
};

/**
 * Validate the props.
 *
 * @type {Object}
 */
SelectField.propTypes = {
  name: PropTypes.string,
  handleChange: PropTypes.func,
  getOptions: PropTypes.func,
};


const enhance = compose(
  withState(),

  withHandlers({
    handleChange: ({item, onChange}) => (select) => {
      onChange(select, item);
    },

    getOptions: ({field, item, value, name}) => (query, callback) => {
      if (item.config.endpoint !== '') {
        let params = jQuery.param({
          nonce: field.nonce,
          value: value,
          fieldValue: field.value,
          name: name,
          query: query
        });

        let restEndpoint = item.config.endpoint;
        restEndpoint += restEndpoint.indexOf('?') === -1 ? '?' : '&';
        restEndpoint += params;

        return fetch(restEndpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            return response.json();
          }).then((json) => {
            return { options: json.options };
          }).catch((error) => {
            console.warn(error);
          });
      }

      if (item.options.length) {
        return callback(null, {
          options: item.options,
          complete: (item.options.loadMore || false)
        });
      }
    }
  })
);

export default enhance(SelectField);