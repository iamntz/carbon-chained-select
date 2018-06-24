<?php

namespace iamntz\carbon\taxonomyTermPicker;

use Carbon_Fields\Field\Field;
use Carbon_Fields\Field\Predefined_Options_Field;

class TaxonomyTermPicker_Field extends Predefined_Options_Field
{
	public static function admin_enqueue_scripts()
	{
		$root_uri = \Carbon_Fields\Carbon_Fields::directory_to_url(CARBON_TAXONOMY_TERM_PICKER_DIR);

		wp_enqueue_script('taxonomy-term-picker', $root_uri . '/assets/js/bundle.js', ['carbon-fields-boot']);
		wp_enqueue_style('taxonomy-term-picker', $root_uri . '/assets/css/field.css');
	}

	protected function load_options()
	{
		$options = [];

		foreach ($this->option_collections as $key => $collection) {
			$collection_items = [];

			if (is_callable($collection)) {
				$collection_items = call_user_func($collection);
				if (!is_array($collection_items)) {
					continue;
				}
			} else {
				$collection_items = $collection;
			}

			if ($this->is_indexed_array($options) && $this->is_indexed_array($collection_items)) {
				$options = array_merge($options, $collection_items);
			} else {
				$options = array_replace($options, $collection_items);
			}
		}

		return $options;
	}

	/**
	 * Load the field value from an input array based on its name
	 *
	 * @param array $input Array of field names and values.
	 */
	public function set_value_from_input($input)
	{
		parent::set_value_from_input($input);

		$value = $this->get_value();

		$this->set_value($value);
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

		$postTypes = []; //$this->parse_options($options['post-types'] ?? [], true);
		$taxonomies = []; // $this->parse_options($options['taxonomies'] ?? [], true);
		// $value = $this->get_formatted_value();

		$field_data = array_merge($field_data, [
			'options' => $options,
			'value' => [],
		]);

		return $field_data;
	}
}
