import React from 'react'
import type { Company } from '../services/companyService'

interface CompanyListProps {
  companies: Company[]
  onDelete: (id: string) => void
}

const CompanyList: React.FC<CompanyListProps> = React.memo(({ companies, onDelete }) => {
  return (
    <ul>
      {companies.map((c: Company) => (
        <li key={c._id}>
          {c.name} ({c.employees})
          <button onClick={() => onDelete(c._id)} style={{ marginLeft: '10px' }}>Delete</button>
        </li>
      ))}
    </ul>
  )
})

CompanyList.displayName = 'CompanyList'

export default CompanyList
