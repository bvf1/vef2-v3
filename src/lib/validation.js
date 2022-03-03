import { body } from 'express-validator';
import xss from 'xss';

export function userRegistrationValidationMiddleWare() {
  return [
    body('name')
      .trim()
      .isLength({min: 1})
      .withMessage('Nafn má ekki vera tómt'),
    body('name')
      .isLength({ max: 64 })
      .withMessage('Nafn má að hámarki vera 64 stafir'),
    body('username')
      .trim()
      .isLength({min: 1})
      .withMessage('Notendanafn má ekki vera tómt'),
    body('username')
      .isLength({ max: 64 })
      .withMessage('NotendaNafn má að hámarki vera 64 stafir'),
    body('password')
      .trim()
      .isLength({min: 1})
      .withMessage('Lykilorð má ekki vera tómt'),
    body('password')
      .isLength({ max: 64 })
      .withMessage('Lykilorð má að hámarki vera 64 stafir')
  ];
}

export function xssSanitizationMiddleware() {
  return [
    body('name').customSanitizer((v) => xss(v)),
    body('username').customSanitizer((v) => xss(v)),
    body('password').customSanitizer((v) => xss(v)),

  ];
}

export function sanitizationMiddleware() {
  return [
    body('name').trim().escape(),
    body('username').trim().escape(),
    body('password').trim().escape()
  ];
}
export function registrationValidationMiddleware(textField) {
  return [
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Nafn má ekki vera tómt'),
    body('name')
      .isLength({ max: 64 })
      .withMessage('Nafn má að hámarki vera 64 stafir'),
    body(textField)
      .isLength({ max: 400 })
      .withMessage(
        `${
          textField === 'comment' ? 'Athugasemd' : 'Lýsing'
        } má að hámarki vera 400 stafir`
      ),
  ];
}
/*

// Viljum keyra sér og með validation, ver gegn „self XSS“
export function xssSanitizationMiddleware(textField) {
  return [
    body('name').customSanitizer((v) => xss(v)),
    body(textField).customSanitizer((v) => xss(v)),
  ];
}

export function sanitizationMiddleware(textField) {
  return [body('name').trim().escape(), body(textField).trim().escape()];
}*/
