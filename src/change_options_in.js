/**
 * @overview changeOptionsIn jQuery plugin definition
 * @copyright 2014 Edy Josafat Hernández Vega
 * @version 0.3
 * @author  Eddy Josafat <eddy@ejosafat.com>
 * @license MIT license (see included file)
 * @requires jQuery 2.x
 *
 * @example
 * $('#mySelect').changeOptionsIn({
 *   slaveSelector: '#anotherSelect',
 *   optionData: {
 *     myMasterValue1: [{text: 'option text 1', value: 'optionValue1'}, {text: 'option text 2', value: 'optionValue2'}],
 *     myMasterValue2: [{text: 'option text 3', value: 'optionValue3'}, {text: 'option text 4', value: 'optionValue4'}],
 *   })
 */

'use strict';

(function($) {
  var DATA_KEY = 'changeOptionsIn';

  $.fn.changeOptionsIn = function(options) {
    this.data(DATA_KEY, {
      blankOption: options.blankOption,
      slave: $(options.slaveSelector),
      slaveOptions: options.optionData
    });
    this.change($.proxy(changeOptionsIn, this));

    return this;
  };

  function changeOptionsIn() {
    var blankOption = this.data(DATA_KEY).blankOption,
        options = this.data(DATA_KEY).slaveOptions[this.val()] || [],
        $slave = this.data(DATA_KEY).slave;

    setNewSelectOptions($slave, options);

    if (options.length === 0) {
      setEmptySelect($slave, blankOption);
    }
  }

  function makeOption(optionData) {
    return $('<option>', {
      text: optionData.text,
      value: optionData.value
    });
  }

  function setEmptySelect($slave, blankOption) {
    if (typeof blankOption != 'undefined') {
      $slave.append(makeOption({ value: '', text: blankOption }));
    } else {
      $slave.attr('disabled', true);
    }
  }

  function setNewSelectOptions($slave, options) {
    $slave.empty();
    $.each(options, function(index, option) {
      $slave.append(makeOption(option));
    });
  }

})(jQuery);


