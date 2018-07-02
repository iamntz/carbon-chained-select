<?php

namespace iamntz\carbon\chainedSelect;

class OptionsParser
{
	protected $config = [
		'labelKey' => '__label__',
		'configKey' => '__config__',
	];

	public function __construct($options, $fieldName = null)
	{
		$this->options = array_merge([
			'selectOptions' => [],
			'stringifyValue' => false,
		], $options);

		$this->config = apply_filters('carbon_chained_select_config', $this->config);

		if (!is_null($fieldName)) {
			$this->config = apply_filters("carbon_chained_select_config/name={$fieldName}", $this->config);
		}
	}

	/**
	 * The idea is to have an array following this structure:
	 *
	 * [
	 * 		'config' => [
	 * 			'label' => '',
	 * 			'option_label' => '',
	 * 			'name' => ''
	 * 			'multiple' => true/false
	 * 		],
	 *
	 * 		'options' => [
	 * 			[
	 * 				'value' => ''
	 * 				'label' => '',
	 * 				'child' => [] <<< an array similar to the parent array
	 * 			]
	 * 		]
	 * ]
	 */

	public function parse()
	{
		if (is_callable($this->options['selectOptions'])) {
			$this->options['selectOptions'] = call_user_func($this->options['selectOptions']);
		}

		$parsed = [];

		$parsed['config'] = [
			'multiple' => false,
			'endpoint' => '',
		];

		$config = $this->getConfig($this->options['selectOptions']);

		$parsed['config'] = array_merge(($parsed['config']), $config);
		$parsed['config']['label'] = $parsed['config']['label'] ?? $this->getLabel($this->options['selectOptions']);
		$parsed['config']['option_label'] = $parsed['config']['option_label'] ?? $parsed['config']['label'];

		foreach ($this->options['selectOptions'] as $key => $value) {
			if (in_array($key, [$this->config['labelKey'], $this->config['configKey']])) {
				continue;
			}

			$option = [
				'child' => [],
				'value' => $this->options['stringifyValue'] ? strval($key) : $key,
			];

			if (is_array($value)) {
				$optionConfig = $this->getConfig($value);
				$option['label'] = $optionConfig['option_label'] ?? $optionConfig['label'] ?? $value[$this->config['labelKey']] ?? $key;

				$child = new self([
					'selectOptions' => $value[0] ?? $value,
					'stringifyValue' => $this->options['stringifyValue'],
				]);

				$option['child'] = $child->parse();
			} else {
				$option['label'] = strval($value) ?? $key;
				$parsed['config']['name'] = $parsed['config']['name'] ?? $option['value'];
			}


			$parsed['options'][] = $option;
		}

		return $parsed;
	}

	protected function getConfig($el)
	{
		return $el[$this->config['configKey']] ?? [];
	}

	protected function getLabel($el, $default = null)
	{
		return $el[$this->config['labelKey']] ?? $default;
	}
}
