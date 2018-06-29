/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
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
	items,
	setItems,
	handleChange,
	getFieldValue
}) => {
	let value = field.value;
	console.log(items);
	return <Field field={field}>
		<div className="ntz-taxonomy-term-picker-wrapper">
		{
			items.map((item, key) => {
				item.key = key;
				return <SelectField key={key} item={item} value={value[key] || null} name={`${name}[${key}]`} onChange={handleChange} />
			})
		}

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
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array,
			PropTypes.object,
		]),
	}),
	items:PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	handleChange: PropTypes.func,
};

taxonomytermpicker.defaultProps = {
	field:{
		items: [],
		value: null
	}
}

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

	withState('items', 'setItems', []),

	withProps(),

	lifecycle({
		componentWillMount() {
			let items = this.props.field.items;
			console.log(this);
			console.log(items);
			this.props.setItems(items);
		}
	}),

	/**
	 * The handlers passed to the component.
	 */
	withHandlers({
		handleChange: ({field, setItems, setFieldValue}) => (select, key) => {
			let val = field.value;

			if (!select && key) {
				val = val.slice(0, key);
			}

			field.value[key] = select ? select.value : false;

			setFieldValue(field.id, val);

			console.log(select);
			if (select && select.child) {
			} else {
				setItems([], key)
			}
		}
	})
);

export default setStatic('type', [
	'taxonomytermpicker',
])(enhance(taxonomytermpicker));

