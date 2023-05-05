const recordsProcess = function() {
  dottedProcess('.record__delimiter')
};

const dottedProcess = function(stringTag) {
  const tag = stringTag || '.dotted p';
  const dottedStrings = document.querySelectorAll(tag);
  dottedStrings.forEach(str => {
    str.setAttribute('data-content', '.'.repeat(200));
  });
};

