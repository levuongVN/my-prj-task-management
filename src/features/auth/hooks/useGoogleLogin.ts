import { useEffect, useRef } from "react";
import type { CredentialResponse } from "./useGoogleLogin.types";

/**
 * Google One Tap login hook.
 *
 * Vì sao cần phần này (frontend làm gì, BE không lo được):
 *  - BE endpoint /auth/google chỉ nhận { idToken, device }, nhưng idToken
 *    phải do FE thu thập từ Google — Google yêu cầu SDK JS của họ chạy trên
 *    trang (GIS script) để mở popup đăng nhập và cấp id_token.
 *  - Vậy hook này chỉ có 2 nhiệm vụ: (1) load + initialize GIS script một lần,
 *    (2) khi user chọn account, đẩy credential (id_token) xuống callback —
 *    toàn bộ phần còn lại là gọi POST /auth/google và persist như login thường.
 *
 * Không có hook này thì frontend KHÔNG có idToken để gửi payload theo BE
 * contract yêu cầu.
 *
 * Safe under StrictMode double-effect: initialize() là idempotent, script
 * chỉ append một lần (check theo id "google-gsi-script").
 */
export function useGoogleLogin(
    onCredential: (idToken: string) => void,
    onPromptNotShown?: (reason: string) => void
) {
    const onCredentialRef = useRef(onCredential);

    // Keep the latest callbacks without re-initializing the SDK
    const onPromptNotShownRef = useRef(onPromptNotShown);

    useEffect(() => {
        onCredentialRef.current = onCredential;
        onPromptNotShownRef.current = onPromptNotShown;
    }, [onCredential, onPromptNotShown]);

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) return;
        if (window.google) {
            window.google.accounts.id.disableAutoSelect();
            return;
        }

        // Idempotent initialize — safe under StrictMode double effects
        const initialize = () => {
            window.google?.accounts.id.initialize({
                client_id: clientId,
                callback: (response: CredentialResponse) => {
                    if (response.credential) {
                        onCredentialRef.current(response.credential);
                    }
                },
                auto_select: false,
                // FedCM: Chrome điều phối prompt thay GIS → hoạt động ngay cả khi
                // third-party cookie bị chặn (nguyên nhân phổ biến của lỗi 400
                // trên accounts.google.com/gsi/status)
                use_fedcm_for_prompt: true,
            });
        };

        const existingScript = document.getElementById("google-gsi-script");
        if (existingScript) {
            // Script từ mount khác — chờ load event rồi initialize
            existingScript.addEventListener("load", initialize);
            return () => {
                existingScript.removeEventListener("load", initialize);
            };
        }

        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initialize;
        document.head.appendChild(script);
    }, []);

    /** Mở popup One Tap. Chỉ gọi khi isReady() === true (script đã load). */
    const prompt = () => {
        if (typeof window === "undefined" || !window.google) return;
        // Notification callback cho biết popup có hiển thị không; dùng để
        // surface lý do thật (browser_chrome_webview, expired_api_client,
        // third_party_cookies_blocked, suppress_ifframes_without_tabs_user_gesture...)
        // thay vì để UI im lặng như trước.
        window.google.accounts.id.prompt((notification) => {
            let reason: string | null = null;
            if (notification.isNotDisplayed()) {
                reason = notification.getNotDisplayedReason();
            } else if (notification.isSkippedMoment()) {
                reason = notification.getSkippedReason();
            } else if (notification.isDismissedMoment()) {
                reason = notification.getDismissedReason();
            }

            if (reason && reason !== "dismissed_by_user" && reason !== "credential_returned") {
                onPromptNotShownRef.current?.(reason);
            }
        });
    };

    /**
     * Render button "Sign in with Google" official vào container truyền vào.
     * Ưu điểm hơn One Tap prompt: click button là user gesture + first-party,
     * ux_mode "popup" mở cửa sổ chọn/tạo account đầy đủ — chạy tốt trên
     * Brave/Safari với shields bật, kể cả khi browser chưa có Google session
     * (One Tap prompt sẽ fail với opt_out_or_no_session ở các trình duyệt đó).
     */
    const renderButton = (container: HTMLElement) => {
        if (!window.google || !container) return;
        window.google.accounts.id.renderButton(container, {
            type: "standard",
            // "outline" = nền trắng, chữ đen — khớp với nút GitHub (white card)
            theme: "outline",
            size: "large",
            shape: "rectangular", // bo góc do wrapper shadow control, đồng bộ rounded-2xl
            text: "continue_with",
            logo_alignment: "center",
            // Fill đúng chiều rộng container để thẳng hàng với nút GitHub
            width: container.clientWidth || 320,
        });
    };

    /** Script GIS đã load và google API sẵn sàng chưa. */
    const isReady = () => typeof window !== "undefined" && !!window.google;

    /** Client ID có được cấu hình qua env không (thiếu → hiện message hướng dẫn). */
    const isConfigured = () => !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return { prompt, isReady, isConfigured, renderButton };
}
