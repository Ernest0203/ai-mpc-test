const { Company } = require('../models')

// Репозиторий для работы с компаниями в базе данных
class CompanyRepository {
  // Условие для не удалённых компаний
  static notDeletedCondition = { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] }

  // Получить все не удалённые компании
  async findAll() {
    return await Company.find(CompanyRepository.notDeletedCondition)
  }

  // Создать новую компанию
  async create(companyData) {
    const company = new Company(companyData)
    return await company.save()
  }

  // Найти не удалённую компанию по ID
  async findById(id) {
    return await Company.findOne({ _id: id, ...CompanyRepository.notDeletedCondition })
  }

  // Обновить компанию по ID (только если не удалена)
  async updateById(id, updateData) {
    return await Company.findOneAndUpdate({ _id: id, ...CompanyRepository.notDeletedCondition }, updateData, { new: true })
  }

  // Soft delete компании по ID
  async softDeleteById(id) {
    return await Company.findOneAndUpdate({ _id: id, ...CompanyRepository.notDeletedCondition }, { deletedAt: new Date() }, { new: true })
  }

  // Получить все компании, включая удалённые (для админа)
  async findAllIncludingDeleted() {
    return await Company.find()
  }

  // Восстановить компанию по ID
  async restoreById(id) {
    return await Company.findOneAndUpdate({ _id: id, deletedAt: { $ne: null } }, { deletedAt: null }, { new: true })
  }
}

module.exports = new CompanyRepository()
