<?php

namespace iamntz\carbon\taxonomyTermPicker;

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
			'defaultLabel' => null,
		], $options);

		$this->config = apply_filters('carbon_chained_select_config', $this->config);

    if (!is_null($fieldName)) {
			$this->config = apply_filters("carbon_chained_select_config/name={$fieldName}", $this->config);
		}
	}

	public function parse()
	{
		$parsed = [];

		if (is_callable($this->options['selectOptions'])) {
			$this->options['selectOptions'] = call_user_func($this->options['selectOptions']);
		}

		foreach ($this->options['selectOptions'] as $key => $value) {
			if ($key === $this->config['labelKey']) {
				$parsed['label'] = $value;
				continue;
			}

			if ($key === ($this->config['configKey'] ?? false)) {
				$parsed['config'] = $value;
				continue;
			}

			$option = [
				'value' => $this->options['stringifyValue'] ? strval($key) : $key,
				'label' => $this->options['defaultLabel'] ?? $key ?? '',
				'child' => [],
			];

			if (is_array($value)) {
				$option['label'] = $value[$this->config['labelKey']] ?? $this->options['defaultLabel'] ?? $key;

				$child = new self([
					'selectOptions' => $value[0] ?? $value,
					'stringifyValue' => $this->options['stringifyValue'],
					'defaultLabel' => $option['label'],
				]);

				$option['child'] = $child->parse();

			} else {
				$option['label'] = strval($value) ?? $key ?? $this->options['defaultLabel'];
			}

			$parsed['options'][] = $option;
		}

		return $parsed;
	}
}
