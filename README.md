# Carbon Field: chained-select

Provides a chained select control.

Adds a `chained-select` field type to Carbon Fields. Install using Composer:

```cli
composer require iamntz/carbon-chained-select
```

## `add_option` array structure

Basically this is a multidimensional array with few _magic_ keywords. These keywords are: `__label__`, `__config__`, `__child__` and `__endpoint__`.

Any of these keys *can* be changed by using `carbon_chained_select_config` filter, or, even furter, via `carbon_chained_select_config/name=field-name` filter.

```php

->add_options([
  '__label__' => 'Select 1',

  'value1' => 'Option Text 1',
  'value2' => 'Option Text 2',

  'value3_nested' => [
    '__label__' => 'Select 2 (nested)',

    '__config__' => [
      'multiple' => true,
      'endpoint' => '/rest.php',
    ],

    'select-2-1-1' => 'Option text 1 - 1',
    'select-2-1-2' => 'Option text 1 - 2',

    "nested-1" => [
      '__label__' => 'Another Nested Select',
      'select-2-2-1' => 'Nested Level 2 - 1',
      'select-2-2-2' => 'Nested Level 2 - 2',

      [
        '__label__' => 'Last nested Select',
        'nested3-2-1' => 'Nested level 2 - 1',
        'nested3-2-2' => 'Nested level 2 - 2',
      ],
    ],
  ],
]);
```