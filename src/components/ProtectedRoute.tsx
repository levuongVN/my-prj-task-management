import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

import { refreshAccessToken } from '../shared/services/axios'
import { isTokenExpired } from '../shared/utils/token'
import Loading from '../shared/components/Ui/Loading'
import Button from '../shared/components/Ui/Button'

type Props = {
  children: React.ReactNode
}

type Status = 'checking' | 'authenticated' | 'unauthenticated' | 'error'

/**
 * Quyết định trạng thái phiên ngay khi vào app:
 * - accessToken còn hạn  → vào thẳng (không gọi refresh thừa).
 * - accessToken hết hạn/mất nhưng có refreshToken → thử refresh trước.
 * - refresh bị BE từ chối dứt khoát → về /login.
 * - refresh lỗi tạm thời (mạng/5xx) → giữ token, cho thử lại (không đá ra login).
 *
 * Nhờ vậy mở app lại sau khi accessToken hết hạn KHÔNG bắt đăng nhập lại,
 * miễn refreshToken còn hiệu lực.
 */
function getInitialStatus(): Status {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken && !isTokenExpired(accessToken)) return 'authenticated'
  if (localStorage.getItem('refreshToken')) return 'checking'
  return 'unauthenticated'
}

export default function ProtectedRoute({ children }: Props) {
  const [status, setStatus] = useState<Status>(getInitialStatus)

  useEffect(() => {
    if (status !== 'checking') return

    let cancelled = false

    refreshAccessToken()
      .then(() => {
        if (!cancelled) setStatus('authenticated')
      })
      .catch(() => {
        if (cancelled) return
        // refreshAccessToken xoá token khi bị từ chối dứt khoát (400/401/403).
        // Còn token ⇒ lỗi tạm thời ⇒ giữ phiên và cho thử lại.
        setStatus(localStorage.getItem('refreshToken') ? 'error' : 'unauthenticated')
      })

    return () => {
      cancelled = true
    }
  }, [status])

  if (status === 'checking') {
    return <Loading fullScreen text="Restoring session..." />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-zinc-950 p-10 text-center text-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <AlertTriangle size={22} />
          </div>

          <h1 className="mt-6 text-xl font-semibold">Couldn't restore your session</h1>
          <p className="mt-3 text-sm text-zinc-400">
            We couldn't reach the server to refresh your session. Check your connection
            and try again — you're still signed in.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button type="button" onClick={() => setStatus('checking')}>
              Try again
            </Button>

            <Link
              to="/login"
              className="text-sm font-medium text-zinc-500 transition hover:text-zinc-300"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
