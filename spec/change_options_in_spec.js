'use strict';

describe("changeOptionsIn", function() {
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  xdescribe("option data formats", function() {
    xit("should allow object literals", function() {
      
    });
    xit("should allow arrays", function() {
      
    });
  })

  describe("when we select an option in master select", function() {
    it("should replace the options in slave select", function() {
      var data, expectedSlaveOptions, newSelectValueToChoose;

      data = testData([['master', 'slave']]);
      createHTMLFixture({
        data: data,
        selectedMasterOption: 0
      });

      newSelectValueToChoose = data['master'].masterOptions[1].value;
      expectedSlaveOptions = data['master'].slaveOptions[newSelectValueToChoose];

      $('#master').changeOptionsIn({
        optionData: data['master'].slaveOptions,
        slaveSelector: '#slave'
      });

      changeMasterValueTo('master', newSelectValueToChoose);

      expect($('#slave')).toHaveOptionValues(expectedSlaveOptions);
    });
  });

  describe("when we select a blank option", function() {
    beforeEach(function() {
      this.blankText = 'All';
      this.blankValue = '';

      this.data = testData([['master', 'slave']]);
      this.data['master'].masterOptions.unshift({ value: this.blankValue, text: this.blankText});
      createHTMLFixture({
        data: this.data,
        selectedMasterOption: 1
      });
    });

    it("should delete the options in slave select if no blank option was specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.data['master'].slaveOptions,
        slaveSelector: '#slave'
      });

      changeMasterValueTo('master', this.blankValue);

      expect($('#slave option')).not.toExist();
    });

    it("should add a blank option to slave select if it was specified as an option", function() {
      $('#master').changeOptionsIn({
        blankOption: this.blankText,
        optionData: this.data['master'].slaveOptions,
        slaveSelector: '#slave'
      });

      changeMasterValueTo('master', this.blankValue);

      expect($('#slave')).toHaveOnlyABlankOptionWithText(this.blankText);
    });

    it("should disable slave select if add a blank option wasn't specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.data['master'].slaveOptions,
        slaveSelector: '#slave'
      });

      changeMasterValueTo('master', this.blankValue);

      expect($('#slave')).toBeDisabled();
    });
  });

  describe("when we select a master option without associated slave option set", function() {
    beforeEach(function() {
      this.blankText = 'All';
      this.blankValue = '';
      this.data = testData([['master', 'slave']]);
      createHTMLFixture({
        data: this.data,
        selectedMasterOption: 0
      });
      this.newSelectValueToChoose = this.data['master'].masterOptions[1].value;
      delete this.data['master'].slaveOptions[this.newSelectValueToChoose];
    });

    it("should delete the options in slave select if no blank option was specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.data['master'].slaveOptions,
        slaveSelector: '#slave'
      });

      changeMasterValueTo('master', this.newSelectValueToChoose);

      expect($('#slave option')).not.toExist();
    });

    it("should add a blank option to slave select if it was specified as an option", function() {
      $('#master').changeOptionsIn({
        blankOption: this.blankText,
        optionData: this.data['master'].slaveOptions,
        slaveSelector: '#slave'
      });

      changeMasterValueTo('master', this.newSelectValueToChoose);

      expect($('#slave')).toHaveOnlyABlankOptionWithText(this.blankText);
    });

    it("should disable slave select if add a blank option wasn't specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.data['master'].slaveOptions,
        slaveSelector: '#slave'
      });

      changeMasterValueTo('master', this.newSelectValueToChoose);

      expect($('#slave')).toBeDisabled();
    });
  });

  xdescribe("when we have more than one dependent slave", function() {
    
  });

  describe("when we have several master and slaves", function() {
    beforeEach(function() {
      this.data = testData([['masterA', 'slaveA'], ['masterB', 'slaveB']]);
      createHTMLFixture({
        data: this.data,
        selectedMasterOption: 0
      });
    });

    it("selecting option in first master change options in its slave only", function() {
      var firstMasterBOptionValue = this.data['masterB'].masterOptions[0].value,
          newMasterAOptionValue = this.data['masterA'].masterOptions[1].value,
          expectedSlaveAOptions = this.data['masterA'].slaveOptions[newMasterAOptionValue],
          expectedSlaveBOptions = this.data['masterB'].slaveOptions[firstMasterBOptionValue]

      $('#masterA').changeOptionsIn({
        optionData: this.data['masterA'].slaveOptions,
        slaveSelector: '#slaveA'
      });

      $('#masterB').changeOptionsIn({
        optionData: this.data['masterB'].slaveOptions,
        slaveSelector: '#slaveB'
      });

      changeMasterValueTo('masterA', newMasterAOptionValue);

      expect($('#slaveA')).toHaveOptionValues(expectedSlaveAOptions);
      expect($('#slaveB')).toHaveOptionValues(expectedSlaveBOptions);

    });
    it("selecting option in second master change options in its slave only", function() {
      var firstMasterAOptionValue = this.data['masterA'].masterOptions[0].value,
          newMasterBOptionValue = this.data['masterB'].masterOptions[1].value,
          expectedSlaveBOptions = this.data['masterB'].slaveOptions[newMasterBOptionValue],
          expectedSlaveAOptions = this.data['masterA'].slaveOptions[firstMasterAOptionValue]

      $('#masterA').changeOptionsIn({
        optionData: this.data['masterA'].slaveOptions,
        slaveSelector: '#slaveA'
      });

      $('#masterB').changeOptionsIn({
        optionData: this.data['masterB'].slaveOptions,
        slaveSelector: '#slaveB'
      });

      changeMasterValueTo('masterB', newMasterBOptionValue);

      expect($('#slaveA')).toHaveOptionValues(expectedSlaveAOptions);
      expect($('#slaveB')).toHaveOptionValues(expectedSlaveBOptions);
    });
  });

  xdescribe("error conditions", function() {
    xit("should throw a bad argument error if slave isn't found in the DOM");
  })

  function changeMasterValueTo(masterId, value) {
    var $master = $('#' + masterId);
    $master.val(value);
    $master.change();
  }

  function currentSlaveOptionValues() {
    this.slaveOptionValues[$('#master').val()];
  }

  function createHTMLFixture(options) {
    var data = (options && options.data) || {},
        selectedMasterOptionIndex = (options && options.selectedMasterOption) || 0;

    setFixtures('<div id="select-container"></div>');

    for(var masterId in data) {
      $('#select-container').append($('<select id="' + masterId + '"></select><select id="' + data[masterId].slaveId + '"></select>'));
      fillSelect($('#' + masterId), data[masterId].masterOptions);
      $($('#' + masterId + ' option')[selectedMasterOptionIndex]).attr('selected', true);
      fillSelect($('#' + data[masterId].slaveId), data[masterId].slaveOptions[$('#' + masterId).val()]);
    }
  }

  function fillSelect($select, options) {
    for(var i in options) {
      $select.append(makeOption(options[i])); 
    }
  }

  function makeOption(optionData) {
    return $('<option>', {
      text: optionData.text,
      value: optionData.value
    });
  }

  function testData(selects) {
    var masterId, masterOptions, slaveId, slaveOptions,
        data = {};
    
    for (var i in selects) {
      masterId = selects[i][0];
      slaveId = selects[i][1];
      masterOptions = masterOptionSet({
        masterId: masterId,
        numOptions: 2
      });
      slaveOptions = slaveOptionSet({
        masterSet: masterOptions,
        numOptions: 2,
        slaveId: slaveId
      });

      data[masterId] = {
        masterOptions: masterOptions,
        slaveId: slaveId,
        slaveOptions: slaveOptions
      }
    }

    return data;
  }

  function masterOptionSet(options) {
    var masterId = (options && options.masterId) || 'master',
        numOptions = (options && numOptions) || 2;

    return optionSet({
      numOptions: numOptions,
      textPrefix: masterId + '-'
    });
  }

  function optionSet(options) {
    var numOptions = (options && options.numOptions) || 2,
        optionSet = [],
        textPrefix = options.textPrefix || 'text-',
        valuePrefix = options.valuePrefix || '';

    for (var i = 0; i < numOptions; i++) {
      optionSet.push({
        value: valuePrefix + i,
        text: textPrefix + i
      });
    }

    return optionSet;
  }

  function slaveOptionSet(options) {
    var masterSet = (options && options.masterSet) || masterOptionSet(),
        numOptions = (options && options.numOptions) || 2,
        set = {},
        slaveId = (options && options.slaveId) || 'slave';

    for (var i in masterSet) {
      set[masterSet[i].value] = optionSet({
          numOptions: numOptions,
          textPrefix: masterSet[i].text + '-' + slaveId + '-',
          valuePrefix: masterSet[i].text + '-' + slaveId + '-'
      });
    }

    return set;
  }

  var customMatchers = {
    toHaveOnlyABlankOptionWithText: function(utils, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var $option = $(actual).children('option'),
              content = $(actual).html(),
              result = {};

          result.pass = true;

          if ($option.length !== 1) result.pass = false;
          if ($option.text() !== expected) result.pass = false;
          if ($option.attr('value') !== '') result.pass = false;

          if (!result.pass) {
            content = content === '' ? 'nothing' : content;
            result.message = 'A blank option was expected, but it contains ' + content;
          }
          return result;
        }
      };
    },

    toHaveSameSizeAs: function(utils, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var result = {};

          result.pass = (actual.length === expected.length);
          if (!result.pass) {
            result.message = 'Collection was expected to have ' + expected.length +
                ' element(s), but it has ' + actual.length;
          }

          return result;
        }
      };
    },

    toHaveOptionValues: function(utils, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          // debugger
          var result = {};

          $(actual).children('option').each(function(index) {
            result.pass = ($(this).attr('value') === expected[index].value);
            if (!result.pass) {
              result.message = 'Option value: ' + $(this).attr('value') +
                  ' differs from expected: ' + expected[index].value;
              return false;
            }
          })
          return result;
        }
      };
    }
  };

});