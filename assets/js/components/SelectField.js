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

const getOptions = (input, callback) => {
  setTimeout(() => {
    callback(null, {
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: true
    });
  }, 500);
};

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

  console.log('async!', item);
  if (item.isAsync) {
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