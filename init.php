<?php

use Carbon_Fields\Carbon_Fields;
use iamntz\carbonfields\chainedSelect\ChainedSelect_Field;

define('CARBON_CHAINED_SELECT_DIR', __DIR__);


Carbon_Fields::extend(ChainedSelect_Field::class, function ($container) {
	return new ChainedSelect_Field(
		$container['arguments']['type'],
		$container['arguments']['name'],
		$container['arguments']['label']
	);
});


/*
 * Backwards compatibility
 */
class_alias('iamntz\carbonfields\chainedSelect\ChainedSelect_Field', 'iamntz\carbon\chainedSelect\ChainedSelect_Field');
class_alias('iamntz\carbonfields\chainedSelect\OptionsParser', 'iamntz\carbon\chainedSelect\OptionsParser');
