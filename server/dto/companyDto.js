const Joi = require('joi')

// Схема валидации для создания компании
const createCompanySchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Название компании не может быть пустым',
      'string.min': 'Название компании должно содержать минимум 1 символ',
      'string.max': 'Название компании не может превышать 100 символов',
      'any.required': 'Название компании обязательно'
    }),
  employees: Joi.number()
    .integer()
    .min(0)
    .max(1000000)
    .required()
    .messages({
      'number.base': 'Количество сотрудников должно быть числом',
      'number.integer': 'Количество сотрудников должно быть целым числом',
      'number.min': 'Количество сотрудников не может быть отрицательным',
      'number.max': 'Количество сотрудников не может превышать 1,000,000',
      'any.required': 'Количество сотрудников обязательно'
    })
})

// Middleware для валидации создания компании
const validateCreateCompany = (req, res, next) => {
  const { error } = createCompanySchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errors = error.details.map(detail => detail.message)
    return res.status(400).json({ errors })
  }
  next()
}

module.exports = {
  validateCreateCompany
}
