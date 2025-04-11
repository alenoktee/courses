namespace backend.Models
{
    public class User
    {
        public User()
        {
            Name = "Unknown User";
            Email = "unknown@example.com";
            GoogleId = string.Empty;
            ProfilePictureUrl = string.Empty;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string GoogleId { get; set; }
        public string ProfilePictureUrl { get; set; }
    }
}
