/**
 * Type khai báo tối thiểu cho script Google Identity Services (GIS) —
 * script này được load runtime từ "https://accounts.google.com/gsi/client",
 * Google KHÔNG cung cấp package npm chính thức có type, nên phải tự declare.
 *
 * Chỉ gồm những gì ta dùng trong useGoogleLogin:
 *   - credential?: string  ← chính là "idToken" gửi lên POST /auth/google.
 *     (SDK tự ký JWT chứa email/name/... — BE verify chữ ký bằng client
 *      secret, frontend chỉ forward nguyên vẹn.)
 *   - initialize(): đăng ký client_id + callback nhận credential.
 *   - prompt(): mở popup One Tap — gọi khi user bấm nút "Google".
 *   - disableAutoSelect(): tránh tự động chọn account cũ giữa các lần.
 */
export interface CredentialResponse {
    credential?: string;
}

interface GoogleIdApi {
    accounts: {
        id: {
            initialize(config: {
                client_id: string;
                callback: (response: CredentialResponse) => void;
                auto_select?: boolean;
                /** FedCM: Chrome quản lý popup/cấp quyền thay GIS → không phụ thuộc 3rd-party cookie */
                use_fedcm_for_prompt?: boolean;
            }): void;
            /**
             * prompt() trả về Notification object (qua callback) mô tả kết quả:
             * isNotDisplayed()/getNotDisplayedReason(), isSkippedMoment(),
             * isDismissedMoment() — dùng để surface lý do popup không hiện.
             */
            prompt(notificationCallback?: (notification: PromptNotification) => void): void;
            disableAutoSelect(): void;
            /** Render button official của Google; click → popup chọn account
             *  (ux_mode: "popup"), hoạt động cả khi chưa sign-in session. */
            renderButton(
                container: HTMLElement,
                options: {
                    type?: "standard" | "icon";
                    theme?: "outline" | "filled_blue" | "filled_black";
                    size?: "large" | "medium" | "small";
                    shape?: "pill" | "rectangular" | "circle" | "square";
                    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
                    logo_alignment?: "left" | "center";
                    width?: number;
                }
            ): void;
        };
    };
}

interface PromptNotification {
    isNotDisplayed(): boolean;
    getNotDisplayedReason(): string;
    isSkippedMoment(): boolean;
    getSkippedReason(): string;
    isDismissedMoment(): boolean;
    getDismissedReason(): string;
}

declare global {
    interface Window {
        google?: GoogleIdApi;
    }
}
