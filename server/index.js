require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const companyRepository = require('./repositories/companyRepository')
const { validateCreateCompany } = require('./dto/companyDto')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Middleware для валидации ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  next()
}

const allowedOrigins = [
  'http://localhost:3000',
  'https://d1m94fxbbwq7j5.cloudfront.net'
];

const app = express()
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))
app.use(express.json())

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
