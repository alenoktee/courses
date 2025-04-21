using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using System.Linq;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthController(
            IConfiguration configuration,
            AppDbContext context,
            IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuthRequest request)
        {
            Console.WriteLine($"Получен запрос на авторизацию через Google. Code: {request.Code?.Substring(0, 10)}..., RedirectUri: {request.RedirectUri}");
            
            try
            {
                var tokenResponse = await ExchangeCodeForTokenAsync(request.Code, request.RedirectUri);
                if (tokenResponse == null)
                {
                    Console.WriteLine("Не удалось получить токен от Google");
                    return BadRequest("Не удалось обменять код на токен");
                }

                Console.WriteLine($"Получен токен доступа: {tokenResponse.AccessToken?.Substring(0, 15)}...");

                var userInfo = await GetGoogleUserInfoAsync(tokenResponse.AccessToken);
                if (userInfo == null)
                {
                    Console.WriteLine("Не удалось получить информацию о пользователе от Google");
                    return BadRequest("Не удалось получить информацию о пользователе");
                }

                Console.WriteLine($"Получена информация о пользователе:");
                Console.WriteLine($"ID: {userInfo.Id}");
                Console.WriteLine($"Email: {userInfo.Email}");
                Console.WriteLine($"Name: {userInfo.Name}");
                Console.WriteLine($"GivenName: {userInfo.GivenName}");
                Console.WriteLine($"FamilyName: {userInfo.FamilyName}");
                Console.WriteLine($"Picture: {userInfo.Picture?.Substring(0, 30)}...");

                string firstName = !string.IsNullOrEmpty(userInfo.GivenName) ? userInfo.GivenName :
                                  !string.IsNullOrEmpty(userInfo.Name) ? userInfo.Name.Split(' ')[0] :
                                  !string.IsNullOrEmpty(userInfo.Email) ? userInfo.Email.Split('@')[0] :
                                  "Google";

                string lastName = !string.IsNullOrEmpty(userInfo.FamilyName) ? userInfo.FamilyName :
                                 !string.IsNullOrEmpty(userInfo.Name) && userInfo.Name.Split(' ').Length > 1 ? userInfo.Name.Split(' ')[1] :
                                 "User";

                var user = _context.Users.FirstOrDefault(u => u.GoogleId == userInfo.Id);
                
                if (user == null)
                {
                    user = new User
                    {
                        GoogleId = userInfo.Id ?? "unknown",
                        FirstName = firstName,
                        LastName = lastName,
                        Email = userInfo.Email ?? "noemail@example.com",
                        ProfilePictureUrl = userInfo.Picture,
                        Role = "обучающийся"
                    };
                    
                    Console.WriteLine($"Создаем нового пользователя: GoogleId={user.GoogleId}, FirstName={user.FirstName}, LastName={user.LastName}, Email={user.Email}");
                    
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                    
                    Console.WriteLine("Пользователь успешно создан в базе данных");
                }
                else
                {
                    Console.WriteLine($"Обновляем существующего пользователя с ID={user.Id}");
                    
                    user.FirstName = firstName;
                    user.LastName = lastName;
                    user.Email = userInfo.Email ?? user.Email;
                    user.ProfilePictureUrl = userInfo.Picture ?? user.ProfilePictureUrl;
                    
                    await _context.SaveChangesAsync();
                    
                    Console.WriteLine("Пользователь успешно обновлен в базе данных");
                }

                var token = GenerateJwtToken(user);
                Console.WriteLine($"JWT токен успешно сгенерирован: {token.Substring(0, 20)}...");

                return Ok(new AuthResponse { Token = token, User = user });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при обработке запроса: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Внутреннее исключение: {ex.InnerException.Message}");
                }
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            Console.WriteLine($"Получен запрос на регистрацию: Email={request.Email}, FirstName={request.FirstName}, LastName={request.LastName}, IsTeacher={request.IsTeacher}");

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                Console.WriteLine("Ошибка: Email или пароль пустые");
                return BadRequest("Email и пароль обязательны");
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                Console.WriteLine($"Ошибка: пользователь с email {request.Email} уже существует");
                return BadRequest("Пользователь с таким email уже существует");
            }

            try
            {
                var user = new User
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    BirthDate = request.DateOfBirth != null ? DateTime.Parse(request.DateOfBirth).ToUniversalTime() : DateTime.UtcNow,
                    PhoneNumber = request.Phone,
                    Role = request.IsTeacher ? "преподаватель" : "обучающийся", // Используем новое поле
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                Console.WriteLine("Создание нового пользователя...");

                // Хеширование пароля
                using var hmac = new HMACSHA512();
                var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(request.Password));
                user.PasswordHash = Convert.ToBase64String(passwordHash);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Пользователь успешно создан с ID: {user.Id}");

                var token = GenerateJwtToken(user);
                return Ok(new { token, user });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при создании пользователя: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        private async Task<GoogleTokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri)
        {
            try
            {
                var clientId = _configuration["Authentication:Google:ClientId"];
                var clientSecret = _configuration["Authentication:Google:ClientSecret"];

                Console.WriteLine($"Отправка запроса на получение токена. ClientId: {clientId?.Substring(0, 10)}..., RedirectUri: {redirectUri}");

                var client = _httpClientFactory.CreateClient();
                var tokenRequestContent = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "code", code },
                    { "client_id", clientId },
                    { "client_secret", clientSecret },
                    { "redirect_uri", redirectUri },
                    { "grant_type", "authorization_code" }
                });

                var response = await client.PostAsync("https://oauth2.googleapis.com/token", tokenRequestContent);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Ошибка при обмене кода на токен. Статус: {response.StatusCode}");
                    Console.WriteLine($"Ответ: {responseContent}");
                    return null;
                }

                Console.WriteLine($"Google Token Response: {responseContent}");
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                var result = JsonSerializer.Deserialize<GoogleTokenResponse>(responseContent, options);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Исключение при обмене кода на токен: {ex.Message}");
                return null;
            }
        }

        private async Task<GoogleUserInfo> GetGoogleUserInfoAsync(string accessToken)
        {
            try
            {
                Console.WriteLine("Отправка запроса на получение информации о пользователе");
                
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                var response = await client.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Ошибка при получении информации о пользователе. Статус: {response.StatusCode}");
                    Console.WriteLine($"Ответ: {responseContent}");
                    return null;
                }

                Console.WriteLine($"Google UserInfo Response: {responseContent}");

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                var result = JsonSerializer.Deserialize<GoogleUserInfo>(responseContent, options);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Исключение при получении информации о пользователе: {ex.Message}");
                return null;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }

    public class GoogleTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = string.Empty;
        
        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }
        
        [JsonPropertyName("token_type")]
        public string TokenType { get; set; } = string.Empty;
        
        [JsonPropertyName("refresh_token")]
        public string RefreshToken { get; set; } = string.Empty;
        
        [JsonPropertyName("id_token")]
        public string IdToken { get; set; } = string.Empty;
    }

    public class GoogleUserInfo
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;
        
        [JsonPropertyName("verified_email")]
        public bool VerifiedEmail { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        
        [JsonPropertyName("given_name")]
        public string GivenName { get; set; } = string.Empty;
        
        [JsonPropertyName("family_name")]
        public string FamilyName { get; set; } = string.Empty;
        
        [JsonPropertyName("picture")]
        public string Picture { get; set; } = string.Empty;
        
        [JsonPropertyName("locale")]
        public string Locale { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Phone { get; set; }
        public bool IsTeacher { get; set; }
    }
} 