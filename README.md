# Carbon Field: chained-select

Provides a chained select control.

Adds a `chained-select` field type to Carbon Fields. Install using Composer:

```cli
composer require iamntz/carbon-chained-select
```

## `add_option` array structure

Basically this is a multidimensional array with few _magic_ keywords. These keywords are: `__label__`, `__config__`.

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
Internally, this will be arranged as needed, so you don't need to worry too much about it.

For ajax calls, the response must follow the same structure, but must be parsed before is sent:

```
$parser = new iamntz\carbon\taxonomyTermPicker\OptionsParser([
  'selectOptions' => $options // same structure as above!
], 'fieldName');
```

Second argument, `fieldName`, is optional and used only for the config filter (i.e. for changing magic keywords).

#### Special Note on validation
Carbon's Select fields (both normal and multiselects) uses a validation that will make sure an user won't be able to select an option that doesn't exists in the provided array in config. However, considering that the source can be also external (i.e. via AJAX), this can't be impelemented in a reasonable extensible way.

Most likely this won't affect anything, but **if** sometime in the future Carbon can be used on the frontend, this _may_ be a gateway of abuses.