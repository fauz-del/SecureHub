import { NavLink } from 'react-router-dom'
import {
  IconLayoutDashboard, IconTable, IconUsers,
  IconActivity, IconSettings, IconLock, IconLogout, IconSun
} from '@tabler/icons-react'

interface SidebarProps {
  role: 'admin' | 'standard'
  onLogout: () => void
}

const navBase = 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors'
const navActive = 'bg-[#EEEDFE] dark:bg-[#7F77DD]/15 text-[#534AB7] dark:text-[#AFA9EC] font-medium'
const navInactive = 'text-gray-400 dark:text-[#555] hover:bg-gray-50 dark:hover:bg-[#23232f]'

const toggleTheme = () => {
  const html = document.documentElement
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}

export default function Sidebar({ role, onLogout }: SidebarProps) {
  return (
    <aside className="w-[148px] flex-shrink-0 bg-white dark:bg-[#1c1c27] border-r border-gray-100 dark:border-[#2a2a38] flex flex-col h-screen">

      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100 dark:border-[#2a2a38]">
        <div className="w-7 h-7 bg-[#534AB7] rounded-lg flex items-center justify-center flex-shrink-0">
          <IconLock size={14} color="white" />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-[#e8e6f8]">SecureHub</span>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}>
          <IconLayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/records" className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}>
          <IconTable size={16} />
          <span>{role === 'admin' ? 'Records' : 'My records'}</span>
        </NavLink>

        {role === 'admin' && (
          <>
            <NavLink to="/users" className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}>
              <IconUsers size={16} />
              <span>Users</span>
            </NavLink>
            <NavLink to="/behavior" className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}>
              <IconActivity size={16} />
              <span>Behavior</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-[#2a2a38] space-y-1">
        <NavLink to="/settings" className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}>
          <IconSettings size={16} />
          <span>Settings</span>
        </NavLink>
<button
  onClick={toggleTheme}
  className={`${navBase} ${navInactive} w-full text-left`}
>
  <IconSun size={16} />
  <span>Toggle theme</span>
</button> 
       <button
          onClick={onLogout}
          className={`${navBase} ${navInactive} w-full text-left`}
        >
          <IconLogout size={16} />
          <span>Sign out</span>
        </button>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-[#2a2a38]">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
            role === 'admin'
              ? 'bg-[#EEEDFE] dark:bg-[#7F77DD]/20 text-[#534AB7] dark:text-[#AFA9EC]'
              : 'bg-[#E1F5EE] dark:bg-[#1D9E75]/20 text-[#0F6E56] dark:text-[#5DCAA5]'
          }`}>
            {role === 'admin' ? 'AD' : 'JD'}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-[#ccc]">
              {role === 'admin' ? 'Admin' : 'John D.'}
            </p>
            <p className={`text-xs ${role === 'admin' ? 'text-[#534AB7] dark:text-[#AFA9EC]' : 'text-[#1D9E75] dark:text-[#5DCAA5]'}`}>
              {role === 'admin' ? 'Administrator' : 'Standard'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )

}
