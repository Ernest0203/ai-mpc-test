import React, { useState, useCallback, useEffect } from 'react'
import type { Company } from '../services/companyService'
import { fetchCompanies as fetchCompaniesAPI, deleteCompany } from '../services/companyService'
import CompanyList from './CompanyList'
import CompanyForm from './CompanyForm'
import Notification from './Notification'

const CompanyManager: React.FC = React.memo(() => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [notification, setNotification] = useState<string | null>(null)

  const loadCompanies = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchCompaniesAPI()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to load companies:', error)
    }
  }, [])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteCompany(id)
      loadCompanies()
      setNotification('Company deleted successfully!')
    } catch (error) {
      console.error('Failed to delete company:', error)
    }
  }, [loadCompanies])

  const closeNotification = useCallback(() => {
    setNotification(null)
  }, [])

  return (
    <div>
      <h1>Companies</h1>
      <CompanyForm onCompanyAdded={loadCompanies} />
      <CompanyList companies={companies} onDelete={handleDelete} />
      {notification && <Notification message={notification} onClose={closeNotification} />}
    </div>
  )
})

CompanyManager.displayName = 'CompanyManager'

export default CompanyManager
