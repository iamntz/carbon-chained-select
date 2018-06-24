<?php
use Carbon_Fields\Carbon_Fields;
use iamntz\carbon\taxonomyTermPicker\TaxonomyTermPicker_Field;

define('CARBON_TAXONOMY_TERM_PICKER_DIR', __DIR__);

Carbon_Fields::extend(TaxonomyTermPicker_Field::class, function ($container) {
  $field = new TaxonomyTermPicker_Field($container['arguments']['type'], $container['arguments']['name'], $container['arguments']['label']);
	return $field;
});
