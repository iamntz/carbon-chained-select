<?php
use Carbon_Fields\Carbon_Fields;
use iamntz\carbon\chainedSelect\ChainedSelect_Field;

define('CARBON_CHAINED_SELECT_DIR', __DIR__);

Carbon_Fields::extend(ChainedSelect_Field::class, function ($container) {
  $field = new ChainedSelect_Field($container['arguments']['type'], $container['arguments']['name'], $container['arguments']['label']);
	return $field;
});
