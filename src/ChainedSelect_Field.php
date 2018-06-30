<?php

namespace iamntz\carbon\chainedSelect;

use Carbon_Fields\Field\Field;
use Carbon_Fields\Field\Predefined_Options_Field;
use Carbon_Fields\Helper\Delimiter;
use Carbon_Fields\Value_Set\Value_Set;

class ChainedSelect_Field extends Predefined_Options_Field
{
	protected $valueDelimiter = '|||';

	public function __construct($type, $name, $label)
	{
		$this->set_value_set(new Value_Set(Value_Set::TYPE_MULTIPLE_VALUES));
		parent::__construct($type, $name, $label);
	}

	public static function admin_enqueue_scripts()
	{
		$root_uri = \Carbon_Fields\Carbon_Fields::directory_to_url(CARBON_CHAINED_SELECT_DIR);

		wp_enqueue_script('carbon-chained-select', $root_uri . '/assets/js/bundle.js', ['carbon-fields-boot']);
		wp_enqueue_style('carbon-chained-select', $root_uri . '/assets/css/field.css');
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

		$value = array_values(array_filter($value));

		return $this->set_value($value);
	}

	protected function xparse_options($config)
	{
		$parser = new OptionsParser($config, $this->get_base_name());
		return $parser->parse();
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
		$options = $this->xparse_options(['selectOptions' => $options], true);

		$field_data = array_merge($field_data, [
			'items' => $options,
			'value' => $this->get_value(),
			'valueDelimiter' => $this->valueDelimiter,
		]);

		return $field_data;
	}

	public function get_formatted_value()
	{
		$value = $this->get_value();

		$value = array_map(function ($v) {
			if (strpos($v, $this->valueDelimiter) === false) {
				return $v;
			}

			return Delimiter::split($v, $this->valueDelimiter);;
		}, $value);

		return $value;
	}
}
