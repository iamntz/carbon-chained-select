/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, branch, renderComponent, setStatic } from 'recompose';

/**
 * The internal dependencies.
 */
import Field from 'fields/components/field';
import withStore from 'fields/decorators/with-store';
import withSetup from 'fields/decorators/with-setup';


import NoOptions from 'fields/components/no-options';

import SelectField from './SelectField';

export const taxonomytermpicker = ({
	name,
	field,
	handleRemove,
	handleChange
}) => {
	return <Field field={field}>
		<div className="ntz-taxonomy-term-picker-wrapper">
			<SelectField
				index='0'
				label={field.options.label}
				options={field.options.options}
				name={name}
				onRemove={handleRemove}
				onChange={handleChange}
			/>
		</div>
	</Field>;
}

/**
 * Validate the props.
 *
 * @type {Object}
 */
taxonomytermpicker.propTypes = {
	name: PropTypes.string,
	field: PropTypes.shape({
		id: PropTypes.string,
		// value: PropTypes.string,
	}),
	handleRemove: PropTypes.func,
	handleChange: PropTypes.func,
};

/**
 * The enhancer.
 *
 * @type {Function}
 */
export const enhance = compose(
	/**
	 * Connect to the Redux store.
	 */
	withStore(),

	/**
	 * Attach the setup hooks.
	 */
	withSetup(),

	/**
	 * The handlers passed to the component.
	 */
	withHandlers({
		handleRemove: ({ index, onRemove }) => (e) => {
			console.log(e);
		},

		handleChange: ({ item, onChange }) => (e) => {
			console.log(e);
		}
	})
);

export default setStatic('type', [
	'taxonomytermpicker',
])(enhance(taxonomytermpicker));

