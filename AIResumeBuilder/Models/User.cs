namespace AIResumeBuilder.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }

        public List<Resume> Resumes {get; set;}
    }
}