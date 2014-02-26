/**
 * @overview changeOptionsIn jQuery plugin definition
 * @copyright 2014 Edy Josafat Hernández Vega
 * @version 0.6
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
    var data = SlaveData.singleton(this);

    data.setOptions(options);
    this.change($.proxy(changeOptionsIn, this));

    return this;
  };

  function changeOptionsIn() {
    var options,
        _this = this,
        data = this.data(DATA_KEY);

    data.eachSlave(function(slaveId, slaveData) {
      options = data.getOptions(slaveId, _this.val());

      setNewSelectOptions(slaveData.slave, options);

      if (options.length === 0) {
        setEmptySelect(slaveData.slave, slaveData.blankOption);
      }
    });
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

  function SlaveData(element) {
    this._element = element;
    this._slaves = {};
  }

  SlaveData.prototype = {
    constructor: SlaveData,

    eachSlave: function(callback) {
      for (var key in this._slaves) {
        callback(key, this._slaves[key]);
      }
    },

    getOptions: function(slaveId, masterValue) {
      return this._slaves[slaveId].slaveOptions.getOptions(masterValue);
    },

    setOptions: function(options) {
      if ($(options.slaveSelector).length === 0) throw new Error('Slave not found');

      this._slaves[options.slaveSelector] = {
        blankOption: options.blankOption,
        slave: $(options.slaveSelector),
        slaveOptions: new SlaveOptions(options.optionData)
      };
      this._element.data(DATA_KEY, this);
    }    
  };

  SlaveData.singleton = function(element) {
    return element.data(DATA_KEY) || new SlaveData(element);
  };

  function SlaveOptions(optionSet) {
    var option, options;

    this._options = {};

    for (var key in optionSet) {
      this._options[key] = [];
      options = optionSet[key];
      for (var i in options) {
        option = options[i];
        if (option instanceof Array) {
          this._options[key].push({
            text: option[0],
            value: option[1]
          });
        } else {
          this._options[key].push(option);
        }
      }
    }
  }

  SlaveOptions.prototype.getOptions = function(masterValue) {
    return this._options[masterValue] || [];
  }

})(jQuery);


