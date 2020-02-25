import {Component} from '@wordpress/element';
import React from "react";
import Async from 'react-select/async';


class SelectField extends Component {
	state = {
		selectOptions: []
	}

	getComponent() {
		const {config, name} = this.props;

		return <Async
			name={name}
			isMulti={config.multiple}
			closeMenuOnSelect={!(config.multiple)}
			isDisabled={!this.props.parent.visible}
			loadOptions={(query, callback) => this.getOptions(query, callback)}
			onChange={this.handleOnChange.bind(this)}
			delimiter={config.multiple ? this.props.parent.field.valueDelimiter : false}
			value={this.getSelectedValue()}
			cacheOptions
			defaultOptions
		/>
	}

	handleOnChange(value, event) {
		event.name = this.props.config.name;
		this.props.handleOnChange(value, event)
	}

	getSelectedValue() {
		if (!this.state.selectOptions || this.state.selectOptions.length) {
			return [];
		}

		return this.state.selectOptions.filter(opt => {
			return this.props.defaultValue && this.props.defaultValue.indexOf(opt.value) !== -1
		});
	}

	setOptionsState(options) {
		this.setState({
			...this.state,
			selectOptions: options
		});
	}

	getOptions(query, callback) {
		if (this.props.config.endpoint === '') {
			this.setOptionsState(this.props.options);
			return callback(this.props.options);
		}

		const {field, value, name} = this.props.parent;

		const {config} = this.props;

		let params = jQuery.param({
			nonce: field.nonce,
			value: value,
			fieldValue: field.value,
			name: name,
			query: query
		});

		let restEndpoint = config.endpoint;
		restEndpoint += restEndpoint.indexOf('?') === -1 ? '?' : '&';
		restEndpoint += params;

		fetch(restEndpoint, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(json => json.options)
			.then(options => {
				this.setOptionsState(options)
				callback(options);
			})

			.catch((error) => {
				console.warn(error);
			});
	}

	getLabel() {
		const {config} = this.props;

		if (!config.label.length) {
			return;
		}

		return <label>{config.label}</label>;
	}

	render() {
		return <div>
			{this.getLabel()}
			{this.getComponent()}
		</div>;
	}
}

export default SelectField;


