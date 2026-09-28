import { useState } from "react";
import { MailWarning } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../../features/user/hooks/useUser";
import { resendVerification } from "../../features/auth/services/auth.service";
import Button from "../../shared/components/Ui/Button";

/**
 * Banner "Verify your email" — chỉ hiện khi user.emailVerifiedAt == null
 * (source: GET /me, cũng chứa field này ở login/register/OAuth response).
 * User vẫn dùng được app bình thường, chỉ nhắc nhẹ + resend link.
 */
export function EmailVerificationBanner() {
    const { data: user } = useUser();
    const [isResending, setIsResending] = useState(false);
    const [sent, setSent] = useState(false);

    if (!user || user.emailVerifiedAt != null) return null;

    const handleResend = () => {
        if (isResending) return;
        setIsResending(true);

        resendVerification({ email: user.email })
            .then((data) => {
                setSent(true);
                toast.success(data.message);
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message ?? "Failed to send verification email");
                } else {
                    toast.error("Failed to send verification email");
                }
            })
            .finally(() => setIsResending(false));
    };

    return (
        <div className="mx-4 lg:mx-10 mt-2 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3">
            <MailWarning size={18} className="flex-shrink-0 text-amber-400" />

            <p className="flex-1 min-w-0 text-sm text-amber-200">
                Verify your email to secure your account.
                <span className="ml-1 font-medium text-amber-100">{user.email}</span>
            </p>

            <div className="flex items-center gap-3">
                {sent ? (
                    <span className="text-sm font-medium text-emerald-400">
                        Link sent — check your inbox
                    </span>
                ) : (
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        isLoading={isResending}
                        onClick={handleResend}
                        className="rounded-xl px-4 py-2 text-xs"
                    >
                        Resend verification
                    </Button>
                )}
            </div>
        </div>
    );
}
