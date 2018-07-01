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

import {
	cloneDeep,
	without,
	isMatch,
	isObject,
	sortBy,
	includes,
	uniqueId,
	find
} from 'lodash';

/**
 * The internal dependencies.
 */
import Field from 'fields/components/field';
import withStore from 'fields/decorators/with-store';
import withSetup from 'fields/decorators/with-setup';


import NoOptions from 'fields/components/no-options';

import SelectField from './SelectField';

export const chainedselect = ({
	name,
	field,
	items,
	handleChange
}) => {
	let value = field.value;
	 /**
	  * For some reasons, nested fields are not updated if not cleared first. After some fiddling around,
	  * key conflicting is the culprit
	  */

	return <Field field={field}>
		<div className="ntz-chained-select-wrapper">
		{
			items.map((item, key) => {
				item.key = key;
				return <SelectField
					key={uniqueId(key)}
					index={key}
					config={item.config || {}}
					item={item}
					field={field}
					value={value[key] || null}
					name={`${name}[${key}]`}
					joinValues={field.valueDelimiter.length > 0}
					delimiter={field.valueDelimiter}
					disabled={!field.ui.is_visible}
					onChange={handleChange} />
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
chainedselect.propTypes = {
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

chainedselect.defaultProps = {
	items: [],
	field:{
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
			let initialOptions = this.props.field.items;
			let value = this.props.field.value;
			let items = [];

			items.push(initialOptions);

			/**
			 * Parse items recursively in order to be sure we have pre-selected the right values on render
			 *
			 * @param      {object}  children  The children
			 * @param      {number}  nesting   nesting level
			 * @return     {void}
			 */
			let parseOptions = (children, nesting = 0) => {
				if (!value[nesting]) {
					return;
				}

				children.options.map((child, index) => {
					if(child.value != value[nesting]) {
						return;
					}

					if (child.child) {
						items.push(child.child);
						parseOptions(child.child, (nesting + 1));
					}
				})
			}

			parseOptions(initialOptions, 0);

			this.props.setItems(items);
		}
	}),

	/**
	 * The handlers passed to the component.
	 */
	withHandlers({
		handleChange: ({items, field, setItems, setFieldValue}) => (select, key) => {
			let value = field.value || [];

			if (!select && key) {
				value = value.slice(0, key);
			}

			value[key] = false;

			if (select) {
				if (select.value) {
					value[key] = select.value
				} else if(select[0] && select[0].value) {
					value[key] = select.map((o) => o.value );
				}
			}

			let newItems = items.slice(0, key + 1);

			if (select && select.child) {
				newItems.push(select.child)
			}

			setFieldValue(field.id, value)
		  setItems(newItems);
		},
	})
);

export default setStatic('type', [
	'chainedselect',
])(enhance(chainedselect));

