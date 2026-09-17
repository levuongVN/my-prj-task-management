/**
 * Dùng cho GitHub OAuth (authorization-code flow).
 *
 * Vì sao cần file này thay vì chỉ gửi payload: BE chỉ CHẤP NHẬN một `code`
 * hợp lệ trong POST /auth/github, nhưng `code` đó KHÔNG tồn tại sẵn —
 * phải đưa user qua trang authorize của GitHub để GitHub phát code trả về
 * callback URL. Đây là flow Google/GitHub quy định, BE không thể tự làm.
 *
 * Flow tổng quan (GitHub):
 *   1. buildGithubAuthorizeUrl() → window.location = "https://github.com/
 *      login/oauth/authorize?client_id=...&redirect_uri=...&scope=..."
 *      (user bấm nút GitHub trên trang Login).
 *   2. GitHub redirect về /auth/github/callback?code=<code> (GithubCallbackPage).
 *   3. POST /auth/github { code, device } — bước BE có sẵn.
 *
 * URL được build từ env, KHÔNG hardcode client_id trong source.
 */

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";

/**
 * Builds the GitHub OAuth authorize URL. Returns null when the
 * GitHub client ID is not configured (empty env var).
 */
export function buildGithubAuthorizeUrl(): string | null {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
    if (!clientId) return null;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri ?? `${window.location.origin}/auth/github/callback`,
        // Chỉ xin thông tin user — BE dùng code + client_secret để đổi access token server-side
        scope: "read:user user:email",
    });

    return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
}
