import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    CheckSquare,
    Eye,
    EyeClosed,
    Lock,
    Mail,
    User,
} from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { register as registerAccount, googleLogin } from '../../features/auth/services/auth.service'
import { persistAuthResponse } from '../../features/auth/utils/persistAuth'
import { getDeviceFingerprint } from '../../features/auth/utils/fingerprint'
import { useGoogleLogin } from '../../features/auth/hooks/useGoogleLogin'
import { buildGithubAuthorizeUrl } from '../../features/auth/utils/githubAuthorize'
import {
    registerSchema,
    type RegisterFormValues,
} from '../../features/auth/schemas/register.schema'
import Input from '../../shared/components/Ui/Input'
import Button from '../../shared/components/Ui/Button'

export default function RegisterPage() {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    /* ══ POST-LOGIN FLOW DÙNG CHUNG ══
     * register trả LoginResponse giống hệt login → persist + redirect như login,
     * notification/analytics hoạt động ngay vì có session đầy đủ. */
    const registerMutation = useMutation({
        mutationFn: registerAccount,

        onSuccess: (data) => {
            persistAuthResponse(data)
            navigate('/dashboard')
        },

        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Registration failed'

                // "Email already exists" → báo dưới input email
                if (message.includes('already exists')) {
                    setError('email', { message })
                } else {
                    setServerError(message)
                }
            } else {
                setServerError('Unknown error')
            }
        },
    })

    /* ══ GOOGLE OAUTH (auto tạo account cho email mới) ══ */
    const googleMutation = useMutation({
        mutationFn: googleLogin,

        onSuccess: (data) => {
            persistAuthResponse(data)
            navigate('/dashboard')
        },

        onError: (error) => {
            if (axios.isAxiosError(error)) {
                setServerError(error.response?.data?.message || 'Google sign-up failed')
            } else {
                setServerError('Google sign-up failed')
            }
        },
    })

    // Container where GIS renders the official "Continue with Google" button
    const googleBtnRef = useRef<HTMLDivElement>(null)

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
        (reason) => {
            setServerError(`Google popup could not open (${reason}).`)
        }
    )

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
        // Các hàm của hook behavior-stable — effect chỉ chạy lúc mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /* ══ GITHUB OAUTH ══ */
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
            <div className="w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-zinc-800 bg-white p-8 lg:p-12">

                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl border border-black flex items-center justify-center text-black">
                        <CheckSquare size={22} />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-black">
                        TaskFlow
                    </h1>
                </div>

                <div className="mt-8">
                    <h2 className="text-4xl font-bold tracking-tight text-black">
                        Create your account
                    </h2>

                    <p className="mt-3 text-zinc-500">
                        Sign up to start organizing your tasks.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit((data) => {
                        setServerError(null)
                        registerMutation.mutate({
                            fullName: data.fullName,
                            email: data.email,
                            password: data.password,
                            device: {
                                fingerprint: getDeviceFingerprint(),
                                pushToken: null,
                            },
                        })
                    })}
                    className="mt-10 space-y-6"
                >
                    {/* FULL NAME */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-3">
                            Full name
                        </label>

                        <Input
                            type="text"
                            placeholder="Enter your full name"
                            icon={
                                <User
                                    className="text-zinc-400"
                                    size={20}
                                />
                            }
                            error={errors.fullName?.message}
                            {...register('fullName')}
                        />
                    </div>

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

                        {/* Email exists → gợi ý login / forgot password */}
                        {/* Email exists → gợi ý login / forgot password */}
                        {errors.email?.message?.includes('already exists') && (
                            <p className="mt-2 text-xs text-zinc-500">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-black underline">
                                    Sign in
                                </Link>{' '}
                                or{' '}
                                <Link to="/forgot-password" className="font-medium text-black hover:underline">
                                    reset password
                                </Link>
                            </p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-3">
                            Password
                        </label>

                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="At least 6 characters"
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
                                        <EyeClosed className="text-zinc-400" size={20} />
                                    ) : (
                                        <Eye className="text-zinc-400" size={20} />
                                    )}
                                </button>
                            }
                            error={errors.password?.message}
                            {...register('password')}
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-3">
                            Confirm password
                        </label>

                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Re-enter your password"
                            leftIcon={<Lock size={20} className="text-zinc-400" />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />
                    </div>

                    {serverError && (
                        <p className="text-red-500 text-sm">{serverError}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending || googleMutation.isPending}
                    >
                        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>

                <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-zinc-200" />
                    <span className="text-sm text-zinc-400">or continue with</span>
                    <div className="flex-1 h-px bg-zinc-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Google official GIS button phủ transparent — click → popup auto sign-up */}
                    <div className="relative w-full">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full border-zinc-200 bg-white !text-zinc-900 shadow-lg hover:bg-zinc-50"
                            onClick={isGoogleConfigured() ? undefined : () =>
                                setServerError('Google sign-up is not configured. Please check the Google Client ID.')}
                        >
                            <FcGoogle size={24} />
                            Google
                        </Button>

                        {isGoogleConfigured() && (
                            <div
                                ref={googleBtnRef}
                                className="absolute inset-0 cursor-pointer !opacity-0 [&_iframe]:!w-full [&_div]:!w-full"
                            />
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleGithubClick}
                        disabled={registerMutation.isPending || googleMutation.isPending}
                    >
                        <FaGithub size={22} />
                        GitHub
                    </Button>
                </div>

                <p className="mt-8 text-sm text-zinc-500 text-center">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-black hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
