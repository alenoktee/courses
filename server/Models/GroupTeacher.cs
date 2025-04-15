namespace backend.Models
{
    public class GroupTeacher
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public Group Group { get; set; } = null!;
        public int TeacherId { get; set; }
        public Teacher Teacher { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 