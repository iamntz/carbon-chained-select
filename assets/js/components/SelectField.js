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

const getOptions = (input) => {
  console.log(input);
  return fetch('/rest.php')
    .then((response) => {
      return response.json();
    }).then((json) => {
      return { options: json };
    });
}

export const SelectField = ({
  item,
  name,
  value,
  key,
  handleChange
}) => {
  if (!item.options) {
    return '';
  }

  let label = '';
  let component = '';

  if (item.label) {
    label = <label>{item.label}</label>
  }

  console.log(item.options);
  if (isString(item.options)) {
    component = <Async name={name} onChange={handleChange} value={value} loadOptions={getOptions} />
  } else {
    component = <Select name={name} clearableValue={key} onChange={handleChange} value={value} options={item.options} />
  }

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
};

const enhance = withHandlers({
  handleChange: ({item, onChange}) => (select) => {
    onChange(select, item.key);
  },
});

export default enhance(SelectField);