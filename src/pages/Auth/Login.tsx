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
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { login } from '../../features/auth/services/auth.service'

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
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken.token)
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
        loginMutation.mutate(data)
    }
    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

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

                            <Button variant="secondary">
                                <FcGoogle size={24} />
                                Google
                            </Button>

                            <Button variant="primary">
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