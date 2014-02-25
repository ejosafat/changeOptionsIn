'use strict';

describe("changeOptionsIn", function() {
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
    setMasterAndSlaveOptionData.call(this);
  });

  xdescribe("option data formats", function() {
    xit("should allow object literals", function() {
      
    });
    xit("should allow arrays", function() {
      
    });
  })

  describe("when we select an option in master select", function() {
    beforeEach(function() {
      this.secondMasterOptionValue = this.masterOptionValues[1].value;
      this.expectedSlaveOptionValues = this.slaveOptionValues[this.secondMasterOptionValue];

      createHTMLFixture.call(this);
    });

    it("should replace the options in slave select", function() {
      $('#master').changeOptionsIn({
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(this.secondMasterOptionValue);

      expect($('#slave')).toHaveOptionValues(this.expectedSlaveOptionValues);
    });
  });

  describe("when we select a blank option", function() {
    beforeEach(function() {
      var selectedMasterOptionIndex = 1;
      this.blankText = 'All';
      this.masterOptionValues.unshift({ value: '', text: this.blankText});
      this.blankMasterOptionValue = '';

      createHTMLFixture.call(this, selectedMasterOptionIndex);
    });

    it("should delete the options in slave select if no blank option was specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(this.blankMasterOptionValue);

      expect($('#slave option')).not.toExist();
    });

    it("should add a blank option to slave select if it was specified as an option", function() {
      $('#master').changeOptionsIn({
        blankOption: this.blankText,
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(this.blankMasterOptionValue);

      expect($('#slave')).toHaveOnlyABlankOptionWithText(this.blankText);
    });

    it("should disable slave select if add a blank option wasn't specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(this.blankMasterOptionValue);

      expect($('#slave')).toBeDisabled();
    });
  });

  describe("when we select a master option without associated slave option set", function() {
    beforeEach(function() {
      this.secondMasterOptionValue = this.masterOptionValues[1].value;
      this.blankText = 'All';
      delete this.slaveOptionValues[this.secondMasterOptionValue]
      this.blankMasterOptionValue = '';

      createHTMLFixture.call(this);
    });

    it("should delete the options in slave select if no blank option was specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(this.secondMasterOptionValue);

      expect($('#slave option')).not.toExist();
    });

    it("should add a blank option to slave select if it was specified as an option", function() {
      $('#master').changeOptionsIn({
        blankOption: this.blankText,
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(this.secondMasterOptionValue);

      expect($('#slave')).toHaveOnlyABlankOptionWithText(this.blankText);
    });

    it("should disable slave select if add a blank option wasn't specified", function() {
      $('#master').changeOptionsIn({
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(this.secondMasterOptionValue);

      expect($('#slave')).toBeDisabled();
    });
  });

  xdescribe("when we have more than one dependent slave", function() {
    
  });

  xdescribe("when we have several master and slaves");
  xdescribe("error conditions", function() {
    xit("should throw a bad argument error if slave isn't found in the DOM");
  })

  function changeMasterValueTo(value) {
    $('#master').val(value);
    $('#master').change();
  }

  function currentSlaveOptionValues() {
    this.slaveOptionValues[$('#master').val()];
  }

  // Initial conditions after loading html fixtures:
  // #master select has first option selected
  // #slave has options corresponding to first #master option
  function createHTMLFixture(selectedMasterOptionIndex) {
    selectedMasterOptionIndex = selectedMasterOptionIndex || 0;

    setFixtures('<select id="master"></select><select id="slave"></select>');
    fillSelect($('#master'), this.masterOptionValues);
    $($('#master option')[selectedMasterOptionIndex]).attr('selected', true);
    fillSelect($('#slave'), this.slaveOptionValues[$('#master').val()]);
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

  function setMasterAndSlaveOptionData() {
    this.masterOptionValues = [
      { value: 1,
        text: 'master-1'
      },
      {
        value: 2,
        text: 'master-2'
      }
    ];
    this.slaveOptionValues = {
      1: [
        {
          value: 'master-1-slave-1',
          text: '1st option - 1st master'
        },
        {
          value: 'master-1-slave-2',
          text: '2nd option - 1st master'
        }
      ],
      2: [
        {
          value: 'master-2-slave-1',
          text: '1st option - 2nd master'
        },
        {
          value: 'master-2-slave-2',
          text: '2nd option - 2nd master'
        }
      ]
    };
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