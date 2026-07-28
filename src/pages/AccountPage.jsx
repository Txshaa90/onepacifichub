import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  LogOut,
  Package,
  Heart,
  Settings,
  Bell,
  Shield,
  Home,
  CreditCard,
  Lock,
  Star,
  Truck,
  RotateCcw,
  XCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageBackLink from '../components/PageBackLink'
import GarageManager from '../components/GarageManager'

const buildFormData = (user) => ({
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: user?.address || '',
  city: user?.city || '',
  state: user?.state || '',
  zipCode: user?.zipCode || '',
  marketingEmails: user?.marketingEmails ?? true,
  orderUpdates: user?.orderUpdates ?? true,
  smsAlerts: user?.smsAlerts ?? false
})

const mockWishlist = [
  { name: 'Cadillac Factory Style Wheel Covers', category: 'Wheel Covers', price: '$189.95' },
  { name: 'Toyota Chrome Mirror Covers', category: 'Restyling Accessories', price: '$69.99' },
  { name: 'Ford Grille Insert Accent Kit', category: 'Restyling Accessories', price: '$118.00' }
]

const getAddressCards = (formData) => {
  const addressLine = [formData.address, formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')

  return [
    {
      label: 'Default Shipping',
      name: `${formData.firstName} ${formData.lastName}`.trim() || 'Primary Address',
      details: addressLine || 'Add your shipping address to speed up checkout.',
      phone: formData.phone || 'Add a phone number for delivery updates.'
    },
    {
      label: 'Billing Address',
      name: `${formData.firstName} ${formData.lastName}`.trim() || 'Billing Address',
      details: addressLine || 'Use the same details or add a separate billing address later.',
      phone: formData.phone || 'No billing phone saved yet.'
    }
  ]
}

const orderTabs = ['All Orders', 'Processing', 'Shipped', 'Delivered', 'To Review', 'Returns', 'Cancelled']

const statusStyles = {
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped: 'bg-sky-50 text-sky-700 border-sky-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'To Review': 'bg-violet-50 text-violet-700 border-violet-200',
  Returns: 'bg-orange-50 text-orange-700 border-orange-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
}

const statusIcons = {
  Processing: Package,
  Shipped: Truck,
  Delivered: Home,
  'To Review': Star,
  Returns: RotateCcw,
  Cancelled: XCircle
}

const sidebarSections = [
  { id: 'profile', label: 'Profile', description: 'Personal details and contact info', icon: User },
  { id: 'garage', label: 'Garage', description: 'Your saved vehicles', icon: Truck },
  { id: 'orders', label: 'Orders', description: 'History, tracking, and reviews', icon: Package },
  { id: 'addresses', label: 'Addresses', description: 'Saved shipping and billing addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', description: 'Saved products for later', icon: Heart },
  { id: 'settings', label: 'Settings', description: 'Notifications and preferences', icon: Settings },
  { id: 'security', label: 'Security', description: 'Password and account protection', icon: Shield }
]

const AccountPage = () => {
  const navigate = useNavigate()
  const { user, logout, updateProfile, updateGarage, changePassword, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(() => buildFormData(user))
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [activeOrderTab, setActiveOrderTab] = useState('All Orders')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    setFormData(buildFormData(user))
  }, [user])

  const actualOrders = useMemo(() => {
    if (!Array.isArray(user?.orders)) {
      return []
    }

    return user.orders
      .filter(Boolean)
      .map((order, index) => ({
        id: order.id || order.orderId || `ORDER-${index + 1}`,
        date: order.date || order.createdAt || order.placedAt || 'Date unavailable',
        status: order.status || 'Processing',
        item: order.item || order.title || order.productName || 'Order item',
        amount: order.amount || order.total || order.price || '',
        action: order.action || 'Track Order'
      }))
  }, [user])

  const filteredOrders = useMemo(() => (
    activeOrderTab === 'All Orders'
      ? actualOrders
      : actualOrders.filter((order) => order.status === activeOrderTab)
  ), [activeOrderTab, actualOrders])

  const addressCards = useMemo(() => getAddressCards(formData), [formData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    setSaveMessage('')
    setSaveError('')
    const result = await updateProfile(formData)
    if (!result.success) {
      setSaveError(result.error || 'Profile update failed')
      return
    }
    setSaveMessage(result.message || 'Profile saved successfully.')
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(buildFormData(user))
    setSaveMessage('')
    setSaveError('')
    setIsEditing(false)
  }

  const handlePasswordChange = async () => {
    setPasswordMessage('')
    setPasswordError('')

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please complete all password fields.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    if (!result.success) {
      setPasswordError(result.error || 'Password change failed.')
      return
    }

    setPasswordMessage(result.message || 'Password changed successfully.')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-40 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <PageBackLink to="/" label="Back to home" />

          <div className="mb-10 border-b border-slate-200 bg-white pb-8 text-slate-950">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div>
                  <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                  <p className="mt-2 text-slate-600">{user.email}</p>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Log out"
                className="flex items-center gap-2 border border-slate-300 px-6 py-3 font-semibold text-slate-950 hover:border-slate-950"
              >
                <LogOut size={20} />
                Logout
              </motion.button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              {sidebarSections.map((section) => {
                const Icon = section.icon
                return (
                  <a key={section.id} href={`#${section.id}`}>
                    <motion.div whileHover={{ y: -2 }} className="cursor-pointer border border-gray-200 bg-white p-5">
                      <div className="flex items-start gap-3 text-gray-700">
                        <Icon size={22} className="mt-1 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{section.label}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </a>
                )
              })}
            </div>

            <div className="space-y-8 lg:col-span-2">
              <div id="profile" className="scroll-mt-28 border border-gray-200 bg-white p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                    <p className="mt-1 text-sm text-gray-600">Keep your personal and contact details up to date.</p>
                  </div>

                  {!isEditing ? (
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Edit profile"
                      className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={20} />
                      Edit
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        type="button"
                        onClick={handleCancel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Cancel editing"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Save profile changes"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        <Save size={20} />
                        {loading ? 'Saving...' : 'Save'}
                      </motion.button>
                    </div>
                  )}
                </div>

                {saveError ? (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveError}
                  </div>
                ) : null}

                {saveMessage ? (
                  <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {saveMessage}
                  </div>
                ) : null}

                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Changing your email may require confirmation before the new address becomes active.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <GarageManager vehicles={user?.garage || []} onSave={updateGarage} />

              <div id="orders" className="scroll-mt-28 border border-gray-200 bg-white p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
                  <p className="mt-1 text-sm text-gray-600">Track current orders, revisit past purchases, and manage post-delivery actions.</p>
                </div>

                <div className="mb-6 flex flex-wrap gap-3">
                  {orderTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveOrderTab(tab)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeOrderTab === tab
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                      <p className="text-xl font-bold text-gray-900">No real orders to show yet</p>
                      <p className="mt-2 text-gray-600">
                        This section will display actual customer orders once the order system is connected.
                      </p>
                    </div>
                  ) : filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status] || Package

                    return (
                      <div key={order.id} className="rounded-2xl border border-gray-200 p-5">
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Order ID {order.id}</p>
                            <h3 className="mt-1 text-lg font-bold text-gray-900">{order.item}</h3>
                            <p className="mt-1 text-sm text-gray-500">Placed on {order.date}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles[order.status]}`}>
                              <StatusIcon size={16} />
                              {order.status}
                            </span>
                            {order.amount ? <p className="text-lg font-bold text-gray-900">{order.amount}</p> : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            {order.action}
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600"
                          >
                            Buy Again
                          </button>
                          {order.status === 'Delivered' || order.status === 'To Review' ? (
                            <button
                              type="button"
                              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600"
                            >
                              Leave Review
                            </button>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div id="addresses" className="scroll-mt-28 border border-gray-200 bg-white p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Addresses</h2>
                    <p className="mt-1 text-sm text-gray-600">Save shipping and billing addresses to speed up checkout.</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600"
                  >
                    Add Address
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {addressCards.map((address) => (
                    <div key={address.label} className="rounded-2xl border border-gray-200 p-5">
                      <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                        {address.label}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{address.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{address.details}</p>
                      <p className="mt-2 text-sm text-gray-500">{address.phone}</p>
                      <button
                        type="button"
                        className="mt-4 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600"
                      >
                        Edit Address
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div id="wishlist" className="scroll-mt-28 border border-gray-200 bg-white p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
                    <p className="mt-1 text-sm text-gray-600">Save products for later and jump back into shopping faster.</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600"
                  >
                    View Saved Items
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {mockWishlist.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-gray-200 p-5">
                      <div className="mb-4 flex h-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
                        <Heart className="text-blue-600" size={28} />
                      </div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">{item.category}</p>
                      <h3 className="mt-2 text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="mt-2 text-base font-semibold text-blue-600">{item.price}</p>
                      <button
                        type="button"
                        className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div id="settings" className="scroll-mt-28 border border-gray-200 bg-white p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                  <p className="mt-1 text-sm text-gray-600">Control communication preferences, order alerts, and optional updates.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4">
                    <div className="flex gap-3">
                      <Bell className="mt-1 text-blue-600" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">Marketing emails</p>
                        <p className="text-sm text-gray-600">Promotions, new arrivals, and seasonal offers.</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="marketingEmails"
                      checked={formData.marketingEmails}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4">
                    <div className="flex gap-3">
                      <Package className="mt-1 text-blue-600" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">Order updates</p>
                        <p className="text-sm text-gray-600">Status updates for payment, shipment, and delivery.</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="orderUpdates"
                      checked={formData.orderUpdates}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4">
                    <div className="flex gap-3">
                      <Phone className="mt-1 text-blue-600" size={18} />
                      <div>
                        <p className="font-medium text-gray-900">SMS alerts</p>
                        <p className="text-sm text-gray-600">Text updates for urgent order changes and delivery attempts.</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="smsAlerts"
                      checked={formData.smsAlerts}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60"
                    />
                  </label>
                </div>
              </div>

              <div id="security" className="scroll-mt-28 border border-gray-200 bg-white p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                  <p className="mt-1 text-sm text-gray-600">Manage your password and account protection settings.</p>
                </div>

                {passwordError ? (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {passwordError}
                  </div>
                ) : null}

                {passwordMessage ? (
                  <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {passwordMessage}
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((current) => ({ ...current, confirmPassword: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <Shield className="text-blue-600" size={18} />
                      <h3 className="font-semibold text-gray-900">Account Protection</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Password changes take effect immediately. Email updates may require reconfirmation before the new address becomes active.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <CreditCard className="text-blue-600" size={18} />
                      <h3 className="font-semibold text-gray-900">Payment Methods</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Saved cards and e-wallet support can be added next once billing storage is ready.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="mt-6 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AccountPage
