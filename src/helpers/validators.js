import * as R from "ramda";
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (objects) => {
  const isCircleWhite = R.propEq("circle", "white");
  const isTriangleWhite = R.propEq("triangle", "white");
  const isStarRed = R.propEq("star", "red");
  const isSquareGreen = R.propEq("square", "green");
  const getResult = R.allPass([
    isCircleWhite,
    isTriangleWhite,
    isStarRed,
    isSquareGreen,
  ]);

  return getResult(objects);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (objects) => {
  const isGreen = (color) => color === "green";
  const isMoreTwo = (x) => x >= 2;
  const getResult = R.compose(isMoreTwo, R.length, R.filter(isGreen), R.values);

  return getResult(objects);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (objects) => {
  const isRed = (color) => color === "red";
  const isBlue = (color) => color === "blue";
  const getBlueObjectsLength = R.compose(R.length, R.filter(isBlue), R.values);
  const getRedObjectsLength = R.compose(R.length, R.filter(isRed), R.values);
  const getResult = () =>
    R.equals(getBlueObjectsLength(objects), getRedObjectsLength(objects));

  return getResult();
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (objects) => {
  const isCircleBlue = R.propEq("circle", "blue");
  const isStarRed = R.propEq("star", "red");
  const isSquareOrange = R.propEq("square", "orange");
  const getResult = R.allPass([isCircleBlue, isStarRed, isSquareOrange]);

  return getResult(objects);
};

// 5. Три фигуры одного любого цвета кроме белого.
export const validateFieldN5 = (objects) => {
  const isRed = (color) => color === "red";
  const isGreen = (color) => color === "green";
  const isBlue = (color) => color === "blue";
  const isOrange = (color) => color === "orange";

  const isMoreThenThree = (x) => x >= 3;

  const isMoreThenThreeOrange = R.compose(
    isMoreThenThree,
    R.length,
    R.filter(isOrange),
    R.values
  );

  const isMoreThenThreeBlue = R.compose(
    isMoreThenThree,
    R.length,
    R.filter(isBlue),
    R.values
  );

  const isMoreThenThreeRed = R.compose(
    isMoreThenThree,
    R.length,
    R.filter(isRed),
    R.values
  );

  const isMoreThenThreeGreen = R.compose(
    isMoreThenThree,
    R.length,
    R.filter(isGreen),
    R.values
  );

  const getResult = R.anyPass([
    isMoreThenThreeGreen,
    isMoreThenThreeRed,
    isMoreThenThreeBlue,
    isMoreThenThreeOrange,
  ]);

  return getResult(objects);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (objects) => {
  const isGreen = (color) => color === "green";
  const isRed = (color) => color === "red";
  const isOne = (x) => x === 1;
  const isTwo = (x) => x === 2;
  const isTwoGreen = R.compose(isTwo, R.length, R.filter(isGreen), R.values);
  const isTriangleGreen = R.compose(R.equals("green"), R.prop("triangle"));
  const isOneRed = R.compose(isOne, R.length, R.filter(isRed), R.values);
  const getResult = R.allPass([isTriangleGreen, isTwoGreen, isOneRed]);

  return getResult(objects);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (objects) => {
  const isOrange = (color) => color === "orange";
  const isSingleColor = (x) => x >= 4;
  const getResult = R.compose(
    isSingleColor,
    R.length,
    R.filter(isOrange),
    R.values
  );

  return getResult(objects);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = ({ star }) => {
  const isNotRed = (color) => color !== "red";
  const isNotWhite = (color) => color !== "white";
  const getResult = R.allPass([isNotRed, isNotWhite]);

  return getResult(star);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (objects) => {
  const isGreen = (color) => color === "green";
  const isSingleColor = (x) => x >= 4;
  const getResult = R.compose(
    isSingleColor,
    R.length,
    R.filter(isGreen),
    R.values
  );

  return getResult(objects);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({ triangle, square }) => {
  // Проверим, что треугольник и квадрат одинакового цвета
  const isTriangleAndSquareSameColor = () => R.equals(triangle, square);
  // Достаточно проверить, что не белый треугольник, тогда ясно, что они оба не белые
  const isOneNotWhite = R.compose(R.not, R.equals("white"));
  const getResult = R.allPass([isTriangleAndSquareSameColor, isOneNotWhite]);

  return getResult(triangle);
};
