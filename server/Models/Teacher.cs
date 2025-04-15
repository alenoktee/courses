namespace backend.Models
{
    public class Teacher
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int ExperienceYears { get; set; }
        public string? Bio { get; set; }
        public string? Specialization { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
} 