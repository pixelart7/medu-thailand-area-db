/**
 * From jquery.Thailand.js
 */
var preprocess = function preprocess(data) {
  var lookup = [];
  var words = [];
  var expanded = [];
  var useLookup = false;
  var t = void 0;

  if (data.lookup && data.words) {
    // compact with dictionary and lookup
    useLookup = true;
    lookup = data.lookup.split('|');
    words = data.words.split('|');
    data = data.data;
  }

  t = function t(text) {
    function repl(m) {
      var ch = m.charCodeAt(0);
      return words[ch < 97 ? ch - 65 : 26 + ch - 97];
    }
    if (!useLookup) {
      return text;
    }
    if (typeof text === 'number') {
      text = lookup[text];
    }
    return text.replace(/[A-Z]/ig, repl);
  };

  if (!data[0].length) {
    // non-compacted database
    return data;
  }
  // decompacted database in hierarchical form of:
  // [["province",[["amphur",[["district",["zip"...]]...]]...]]...]
  data.map(function (provinces) {
    var i = 1;
    if (provinces.length === 3) {
      // geographic database
      i = 2;
    }

    provinces[i].map(function (amphoes) {
      amphoes[i].map(function (districts) {
        districts[i] = districts[i] instanceof Array ? districts[i] : [districts[i]];
        districts[i].map(function (zipcode) {
          var entry = {
            district: t(districts[0]),
            amphoe: t(amphoes[0]),
            province: t(provinces[0]),
            zipcode: zipcode
          };
          if (i === 2) {
            // geographic database
            entry.district_code = districts[1] || false;
            entry.amphoe_code = amphoes[1] || false;
            entry.province_code = provinces[1] || false;
          }
          expanded.push(entry);
        });
      });
    });
  });
  return expanded;
};

var db = preprocess(require('thai-address-database/database/db.json'));

exports.db = db