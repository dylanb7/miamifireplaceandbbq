import { createFileRoute, redirect } from '@tanstack/react-router'
import { getTaxonomy } from '../../server/admin'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const taxonomy = await getTaxonomy()
    const firstCategory = Object.keys(taxonomy).sort()[0] || 'grills'
    const categoryId = firstCategory.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    
    throw redirect({
      to: '/admin/products/$categoryId',
      params: { categoryId }
    })
  },
})
