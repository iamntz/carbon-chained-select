/**
 * External dependencies.
 */
import {Component} from '@wordpress/element';
import React from "react";

import {isArray} from 'lodash';

import Select from './inc/Select';

class Field extends Component {
	/**
	 * Config fields are stored in a nested format. We are going to „flatted” the options
	 */
	getSelectOptions() {
		let value = this.props.field.value;

		let items = [
			this.props.field.items
		];

		if (!value.length) {
			return [];
		}

		/**
		 * Parse items recursively in order to be sure we have pre-selected the right values on render secondary fields
		 */
		const parseOptions = (children, deep = 0) => {
			if (!children.options.length || !value[deep]) {
				return;
			}

			children.options.map((child, index) => {
				if (!child || !child.value) {
					return;
				}

				let deepValue = value[deep][Object.keys(value[deep])[0]] || null

				if (child.value !== deepValue) {
					return;
				}

				if (child.child && child.child.options) {
					items.push(child.child);
					parseOptions(child.child, (deep + 1));
				}
			})
		}

		parseOptions(items[0], 0);

		return items;
	}

	render() {
		const {
			id,
			name,
			value,
			field,
		} = this.props;

		const {
			items
		} = field;

		return (
			<div className="ntz-chained-select-wrapper">
				{this.getSelectOptions().map((item, index) => {
					return <Select
						index={index}
						key={item.config._id}
						config={item.config}
						options={item.options}
						parent={this.props}
						defaultValue={this.getDefaultValue(item, index)}
						name={`${name}[${item.config.name}]`}
						handleOnChange={(select, event) => this.onChange(index, select, event)}
					/>
				})}
			</div>

		);
	}

	onChange(index, select, event) {
		const {field} = this.props
		const value = field.value.slice(0, index);
		const {id, onChange} = this.props;

		let data;

		if (!select) {
			onChange(id, value);
			return;
		}

		if (select.value) {
			data = select.value;
		} else if (isArray(select)) { // is multiple="true" ?
			data = select.map((o) => o.value);
		}

		console.log(event);
		value[index] = {};
		value[index][event.name] = data;

		console.log(value);

		onChange(id, value);
	}

	getDefaultValue(item, index) {
		const {
			value,
		} = this.props;

		return value[index] && value[index][item.config.name] || null;
	}
}

export default Field;
