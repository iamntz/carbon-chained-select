<?php

namespace iamntz\carbon\taxonomyTermPicker;

use Carbon_Fields\Field\Field;
use Carbon_Fields\Field\Predefined_Options_Field;
use Carbon_Fields\Value_Set\Value_Set;

class TaxonomyTermPicker_Field extends Predefined_Options_Field
{
	protected $default_value = [];
	protected $value_delimiter = '|';

	public function __construct($type, $name, $label)
	{
		$this->set_value_set(new Value_Set(Value_Set::TYPE_MULTIPLE_VALUES));
		parent::__construct($type, $name, $label);
	}

	public static function admin_enqueue_scripts()
	{
		$root_uri = \Carbon_Fields\Carbon_Fields::directory_to_url(CARBON_TAXONOMY_TERM_PICKER_DIR);

		wp_enqueue_script('taxonomy-term-picker', $root_uri . '/assets/js/bundle.js', ['carbon-fields-boot']);
		wp_enqueue_style('taxonomy-term-picker', $root_uri . '/assets/css/field.css');
	}

	/**
	 * Load the field value from an input array based on its name
	 *
	 * @param array $input Array of field names and values.
	 */
	public function set_value_from_input($input)
	{
		if (!isset($input[$this->get_name()])) {
			return $this->set_value([]);
		}

		/**
		 * In carbon fields, select fields have a validator, that make sure that you can't have values that are not
		 * provided in the settings. However, considering that we may also have AJAX provided values, we can't make
		 * this kind of validation.
		 */
		// $options_values = $this->get_options_values();
		// $value = Helper::get_valid_options( $value, $options_values );

		$value = stripslashes_deep($input[$this->get_name()]);

		if (!is_array($value)) {
			$value = [$value];
		}

		$value = array_values( $value );


		return $this->set_value($value);
	}

	protected function parse_options($options, $stringify_value = false)
	{
		$parsed = [];

		if (is_callable($options)) {
			$options = call_user_func($options);
		}

		foreach ($options as $key => $value) {
			if ($key === '__label__') {
				$parsed['label'] = $value;
				continue;
			}

			if ($key === '__multiple__') {
				$parsed['multiple'] = $value;
				continue;
			}

			$option = [
				'value' => $stringify_value ? strval($key) : $key,
				'child' => [],
			];

			if (is_array($value)) {
				$option['label'] = $value['label'] ?? $key;
				if (!empty($value['__child__'])) {
					$option['child'] = is_string($value['__child__']) ? $value['__child__'] : $this->parse_options($value['__child__'], $stringify_value);
				}
			} else {
				$option['label'] = strval($value);
			}

			$parsed['options'][] = $option;
		}

		return $parsed;
	}

	/**
	 * Returns an array that holds the field data, suitable for JSON representation.
	 *
	 * @param bool $load  Should the value be loaded from the database or use the value from the current instance.
	 * @return array
	 */
	public function to_json($load)
	{
		$field_data = parent::to_json($load);

		$options = $this->get_options();
		$options = $this->parse_options($options, true);

		$field_data = array_merge($field_data, [
			'items' => $options,
			'value' => $this->get_formatted_value(),
		]);


		return $field_data;
	}

	public function get_formatted_value()
	{
		$value = $this->get_value();

		return $value;
	}
}
