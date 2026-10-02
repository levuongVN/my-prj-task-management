import type { LoginResponse } from "../types/auth.type";
import {
    setAccessToken,
    setRefreshToken,
    setStoredUser,
} from "../../../shared/utils/authStorage";

/**
 * Lưu auth tokens + user vào localStorage qua helper namespace "taskflow_"
 * (xem src/shared/utils/authStorage.ts — tránh đụng app khác cùng origin).
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
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken.token);
    setStoredUser(data.user);
}
