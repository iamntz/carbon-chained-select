/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withHandlers } from 'recompose';

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
  handleChange
}) => {
  return <div>
    <label>{item.label}</label>
    <Select key={key} name={name} clearableValue={key} onChange={handleChange} value={value} options={item.options} />
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