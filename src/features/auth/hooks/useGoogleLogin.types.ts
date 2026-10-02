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
 *   - disableAutoSelect(): tránh tự động chọn account cũ giữa các lần.
 *   - renderButton(): render nút official của Google (popup chọn account).
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
            }): void;
            disableAutoSelect(): void;
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

declare global {
    interface Window {
        google?: GoogleIdApi;
    }
}
