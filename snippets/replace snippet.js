var invalidChar = '.*';
invalidChar.replace(/[ .*\\\/*\$-]/g, '');

var validChar = invalidChar.replace(/[ .*\\\/*\$-]/g, '');