import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import axios from "axios";
import { githubLogin } from "../../features/auth/services/auth.service";
import { persistAuthResponse } from "../../features/auth/utils/persistAuth";
import { getDeviceFingerprint } from "../../features/auth/utils/fingerprint";

export default function GithubCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    /*
     * GitHub redirect về đây kèm ?code=<...> sau khi user authorize
     * (xem buildGithubAuthorizeUrl ở Login). Page này chỉ có 1 nhiệm vụ:
     * forward code → POST /auth/github, sau đó BE:
     *   - đảm bảo qua code đổi access-token GitHub của mình (client_secret)
     *   - upsert user theo email của GitHub, verify duration device từ fingerprint
     *   - trả LoginResponse giống như password login.
     * Không có ?code (user vào URL bừa / huỷ flow) → về trang login.
     */
    const code = searchParams.get("code");

    useEffect(() => {
        if (!code) {
            navigate("/login", { replace: true });
            return;
        }

        // Ngăn setState/navigate sau khi unmount (StrictMode chạy effect 2 lần)
        let cancelled = false;

        githubLogin({
            code,
            device: {
                // Fingerprint phải khớp key "taskflow_device_fingerprint" —
                // logout giữ nguyên giá trị này để BE reuse device row cũ
                fingerprint: getDeviceFingerprint(),
                pushToken: null,
            },
        })
            .then((data) => {
                if (cancelled) return;
                // Lưu token vào localStorage (key mà axios interceptor đọc) rồi vào app
                persistAuthResponse(data);
                navigate("/dashboard", { replace: true });
            })
            .catch((err) => {
                if (cancelled) return;
                // BE trả 400 { message: string } (code hết hạn / đã dùng / email bị chặn...)
                // → không redirect (code đã fail) mà hiện lỗi ngay tại page này,
                // kèm nút "Back to sign in" quay về /login.
                const message = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? "GitHub sign-in failed"
                    : "GitHub sign-in failed";
                setError(message);
            });

        return () => {
            cancelled = true;
        };
    }, [code, navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-[32px] border border-zinc-800 bg-[#050505] p-10 text-white text-center">
                <div className="mx-auto flex w-12 h-12 items-center justify-center rounded-xl border border-white">
                    <CheckSquare size={24} />
                </div>

                {error ? (
                    <>
                        <h1 className="mt-8 text-2xl font-bold tracking-tight text-red-400">
                            Sign in failed
                        </h1>
                        <p className="mt-4 text-zinc-400">{error}</p>
                        <button
                            onClick={() => navigate("/login", { replace: true })}
                            className="mt-8 h-12 px-6 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
                        >
                            Back to sign in
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="mt-8 text-2xl font-bold tracking-tight">
                            Signing in with GitHub...
                        </h1>
                        <div className="mt-8 flex justify-center">
                            <span className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
