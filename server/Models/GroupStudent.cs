namespace backend.Models
{
    public class GroupStudent
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public Group Group { get; set; } = null!;
        public int StudentId { get; set; }
        public User Student { get; set; } = null!;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
} 