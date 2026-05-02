import { useState, useEffect } from 'react'
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications'
import { Bell, CheckCheck, Calendar, AlertCircle, Info } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const typeIcon = {
  status_update: <AlertCircle size={16} className="text-blue-400" />,
  interview_scheduled: <Calendar size={16} className="text-green-400" />,
  general: <Info size={16} className="text-purple-400" />,
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications()
      .then((res) => setNotifications(res.data.notifications))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRead = async (id) => {
    await markAsRead(id)
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n))
  }

  const handleReadAll = async () => {
    await markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const unread = notifications.filter((n) => !n.isRead).length

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Notifications</h1>
          <p className="section-sub">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={handleReadAll} className="btn-secondary text-sm flex items-center gap-2">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No notifications yet</h3>
          <p className="text-gray-600">Updates from admins will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleRead(n._id)}
              className={`card cursor-pointer transition-all ${!n.isRead ? 'border-primary-500/30 glow' : 'opacity-60'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  n.type === 'interview_scheduled' ? 'bg-green-500/15' :
                  n.type === 'status_update' ? 'bg-blue-500/15' : 'bg-purple-500/15'
                }`}>
                  {typeIcon[n.type] || typeIcon.general}
                </div>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${n.isRead ? 'text-gray-400' : 'text-gray-200'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">
                      {formatDistanceToNow(new Date(n.createdAt))} ago
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
