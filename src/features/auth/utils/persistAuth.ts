import type { LoginResponse } from "../types/auth.type";

/**
 * Lưu auth tokens + user vào localStorage (cùng key mà axios interceptor đọc:
 * "accessToken", "refreshToken", "user").
 *
 * Cả 3 flow login (password / Google / GitHub) đều trả về LoginResponse GIỐNG
 * NHAU theo BE contract, nên phần "gửi payload rồi lưu token" dùng chung hàm
 * này thay vì copy-paste localStorage.setItem(...) ở mỗi nơi.
 *
 * OAuth flow tổng quan (Google làm ví dụ):
 *   1. Frontend tự lấy credential từ Google (nhờ useGoogleLogin) — BE KHÔNG
 *      làm bước này.
 *   2. POST /auth/google { idToken, device }  ← bước mà BE có sẵn.
 *   3. persistAuthResponse(data) — lưu token, redirect vào app.
 */
export function persistAuthResponse(data: LoginResponse) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken.token);
    localStorage.setItem("user", JSON.stringify(data.user));
}
