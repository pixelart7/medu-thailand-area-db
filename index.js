const rawDB = require('./getDB.js').db

let increment = 2
const db = {
  1: {
    name: 'ส่วนกลาง',
    info: {
      district: 'N/A',
      amphoe: 'N/A',
      province: 'N/A',
      zipcode: 'N/A'
    },
    parent: -1,
    children: [],
  }
}

// first pass // province
const provinceIndex = {}
rawDB.forEach((elm) => {
  if (! (elm.province in provinceIndex)) {
    thisKey = increment++
    db[thisKey] = {
      name: elm.province,
      info: {
        district: 'N/A',
        amphoe: 'N/A',
        province: 'N/A',
        zipcode: 'N/A'
      },
      parent: 1,
      children: [],
    }
    provinceIndex[elm.province] = thisKey
    db[1].children.push(thisKey)
  }
})

// second pass // amphoe
const amphoeIndex = {}
rawDB.forEach((elm) => {
  if (!(elm.amphoe in amphoeIndex)) {
    thisKey = increment++
    db[thisKey] = {
      name: elm.amphoe,
      info: {
        district: 'N/A',
        amphoe: 'N/A',
        province: 'N/A',
        zipcode: 'N/A'
      },
      parent: provinceIndex[elm.province],
      children: [],
    }
    amphoeIndex[elm.amphoe] = thisKey
    db[db[thisKey].parent].children.push(thisKey)
  }
})

// last pass // district
const districtIndex = {}
rawDB.forEach((elm) => {
  if (!(elm.district in districtIndex)) {
    thisKey = increment++
    db[thisKey] = {
      name: elm.district,
      info: elm,
      parent: amphoeIndex[elm.amphoe],
      children: [],
    }
    districtIndex[elm.district] = thisKey
    db[db[thisKey].parent].children.push(thisKey)
  }
})

exports.db = db