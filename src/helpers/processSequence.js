/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import * as R from "ramda";

const api = new Api();

// Набор микрофункций
const validate = R.test(/^[0-9.]{2,10}$/);
const powIt2 = (value) => Math.pow(value, 2);
const division3 = (value) => value % 3;
const roundIt = (value) => Math.round(value);
const toNum = (value) => Number(value);
const checkIsNotNaN = (value) => !isNaN(value);

// Запрос за животноым по id
const getAnimalNameById = (handleSuccess, writeLog) => (id) => {
  api
    .get(`https://animals.tech/${id}`, {})
    .then(({ result }) => handleSuccess(result))
    .catch((error) => writeLog(error));
};

// Выполняем основные операции с числами
const doOperationsWithNum = (handleSuccess, handleError, writeLog) => (
  value
) => {
  api
    .get("https://api.tech/numbers/base", {
      from: 10,
      to: 2,
      number: value,
    })
    .then(({ result }) => {
      R.compose(
        // Делаем запрос за именем животного
        getAnimalNameById(handleSuccess, writeLog),
        // Логируем остаток от деления на 3
        R.tap(writeLog),
        // Берем остаток от деления на 3
        division3,
        // Логируем квадрат числа
        R.tap(writeLog),
        // Возводим в квадрат
        powIt2,
        // Логируем его длину
        R.tap(writeLog),
        // Берем его длинну
        R.length,
        // Логируем число в двоичной системе
        R.tap(writeLog)
      )(result);
    })
    .catch((error) => handleError(error));
};

// Если значение валидное и не NaN - выполняем этот код
const startIfValueValidAndIsNotNaN = (handleSuccess, handleError, writeLog) => (
  value
) =>
  R.compose(
    // Выполняем основные операции с числами
    doOperationsWithNum(handleSuccess, handleError, writeLog),
    // Логируем округленное значение
    R.tap(writeLog),
    // Округляем
    roundIt
  )(value);

// Сценарий для валидного значения
const proccessValidValue = (handleError, handleSuccess, writeLog) => (
  value
) => {
  R.compose(
    R.ifElse(
      // Проверяем на isNaN
      checkIsNotNaN,
      // Если не NaN - выполняем код дальше
      () =>
        startIfValueValidAndIsNotNaN(
          handleSuccess,
          handleError,
          writeLog
        )(value),
      // Иначе - логируем лошибку
      () => handleError("ValidationError")
    )(),
    toNum
  )(value);
};

// Реагируем на валидацию
const reactOnValidation = (handleError, handleSuccess, writeLog, value) => (
  arg
) =>
  R.ifElse(
    () => arg,
    // Если валидно - запускаем процесс для валидного сценария
    () => proccessValidValue(handleError, handleSuccess, writeLog)(value),
    // Не валидно - логируем ошибку
    () => handleError("ValidationError")
  )();

// Энтри поинт
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const startProcess = R.compose(
    // Реагируем на валидацию
    reactOnValidation(handleError, handleSuccess, writeLog, value),
    // Валидируем
    validate,
    // Лог в самом начале
    R.tap(writeLog)
  );
  startProcess(value);
};

export default processSequence;
