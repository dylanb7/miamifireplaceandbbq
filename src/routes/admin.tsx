import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Tag, Folders } from 'lucide-react'
import { getTaxonomy } from '../server/admin'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN === 'true'

    throw new Error('Admin access disabled')

  },
  component: AdminLayout,
  loader: async () => {
    const taxonomy = await getTaxonomy()
    return { categories: Object.keys(taxonomy).sort() }
  }
})

function AdminLayout() {
  const { categories } = Route.useLoaderData()

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 border-r border-base-300 flex flex-col h-screen sticky top-0">
        <div className="p-4 border-b border-base-300">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            CMS Admin
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {categories.map((category) => (
            <Link
              key={category}
              to="/admin/products/$categoryId"
              params={{ categoryId: category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 transition-colors [&.active]:bg-primary [&.active]:text-primary-content"
            >
              <Folders className="w-5 h-5" />
              <span className="font-medium">{category}</span>
            </Link>
          ))}
          <Link
            to="/admin/brands"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 transition-colors [&.active]:bg-primary [&.active]:text-primary-content mt-4"
          >
            <Tag className="w-5 h-5" />
            <span className="font-medium">Brand Manager</span>
          </Link>
          {/* Add future links here */}
        </nav>
        <div className="p-4 border-t border-base-300">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-base-100 border-b border-base-300 p-4">
          <h2 className="text-lg font-semibold text-base-content/80">Content Management</h2>
        </header>
        <div className="flex-1 overflow-auto p-6" key={window.location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
