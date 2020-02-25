# Carbon Field: chainedselect

Provides a chained select control.

![](https://img.iamntz.com/carbon-chained-select-demo.gif)

Adds a `chainedselect` field type to Carbon Fields. Install using Composer:

```cli
composer require "iamntz/carbon-chained-select:^3.0"
```

For Carbon Fields 2 (legacy):

```cli
composer require "iamntz/carbon-chained-select:^2.0"
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

Alternatively, you can move all config-related within `__config__` array:
```php
->add_options([
  '__config__' => [
    'label' => 'Select 1', // field label
  ]

  'value1' => 'Option Text 1',
  'value2' => 'Option Text 2',

  'value3_nested' => [
    '__label__' => 'Select 2 (nested)', // option text AND next field label

    'select-2-1-1' => 'Option text 2 - 1',
    'select-2-1-2' => 'Option text 2 - 2',

    "select-2-1-3" => [
      '__config__' => [
        /**
         * By default, each nested item will be in an array that will look pretty much like this:
         * [
         *    'value3_nested' => value3_nested',
         *    'select-2-1-3' => select-2-1-3'
         * ]
         *
         * You can specify a name for each level, so you could have a multi-dimensional array, something like this:
         * [
         *  'value3_nested' => 'value3_nested',
         *  'last-level-name' => 'select-2-1-3'
         * ]
         *
         * If no `name` config key is provided, then the value name will be used. For consistency sake,
         * try to use one way or another, don't mix them. Also, please note that by NOT specifying a name,
         * you're stuck with the initial order. I.e. won't be able to reorder items without breaking existing data!
         *
         * So TL;DR: use a damn name!
         */
        'name' => 'last-level-name',

        // if you have a `label` key here, then the `__label__` key on an upper level will be ignored.
        'label' => 'Select 3 (nested, with remote)',

        // optional, is the label that will appear above `select` field. If not specified,
        // then the label above will be used as both option AND label
        'option_label' => '',

        // wether if the field can have multiple values or only one.
        // Please note that if a field is multiple, you can't have any further nested selects
        // you can try though, but the results are not predictible :)
        'multiple' => true,

        // REST endpoint to fetch new options. This should accept GET requests!
        // Params sent on the request:
        // {
        //    nonce: nonce, // checking for carbon_chained_select key
        //    value: value, // current select value
        //    fieldValue: field.value, // whole field value (as an array)
        //    name: name, // the field name
        //    query: query // if user searched something, it will be sent as this key
        // }
        //
        // The response should follow the same structure as this initial array,
        // parsed (read below) then sent as json
        'endpoint' => '/wp-json/namespace/v2/chained-select',
      ],
    ],
  ],
]);
```

Internally, this will be arranged as needed, so you don't need to worry too much about it.

For ajax calls, the response must follow the same structure, but must be parsed before is sent:

```php
$parser = new \iamntz\carbon\chainedSelect\OptionsParser([
  'selectOptions' => $options // same structure as above!
], 'fieldName');

$parser->parse();
```

Second argument, `fieldName`, is optional and used only for the config filter (i.e. for changing magic keywords).

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

## Return values
Value returned is an associative array that follows the field names.

----

## Known issues:

- [ ] You can't have another nested field after an ajax select. This _might_ work but I didn't tested.
- [ ] You can't have another nested field after a select with multiple options. This one has a very very **VERY** low priority (mostly because the way I see it, is a UX nightmare) on my list.
- [ ] Conditional logic is broken on this field. This is caused by the way I store data in the DB (as a json string). Although I would like to make this work, I have to find some time to dig into Carbon Field conditional and understand its logic.
- [ ] Didn't tested, but setting a field as required should have the very same issue as the conditional logic above.

If you have any fixes, please send a PR!

#### Special Note on validation
Carbon's Select fields (both normal and multiselect) uses a validation that will make sure an user won't be able to select an option that doesn't exists in the provided array in config. However, considering that the source can be also external (i.e. via AJAX), this can't be implemented in a reasonable extensible way.

Most likely this won't affect anything, but **if** sometime in the future Carbon can be used on the frontend, this _may_ be a gateway of abuses.


### Support me
You can get [hosting](https://m.do.co/c/c95a44d0e992), [donate](https://www.paypal.me/iamntz) or be my [patreon](https://www.patreon.com/iamntz).


### License
The code is released under MIT license.
