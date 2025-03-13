let money: string;
let price: string;
let unit: string;
let cent: string;
let litera: string = "";
let hundreds: string = "";
let tens: string = "";
let ones: string = "";
let minus: string = "";
let k: number = 0;
let i: number;
let j: number;

const N: string[] = [
  "", "один", "два", "три", "чотири", "п’ять", "шість", "сім", "вісім", "дев’ять",
  "", "одинадцять", "дванадцять", "тринадцять", "чотирнадцять", "п’ятнадцять",
  "шістнадцять", "сімнадцять", "вісімнадцять", "дев’ятнадцять",
  "", "десять", "двадцять", "тридцять", "сорок", "п’ятдесят", "шістдесят", "сімдесят",
  "вісімдесят", "дев’яносто",
  "", "сто", "двісті", "триста", "чотириста", "п’ятсот", "шістсот", "сімсот",
  "вісімсот", "дев’ятсот",
  "тисяч", "тисяча", "тисячі", "тисячі", "тисячі", "тисяч", "тисяч", "тисяч", "тисяч", "тисяч",
  "мільйонів", "мільйон", "мільйона", "мільйона", "мільйона", "мільйонів", "мільйонів", "мільйонів", "мільйонів", "мільйонів",
  "мільярдів", "мільярд", "мільярда", "мільярда", "мільярдів", "мільярдів", "мільярдів", "мільярдів", "мільярдів", "мільярдів"
];

// Ініціалізація масиву M
const M: string[][] = Array.from({ length: 10 }, () => new Array(N.length));
k = 0;
for (i = 0; i < N.length; i++) {
  for (j = 0; j < 10; j++) {
    M[j][i] = N[k++];
  }
}

const U: string[] = [
  "гривень", "гривня", "гривні", "гривні", "гривні", "гривень", "гривень", "гривень", "гривень", "гривень"
];
const C: string[] = [
  "копійок", "копійка", "копійки", "копійки", "копійки", "копійок", "копійок", "копійок", "копійок", "копійок"
];

export function num2str(moneyArg: string): string {
  money = moneyArg;
  unit = "";
  cent = "";

  // Заміна коми на крапку, якщо є
  money = money.replace(",", ".");

  // Перевірка чи передається числове значення
  if (isNaN(Number(money))) {
    throw new Error("Не числове значення");
  }

  // Перевірка чи значення від’ємне
  if (money.charAt(0) === "-") {
    money = money.slice(1);
    minus = "мінус ";
  } else {
    minus = "";
  }

  // Округлення до двох знаків і перетворення в рядок
  money = (Math.round(Number(money) * 100) / 100).toString();

  // Розділення на гривні та копійки
  if (money.indexOf(".") !== -1) {
    unit = money.slice(0, money.indexOf("."));
    cent = money.slice(money.indexOf(".") + 1);
    if (cent.length === 1) cent += "0";
  } else {
    unit = money;
    cent = "00"; // Завжди додаємо копійки
  }

  if (unit.length > 12) {
    throw new Error("Занадто велике число");
  }

  function words(price: string, declension: string[]): string {
    litera = "";
    for (i = 0; i < price.length; i += 3) {
      hundreds = tens = ones = "";
      const twoDigits = n(i + 2, 2);
      if (twoDigits > 10 && twoDigits < 20) {
        ones = ` ${M[n(i + 1, 1)][1]} ${M[0][i / 3 + 3]}`;
        if (i === 0) ones += declension[0];
      } else {
        ones = M[n(i + 1, 1)][0];
        // Заміна "один" і "два" для жіночого роду (гривні або копійки)
        if (ones === "один" && (i === 0 || i === 3 || declension === C)) ones = "одна";
        if (ones === "два" && (i === 0 || i === 3 || declension === C)) ones = "дві";
        if (i === 0 && ones !== "") ones += ` ${declension[n(i + 1, 1)]}`;
        else if (ones !== " ") ones += ` ${M[n(i + 1, 1)][i / 3 + 3]}`;
        if (ones === " ") ones = "";
        else if (ones !== ` ${M[n(i + 1, 1)][i / 3 + 3]}`) ones = ` ${ones}`;
        tens = M[n(i + 2, 1)][2] ? ` ${M[n(i + 2, 1)][2]}` : "";
      }
      hundreds = M[n(i + 3, 1)][3] ? ` ${M[n(i + 3, 1)][3]}` : "";
      if (
        price.slice(price.length - i - 3, price.length - i) === "000" &&
        ones === ` ${M[0][i / 3 + 3]}`
      ) {
        ones = "";
      }
      litera = hundreds + tens + ones + litera;
    }
    if (price === "00" && declension === C) return "нуль копійок";
    if (litera === ` ${U[0]}`) return `нуль${litera}`;
    const trimmedLitera = litera.slice(1);
    if (declension === C && trimmedLitera) {
      const lastDigit = parseInt(price.slice(-1), 10);
      const lastTwoDigits = parseInt(price.slice(-2), 10);
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return `${trimmedLitera} ${C[0]}`;
      if (lastDigit === 1) return `${trimmedLitera} ${C[1]}`;
      if (lastDigit >= 2 && lastDigit <= 4) return `${trimmedLitera} ${C[2]}`;
      return `${trimmedLitera} ${C[0]}`;
    }
    return trimmedLitera;
  }

  function n(start: number, len: number): number {
    if (start > price.length) return 0;
    return Number(price.slice(price.length - start, price.length - start + len));
  }

  const unitsString: string = words((price = unit), U);
  const centsString: string = words((price = cent), C);

  let res: string = `${unitsString} ${centsString}`;
  if (unitsString === `Нуль ${U[0]}`) res = centsString;

  return (minus + res).charAt(0).toUpperCase() + (minus + res).slice(1);
}