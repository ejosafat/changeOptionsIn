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
    beforeEach(function() {
      setMasterAndSlaveOptionData.call(this);
      createHTMLFixture.call(this);
    });

    // Initial conditions after loading html fixture:
    // #master select has first option selected
    // #slave has options corresponding to first #master option

    it("should replace the options in slave select", function() {
      var _this = this,
          secondMasterOptionValue = this.masterOptionValues[1].value,
          expectedSlaveOptionValues = this.slaveOptionValues[secondMasterOptionValue];

      $('#master').changeOptionsIn({
        optionData: this.slaveOptionValues,
        slaveSelector: '#slave'
      });

      changeMasterValueTo(secondMasterOptionValue);

      expect($('#slave option')).toExist();
      expect($('#slave option')).toHaveSameSizeAs(expectedSlaveOptionValues);
      expect($('#slave')).toHaveOptionValues(expectedSlaveOptionValues);
    });

    xit("shouldn't add a blank option to slave select if it wasn't specified as an option", function() {
      
    });
    xit("should add a blank option to slave select if it was specified as an option", function() {
      
    });
  });

  xdescribe("when we select a option with no value or not present in slave options", function() {
    xit("should delete the options in slave select", function() {
      
    });
    xit("should add a blank option to slave select if it was specified as an option", function() {
      
    });
    xit("should disable slave select if add a blank option wasn't specified", function() {
      
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

  function createHTMLFixture() {
    setFixtures('<select id="master"></select><select id="slave"></select>');
    fillSelect($('#master'), this.masterOptionValues);
    $('#master option:first').attr('selected', true);
    fillSelect($('#slave'), this.slaveOptionValues[$('#master').val()]);
    $('#slave option:first').attr('selected', true);
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
      }
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
      }
    }
  };

});