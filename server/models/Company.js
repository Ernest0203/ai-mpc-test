const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name: String,
  employees: Number,
  deletedAt: { type: Date, default: null } // Поле для soft delete
})

module.exports = mongoose.model('Company', companySchema)
