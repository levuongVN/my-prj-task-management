import {
    CheckSquare,
    Eye,
    EyeClosed,
    Lock,
    Mail,
    Sparkles,
} from 'lucide-react'

import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '../../features/auth/schemas/login.schema'
import Input from '../../shared/components/Ui/Input'
import Button from '../../shared/components/Ui/Button'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { login, googleLogin } from '../../features/auth/services/auth.service'
import { persistAuthResponse } from '../../features/auth/utils/persistAuth'
import { getDeviceFingerprint } from '../../features/auth/utils/fingerprint'
import { useGoogleLogin } from '../../features/auth/hooks/useGoogleLogin'
import { buildGithubAuthorizeUrl } from '../../features/auth/utils/githubAuthorize'

export default function LoginPage() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({ // useForm là một hook được cung cấp bởi react-hook-form để quản lý trạng thái của form. Nó trả về một số phương thức và đối tượng để xử lý form, bao gồm register để đăng kí input, handleSubmit để xử lý submit form, và formState để theo dõi lỗi của form.
        resolver: zodResolver(loginSchema), // zodResolver là một hàm được cung cấp bởi @hookform/resolvers/zod để tích hợp Zod schema validation với react-hook-form. Nó sẽ sử dụng loginSchema để xác thực dữ liệu của form và trả về lỗi nếu có bất kỳ trường nào không hợp lệ.
    })
    const loginMutation = useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            persistAuthResponse(data)
            navigate('/dashboard');
        },

        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Something went wrong'
        
                setServerError(message)
            } else {
                setServerError('Unknown error')
            }
        },
    })

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate({
            ...data,
            device: {
                fingerprint: getDeviceFingerprint(),
                pushToken: null,
            },
        })
    }
    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    /*
     * Hiển thị lỗi OAuth từ trang callback GitHub: GithubCallbackPage redirect
     * ngược về /login?error=<message> vẫn giữ state của LoginForm nên ta
     * chỉ đọc ?error= 1 lần lúc mount.
     */
    useEffect(() => {
        const error = new URLSearchParams(window.location.search).get('error')
        if (error) setServerError(error)
    }, [])

    /*
     * ══ GOOGLE OAUTH ══
     * useGoogleLogin tự load Google GIS script + initialize với
     * VITE_GOOGLE_CLIENT_ID (Google yêu cầu SDK chạy trong DOM để mở popup
     * cấp id_token — BE không làm được bước này).
     *
     * Callback dưới đây CHẠY SAU KHI user chọn account trong popup:
     *   idToken (JWT do Google ký) → POST /auth/google → LoginResponse.
     * BE verify chữ ký JWT bằng client_secret rồi mới phát token app.
     */
    const googleMutation = useMutation({
        mutationFn: googleLogin,

        onSuccess: (data) => {
            persistAuthResponse(data)
            navigate('/dashboard')
        },

        onError: (error) => {
            if (axios.isAxiosError(error)) {
                setServerError(error.response?.data?.message || 'Google sign-in failed')
            } else {
                setServerError('Google sign-in failed')
            }
        },
    })

    /*
     * Callback được đăng ký TRƯỚC mutation nhưng CHẠY SAU popup — nó chỉ
     * forward idToken vào mutation (device payload bắt buộc kèm theo để BE
     * theo dõi thiết bị). onCredentialRef trong hook đảm bảo SDK luôn gọi
     * phiên bản callback mới nhất dù component re-render.
     */
    const {
        isReady: isGoogleReady,
        isConfigured: isGoogleConfigured,
        renderButton: renderGoogleButton,
    } = useGoogleLogin(
        (idToken) => {
            setServerError(null)
            googleMutation.mutate({
                idToken,
                device: {
                    fingerprint: getDeviceFingerprint(),
                    pushToken: null,
                },
            })
        },
        // Popup One Tap không hiển thị được → Google trả về lý do cụ thể,
        // map sang thông tin người dùng có thể xử lý:
        (reason) => {
            if (reason === 'opt_out_or_no_session') {
                // Browser chưa đăng nhập Google account nào, hoặc user đã
                // opt-out One Tap cho site này (Brave mặc định chặn trackers
                // nên thường rẽ vào nhánh này).
                setServerError('No Google session found in this browser. Please sign in to your Google account first, then click Google again.')
                return
            }

            setServerError(`Google popup could not open (${reason}). Try allowing third-party cookies for accounts.google.com or check your network/adblocker.`)
        }
    )

    // Container where GIS renders the official "Continue with Google" button
    const googleBtnRef = useRef<HTMLDivElement>(null)

    // Poll cho script GIS load xong rồi render official button (mô tả ở hook:
    // official button + popup ưu việt hơn One Tap prompt trên Brave/Safari).
    // GIS tự quản inner content — render idempotent, gọi 1 lần là đủ.
    useEffect(() => {
        if (!isGoogleConfigured()) return

        let tries = 0
        const timer = setInterval(() => {
            if (isGoogleReady() && googleBtnRef.current) {
                clearInterval(timer)
                renderGoogleButton(googleBtnRef.current)
            } else if (++tries > 100) {
                clearInterval(timer)
            }
        }, 100)

        return () => clearInterval(timer)
        // Các hàm của hook được tạo mới mỗi render nhưng behavior giống nhau —
        // chỉ cần chạy effect một lần lúc mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /*
     * ══ GITHUB OAUTH ══
     * GitHub dùng authorization-code flow, KHÔNG popup:
     *   1. Đường link authorize được build từ VITE_GITHUB_CLIENT_ID
     *      (buildGithubAuthorizeUrl → null nếu chưa cấu hình).
     *   2. Redirect user sang github.com/login/oauth/authorize.
     *   3. GitHub redirect về /auth/github/callback?code=<code>
     *      → GithubCallbackPage gọi POST /auth/github.
     * BE đổi code + client_secret lấy access token GitHub server-side.
     */
    const handleGithubClick = () => {
        const url = buildGithubAuthorizeUrl()
        if (!url) {
            setServerError('GitHub sign-in is not configured. Please check the GitHub Client ID.')
            return
        }
        window.location.href = url
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-2xl border border-zinc-800">

                {/* LEFT SIDE */}
                <div className="relative bg-[#050505] text-white p-10 lg:p-16 flex flex-col justify-between min-h-[900px]">

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-white flex items-center justify-center">
                            <CheckSquare size={24} />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            TaskFlow
                        </h1>
                    </div>

                    <div className="relative z-10 max-w-md space-y-10">
                        <div>
                            <h2 className="text-6xl font-bold leading-tight tracking-tight">
                                Welcome back
                            </h2>

                            <p className="mt-6 text-zinc-400 text-lg leading-8">
                                Sign in to continue managing your tasks.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                'Plan with clarity',
                                'Boost productivity',
                                'Work anywhere',
                            ].map((title) => (
                                <div
                                    key={title}
                                    className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-700 flex items-center justify-center">
                                        <Sparkles size={22} />
                                    </div>

                                    <p className="text-lg font-medium">
                                        {title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="bg-[#f7f7f7] flex items-center justify-center p-6 lg:p-12 min-h-[900px]">

                    <div className="w-full max-w-xl bg-white rounded-[32px] p-8 lg:p-12 shadow-xl border border-zinc-100">

                        <div>
                            <h2 className="text-5xl font-bold tracking-tight text-black">
                                Welcome back
                            </h2>

                            <p className="mt-4 text-zinc-500 text-lg">
                                Sign in to continue to your account
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)} // handleSubmit là một hàm được cung cấp bởi react-hook-form để xử lý việc submit form. Nó sẽ kiểm tra tính hợp lệ của form dựa trên schema đã định nghĩa và sau đó gọi hàm onSubmit nếu mọi thứ đều hợp lệ.
                            className="mt-12 space-y-6"
                        >

                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-3">
                                    Email
                                </label>

                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    icon={
                                        <Mail
                                            className="text-zinc-400"
                                            size={20}
                                        />
                                    }
                                    error={errors.email?.message}
                                    {...register('email')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-3">
                                    Password
                                </label>

                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    leftIcon={
                                        <Lock
                                            className="text-zinc-400"
                                            size={20}
                                        />
                                    }
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? (
                                                <EyeClosed
                                                    className="text-zinc-400"
                                                    size={20}
                                                />
                                            ) : (
                                                <Eye
                                                    className="text-zinc-400"
                                                    size={20}
                                                />
                                            )}
                                        </button>
                                    }
                                    error={errors.password?.message}
                                    {...register('password')} // đăng kí input với react-hook-form, nó sẽ theo dõi giá trị và lỗi của trường này dựa trên schema đã định nghĩa
                                />
                            </div>

                            {serverError && (
                                <p className="text-red-500 text-sm mt-4">
                                    {serverError}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        <div className="flex items-center gap-4 my-10">
                            <div className="flex-1 h-px bg-zinc-200" />
                            <span className="text-sm text-zinc-400">
                                or continue with
                            </span>
                            <div className="flex-1 h-px bg-zinc-200" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            {/* handleClick (GitHub): redirect sang GitHub; nếu fail, trang
                                /auth/github/callback redirect lại về đây kèm ?error=...
                                để hiển thị thông báo phía trên. */}
                            {/* FcGoogle custom giữ hình cũ; nút official của GIS phủ
                                transparent (opacity-0) TRÊN để mọi click vào nó
                                vẫn mở popup của Google, nhưng nhìn ra vẫn là
                                nút custom có text + shadow như GitHub. */}
                            <div className="relative w-full">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full border-zinc-200 bg-white !text-zinc-900 shadow-lg hover:bg-zinc-50"
                                    onClick={isGoogleConfigured() ? undefined : () =>
                                        setServerError('Google sign-in is not configured. Please check the Google Client ID.')}
                                >
                                    <FcGoogle size={24} />
                                    Google
                                </Button>
                                {isGoogleConfigured() && (
                                    <div
                                        ref={googleBtnRef}
                                        /* opacity-0 lên chính container → mọi thứ GIS
                                        render bên trong ẩn ngay từ first paint,
                                        không còn flash "button đè lên rồi mất" */
                                        className="absolute inset-0 cursor-pointer !opacity-0 [&_iframe]:!w-full [&_div]:!w-full"
                                    />
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleGithubClick}
                                disabled={googleMutation.isPending || loginMutation.isPending}
                            >
                                <FaGithub size={22} />
                                GitHub
                            </Button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}