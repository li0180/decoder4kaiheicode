const inputBox = document.getElementById('input-box');
const updateButton = document.getElementById('update-button');
const outputField = document.getElementById('output-field');

updateButton.addEventListener('click', () => {
  const kaiheicode = inputBox.value;

  if (kaiheicode.length === 0) {

    outputField.textContent = `代码呢？！`;

  } else {

    const parseResult = parseCode(kaiheicode);

    if (parseResult == null) {

      outputField.textContent = `恕小的才疏学浅看不懂！！建议找毛线或者达克咨询代码的正确格式、、`;

    } else {

      if(parseResult[0][0] === "-"){

        const minute = parseResult[0].substring(1);
        const stack = parseStack(parseResult[1]);

        outputField.textContent = `恭喜你找到了彩蛋！！这个是J言J语，翻译一下就是如果有${stack}黑的话，那开打前${minute}分钟叫，如果冲完凉了的话、、、`;
      }

      const start = parseTime(parseResult[0]);
      const end = parseTime(parseResult[1]);
      const stack = parseStack(parseResult[2]);

      outputField.textContent = `这个的意识是：${start[0]}点${start[1]}分开始等，，有${stack}黑就打，但等到${end[0]}点${end[1]}分还没加完班/冲完凉/拉完屎就拜拜啦您嘞、、`;
    }
  }


});

function parseCode(kaiheicode) {

  let start, end, stack;

  const regexForHHMM = /([0-9]|0[0-9]|1[0-9]|2[0-4])[0-5][0-9]/;
  const regexForHHMMExactMatch = /^([0-9]|0[0-9]|1[0-9]|2[0-4])[0-5][0-9]$/;
  const regexFor1Combination = /(2|3|4|5)/g;
  const regexFor2Combination = /(23|24|25|34|35|45)/g;
  const regexFor3Combination = /(234|235|245|345)/g;
  const regexFor4Combination = /(2345)/g;
  const regexFor5Combination = /(12345)/g;
  const regexForJ = /(2345|345)/;

  if (kaiheicode[0] === "-" && kaiheicode.match(regexForJ)) {

      stack = kaiheicode.match(regexForJ)[0];
      stackIndex = kaiheicode.search(regexForJ);
      kaiheicode = splice(kaiheicode, stackIndex, stack.length);

      return [kaiheicode, stack];
  }

  if (kaiheicode[0] === "1" || kaiheicode[0] === "2") {

    start = kaiheicode.slice(0, 4);
    kaiheicode = kaiheicode.slice(4);

  } else {

    if (kaiheicode.match(regexForHHMM)) {

      start = kaiheicode.match(regexForHHMM)[0];
      startIndex = kaiheicode.search(regexForHHMM);
      kaiheicode = splice(kaiheicode, startIndex, start.length);

    } else {

      return null;
    }
  }


  const possibleStackArray = [...kaiheicode.matchAll(regexFor1Combination)]
    .concat([...kaiheicode.matchAll(regexFor2Combination)])
    .concat([...kaiheicode.matchAll(regexFor3Combination)])
    .concat([...kaiheicode.matchAll(regexFor4Combination)])
    .concat([...kaiheicode.matchAll(regexFor5Combination)]);

  for (s of possibleStackArray) {

    remainingKaiheiCode = splice(kaiheicode, kaiheicode.indexOf(s[0]), s[0].length);
    if (regexForHHMMExactMatch.test(remainingKaiheiCode)) {

      end = remainingKaiheiCode;
      stack = s[0];

    } else {

      continue;
    }
  }

  if (end == null || stack == null) {

    return null;
  }

  return [start, end, stack];
}

function parseTime(time) {

  if (time.length === 3) {

    return [time[0], time[1] + time[2]];

  } else {

    return [time[0] + time[1], time[2] + time[3]];
  }
}

function parseStack(stack) {

  return stack.split("").join("/");
}

function splice(str, index, count) {

  return str.slice(0, index) + str.slice(index + count);
}