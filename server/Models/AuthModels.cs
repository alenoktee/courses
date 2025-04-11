namespace backend.Models
{
    public class GoogleAuthRequest
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public User User { get; set; }
    }

    public class JwtSettings
    {
        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpirationInMinutes { get; set; }
    }
} 