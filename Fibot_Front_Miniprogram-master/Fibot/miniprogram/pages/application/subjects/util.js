const util = {
  setSubjectPickerText: function(subs) {
    for(var idx in subs) {
      subs[idx]['text'] = `${subs[idx].code} ${subs[idx].name}`
    }
    return subs
  }
}

module.exports = {
  setSubjectPickerText: util.setSubjectPickerText
}