import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckSquare, Mail } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { resendVerification, verifyEmail } from "../../features/auth/services/auth.service";
import Input from "../../shared/components/Ui/Input";
import Button from "../../shared/components/Ui/Button";

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const hasToken = !!token;

    // Resend flow — user có thể không nhớ/tokens hết hạn, nhập email để nhận link mới.
    // BE luôn trả 200 (kể cả email không tồn tại/đã verify) → hiển thị message chung.
    const [resendEmail, setResendEmail] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [resendNotice, setResendNotice] = useState<string | null>(null);

    useEffect(() => {
        if (!hasToken) return;

        verifyEmail({ token })
            .then(() => setStatus("success"))
            .catch((error) => {
                setStatus("error");
                setErrorMessage(
                    axios.isAxiosError(error)
                        ? error.response?.data?.message ?? "Verification token is invalid or expired"
                        : "Verification token is invalid or expired"
                );
            });
    }, [hasToken, token]);

    // Thiếu token trên URL → không gọi API, hiển thị lỗi ngay (derived, không setState)
    const effectiveStatus = hasToken ? status : "error";
    const effectiveMessage = hasToken
        ? errorMessage
        : "Invalid link, the verification token is missing.";

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resendEmail.trim() || isResending) return;

        setIsResending(true);
        resendVerification({ email: resendEmail.trim() })
            .then((data) => setResendNotice(data.message))
            .catch((error) => {
                toast.error(
                    axios.isAxiosError(error)
                        ? error.response?.data?.message ?? "Failed to send verification email"
                        : "Failed to send verification email"
                );
            })
            .finally(() => setIsResending(false));
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-[32px] border border-zinc-800 bg-[#050505] p-10 text-white text-center">
                <div className="flex items-center justify-center">
                    <div className="w-11 h-11 rounded-xl border border-white flex items-center justify-center">
                        <CheckSquare size={22} />
                    </div>
                </div>

                {effectiveStatus === "loading" && (
                    <>
                        <h1 className="mt-8 text-2xl font-bold tracking-tight">
                            Verifying your email...
                        </h1>

                        <div className="mt-8 flex justify-center">
                            <span className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
                        </div>
                    </>
                )}

                {effectiveStatus === "success" && (
                    <>
                        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            Verified
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight">
                            Email verified successfully
                        </h1>

                        <p className="mt-4 text-zinc-400 leading-7">
                            Your email is confirmed. You can use every feature of TaskFlow now.
                        </p>

                        <button
                            onClick={() => navigate("/dashboard", { replace: true })}
                            className="mt-8 h-12 w-full rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
                        >
                            Continue to app
                        </button>
                    </>
                )}

                {effectiveStatus === "error" && (
                    <>
                        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Invalid link
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight">
                            Verification failed
                        </h1>

                        <p className="mt-4 text-zinc-400 leading-7">
                            {effectiveMessage ?? "Verification token is invalid or expired."}
                            The link is valid for 24 hours and can be used once.
                        </p>

                        {/* Resend — nhập email để nhận link mới (message luôn chung chung) */}
                        {resendNotice ? (
                            <p className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                {resendNotice}
                            </p>
                        ) : (
                            <form
                                onSubmit={handleResend}
                                className="mt-6 space-y-3 text-left"
                            >
                                <Input
                                    type="email"
                                    placeholder="Enter your email to resend"
                                    icon={<Mail size={20} className="text-zinc-400" />}
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isResending || !resendEmail.trim()}
                                >
                                    {isResending ? "Sending..." : "Send a new verification email"}
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 flex items-center justify-center">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-zinc-400 hover:text-white transition"
                            >
                                Back to sign in
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
