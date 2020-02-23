<?php

namespace iamntz\carbonfields\chainedSelect;

use Carbon_Fields\Field\Field;
use Carbon_Fields\Field\Predefined_Options_Field;
use Carbon_Fields\Helper\Delimiter;
use Carbon_Fields\Value_Set\Value_Set;

class ChainedSelect_Field extends Predefined_Options_Field
{
	protected $valueDelimiter = '|||';
	protected $nonceName = 'carbon_chained_select';

	protected $selectConfig = [];

	public function __construct($type, $name, $label)
	{
		$this->set_value_set(new Value_Set(Value_Set::TYPE_MULTIPLE_VALUES));
		parent::__construct($type, $name, $label);
	}

	public static function admin_enqueue_scripts()
	{
		$root_uri = \Carbon_Fields\Carbon_Fields::directory_to_url(CARBON_CHAINED_SELECT_DIR);

		$suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min' ;

		wp_enqueue_script('carbon-chained-select', $root_uri . "/assets/dist/bundle{$suffix}.js", ['carbon-fields-core']);
		wp_enqueue_style('carbon-chained-select', $root_uri . "/assets/dist/bundle{$suffix}.css");
	}

	public function set_default_value($default_value)
	{
		throw new \Exception("Not supported (yet...?)", 1);
		return $this;
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
		 * $options_values = $this->get_options_values();
		 * $value = Helper::get_valid_options( $value, $options_values );
		 */

		$values = stripslashes_deep($input[$this->get_name()]);

		$valueSet = [];

		foreach ($values as $key => $value) {
			if (strpos($value, $this->valueDelimiter) !== false) {
				$value = explode($this->valueDelimiter, $value);
			}

			$valueSet[] = json_encode([
				'name' => $key,
				'value' => $value,
			]);
		}

		$valueSet = array_values(array_filter($valueSet));

		return $this->set_value($valueSet);
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

		$this->selectConfig = [
			'placeholder' => __('Select...'),
			'clearAllText' => __('Clear all'),
			'clearValueText' => __('Clear value'),
			'noResultsText' => __('No results found'),
			'searchPromptText' => __('Type to search'),
			'loadingPlaceholder' => __('Loading...'),
		];

		$field_data = array_merge($field_data, [
			'items' => $options,
			'value' => $this->get_value_for_admin(),
			'valueDelimiter' => $this->valueDelimiter,
			'nonce' => wp_create_nonce($this->nonceName),
			'selectConfig' => $this->selectConfig,
		]);


		return $field_data;
	}

	public function set_nonce_name(string $name)
	{
		$this->nonceName = $name;

		return $this;
	}

	public function set_select_config(array $config)
	{
		$this->selectConfig = array_merge($this->selectConfig, $config);

		return $this;
	}

	/**
	 * Sets the value delimiter used to store multiple options in DB. This should **NOT** be changed
	 * in production, otherwise data loss can occur.
	 *
	 * @param      string  $valueDelimiter  The value delimiter
	 *
	 * @return     self
	 */
	public function set_value_delimiter(string $valueDelimiter)
	{
		$this->valueDelimiter = $valueDelimiter;

		return $this;
	}

	protected function get_value_for_admin()
	{
		$storedValues = $this->get_value();

		$value = [];

		foreach ($storedValues as $key => $v) {
			$v = json_decode($v, true);

			if (is_array($v['value'])) {
				$v['value'] = implode($this->valueDelimiter, $v['value']);
			}

			$value[][$v['name']] = $v['value'];
		}

		return $value;
	}

	public function get_formatted_value()
	{
		$storedValues = $this->get_value();
		$value = [];

		foreach ($storedValues as $key => $storedValue) {
			$decoded = json_decode($storedValue, true);
			$value[$decoded['name']] = $decoded['value'];
		}

		return $value;
	}
}
