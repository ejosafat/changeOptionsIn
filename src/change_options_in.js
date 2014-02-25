/**
 * @overview changeOptionsIn jQuery plugin definition
 * @copyright 2014 Edy Josafat Hernández Vega
 * @version 0.2
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
  var _this, $slave, blankOption, slaveOptions;

  $.fn.changeOptionsIn = function(options) {

    $slave = $(options.slaveSelector);
    slaveOptions = options.optionData;
    _this = this;
    this.on('change', changeOptionsIn);
    blankOption = options.blankOption;
    return this;
  };

  function changeOptionsIn() {
    var options = slaveOptions[_this.val()] || [];

    setNewSelectOptions(options);

    if (options.length === 0) {
      setEmptySelect();
    }
  }

  function makeOption(optionData) {
    return $('<option>', {
      text: optionData.text,
      value: optionData.value
    });
  }

  function setEmptySelect() {
    if (typeof blankOption != 'undefined') {
      $slave.append(makeOption({ value: '', text: blankOption }));
    } else {
      $slave.attr('disabled', true);
    }
  }

  function setNewSelectOptions(options) {
    $slave.empty();
    $.each(options, function(index, option) {
      $slave.append(makeOption(option));
    });
  }

})(jQuery);


