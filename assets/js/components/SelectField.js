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
  ajaxSearch
}) => {
  if (!item.options) {
    return '';
  }

  let label = '';
  let component = '';

  if (item.label) {
    label = <label>{item.label}</label>
  }

  if (item.isAsync) {
  } else {
    component = <Select name={name} clearableValue={key} onChange={handleChange} value={value} options={item.options} />
  }
  let component2 = <Async name={name} onChange={handleChange} value={value} loadOptions={ajaxSearch} />

  return <div>
    {label}
    {component}
    {component2}
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
  ajaxSearch: PropTypes.func,
};

const enhance = withHandlers({
  handleChange: ({item, onChange}) => (select) => {
    console.log(select);
    onChange(select, item.key);
  },

  ajaxSearch: ({item, value, name}) => (searchString) => {
    console.log('input: ', searchString);
    return fetch('/rest.php')
      .then((response) => {
        return response.json();
      }).then((json) => {
        return { options: json };
      });

    console.log('a', a);
    console.log('b', b);
  }
});

export default enhance(SelectField);