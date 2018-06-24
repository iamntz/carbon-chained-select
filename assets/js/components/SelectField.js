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

import { Async } from 'react-select';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
/**
 * Render a file upload field with a preview thumbnail of the uploaded file.
 *
 * @param  {Object}        props
 * @param  {String}        props.name
 * @param  {Object}        props.field
 * @param  {Function}      props.handleOpenBrowser
 * @param  {Function}      props.handleRemoveItem
 * @return {React.Element}
 */
export const SelectField = ({
  index,
  label,
  options,
  name,
  handleRemoveItem,
  handleChange
}) => {
  return <div>
    <label>{label}</label>
    <Select
        name="form-field-name"
        onChange={handleChange}
        options={options}
      />
    <span className="ntz-taxonomy-term-picker-delete" onClick={handleRemoveItem}>&times;</span>
  </div>;
};

/**
 * Validate the props.
 *
 * @type {Object}
 */
SelectField.propTypes = {
  name: PropTypes.string,
  item: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  handleRemoveItem: PropTypes.func,
  handleChange: PropTypes.func,
};

const enhance = withHandlers({
  handleRemoveItem: ({ index, onRemove }) => (select) => {
    onRemove(select.value);
  },

  handleChange: ({ item, onChange }) => (select) => {
    onChange(select.value);
  },
});

export default enhance(SelectField);