import { AdminGuard } from '@/components/admin/AdminGuard'
import { UserTable } from '@/components/admin/UserTable'

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users and system settings</p>
          </div>
          
          <div className="space-y-6">
            <UserTable />
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}