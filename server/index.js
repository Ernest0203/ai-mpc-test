require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const companyRepository = require('./repositories/companyRepository')
const { validateCreateCompany } = require('./dto/companyDto')

// Middleware для валидации ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  next()
}

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)

app.get('/companies', async (req, res) => {
  try {
    const companies = await companyRepository.findAll()
    res.json(companies)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch companies' })
  }
})

app.post('/companies', validateCreateCompany, async (req, res) => {
  try {
    const company = await companyRepository.create(req.body)
    res.json(company)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company' })
  }
})

app.delete('/companies/:id', validateObjectId, async (req, res) => {
  try {
    const { id } = req.params
    const company = await companyRepository.softDeleteById(id)
    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }
    res.json({ message: 'Company soft deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' })
  }
})

app.listen(4000, () => {
  console.log('API on http://localhost:4000')
})
