/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withHandlers } from 'recompose';

import {
  cloneDeep,
  without,
  isMatch,
  isString,
  sortBy,
  includes,
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
  name,
  value,
  key,
  handleChange,
  getOptions
}) => {
  if (!item.options) {
    return '';
  }

  let label = '';
  let component = '';

  if (item.label) {
    label = <label>{item.label}</label>
  }

  component = <Async name={name}
    clearableValue={key}
    onChange={handleChange}
    value={value}
    loadOptions={getOptions}/>

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
  key: PropTypes.number,
  handleChange: PropTypes.func,
  getOptions: PropTypes.func,
};

const enhance = withHandlers({
  handleChange: ({item, onChange}) => (select) => {
    onChange(select, item.key);
  },

  getOptions: ({item, value, name}) => (searchString, callback) => {
    console.log('input: ', item);

    if (item.config && item.config.endpoint) {
      return fetch(item.config.endpoint)
        .then((response) => {
          return response.json();
        }).then((json) => {
          return { options: json.options };
        });
    }

    if (item.options.length) {
      return callback(null, { options: item.options, complete: true });
    }


    // return item.options;

    // console.log('a', a);
    // console.log('b', b);
  }
});

export default enhance(SelectField);