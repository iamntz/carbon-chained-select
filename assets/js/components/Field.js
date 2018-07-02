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
	  * key conflicting is the culprit, so we're using unique id for keys
	  */
	return <Field field={field}>
		<div className="ntz-chained-select-wrapper">
		{
			items.map((item, index) => {
				item.index = index;
				item.name = (item.config && item.config.name) || index;

				return <SelectField
					key={uniqueId(index)}
					index={index}
					config={item.config || {}}
					item={item}
					field={field}
					value={value[index] && value[index].value || null}
					name={`${name}[${item.name}]`}
					joinValues={field.valueDelimiter.length > 0}
					delimiter={field.valueDelimiter}
					disabled={!field.ui.is_visible}
					onChange={handleChange} />
			})
		}

		</div>
	</Field>;
}

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


export const enhance = compose(
	withStore(),
	withSetup(),
	withState('items', 'setItems', []),
	withProps(),

	lifecycle({
		componentWillMount() {
			let initialOptions = this.props.field.items;
			let value = this.props.field.value;
			let items = [];

			/**
			 * First select control with the default options
			 */
			items.push(initialOptions);

			/**
			 * Parse items recursively in order to be sure we have pre-selected the right values on render secondary fields
			 */
			let parseOptions = (children, deep = 0) => {
				children.options.map((child, index) => {
					if(child.value != value[deep].value) {
						return;
					}

					if (child.child && child.child.options && child.child.options.length) {
						items.push(child.child);
						parseOptions(child.child, (deep + 1));
					}
				})
			}

			parseOptions(initialOptions, 0);

			console.log('parsed items: ', items.length, items);

			this.props.setItems(items);
		}
	}),

	withHandlers({
		handleChange: ({items, field, setItems, setFieldValue}) => (select, item) => {
			let value =  [];

			console.log('=========================');
			console.log('value', field.value);
			console.log('select', select);
			console.log('items', items);
			console.log('item', item);
			console.log('=========================');

			if (select) {
				// value = value.slice(0, item.index);
			}

			let newVal = {};
			newVal[item.name] = select.value

			value.push(newVal);


			setFieldValue(field.id, value);

			let newItems = items.slice(0, value.length);
		  setItems(newItems);
		},
	})
);

export default setStatic('type', [
	'chainedselect',
])(enhance(chainedselect));

