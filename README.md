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
  '__label__' => 'Select 1', // field label

  'value1' => 'Option Text 1',
  'value2' => 'Option Text 2',

  'value3_nested' => [
    '__label__' => 'Select 2 (nested)', // option text AND next field label

    'select-2-1-1' => 'Option text 2 - 1',
    'select-2-1-2' => 'Option text 2 - 2',

    "select-2-1-3" => [
      '__label__' => 'Select 3 (nested, with remote)', // option text and 3rd level field label

      '__config__' => [
        'multiple' => true,
        'endpoint' => '/wp-json/namespace/v2/chained-select',
      ],
    ],
  ],
]);
```
Internally, this will be arranged as needed, so you don't need to worry too much about it.

For ajax calls, the response must follow the same structure, but must be parsed before is sent:

```php
$parser = new \iamntz\carbon\taxonomyTermPicker\OptionsParser([
  'selectOptions' => $options // same structure as above!
], 'fieldName');

$parser->parse();
```

Second argument, `fieldName`, is optional and used only for the config filter (i.e. for changing magic keywords).

Speaking of, ajax calls are always sent as POST requests!

## Limitation
At this moment, you can't have chained & ajax within fields fetched via ajax.

So you chain fields like this:

```
field > field > ajax > field > field
```

But you **cant** chain fields like this:

```
field > field > ajax > field > ajax
```

Also, you can't have multiple select AND ajax on the same field.

----

#### Special Note on validation
Carbon's Select fields (both normal and multiselects) uses a validation that will make sure an user won't be able to select an option that doesn't exists in the provided array in config. However, considering that the source can be also external (i.e. via AJAX), this can't be impelemented in a reasonable extensible way.

Most likely this won't affect anything, but **if** sometime in the future Carbon can be used on the frontend, this _may_ be a gateway of abuses.