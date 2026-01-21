import React, { useState, useCallback } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { createCompany } from '../services/companyService'

interface CompanyFormProps {
  onCompanyAdded: () => void
}

const CompanyForm: React.FC<CompanyFormProps> = React.memo(({ onCompanyAdded }) => {
  const [name, setName] = useState<string>('')
  const [employees, setEmployees] = useState<string>('')

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    try {
      await createCompany({ name, employees: Number(employees) })
      setName('')
      setEmployees('')
      onCompanyAdded()
    } catch (error) {
      console.error('Failed to create company:', error)
    }
  }, [name, employees, onCompanyAdded])

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
  }, [])

  const handleEmployeesChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setEmployees(e.target.value)
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Company name"
        value={name}
        onChange={handleNameChange}
        required
      />
      <input
        type="number"
        placeholder="Number of employees"
        value={employees}
        onChange={handleEmployeesChange}
        required
      />
      <button type="submit">Add Company</button>
    </form>
  )
})

CompanyForm.displayName = 'CompanyForm'

export default CompanyForm
