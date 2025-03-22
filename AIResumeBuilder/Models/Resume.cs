namespace AIResumeBuilder.Models
{
    public class Resume
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string InputData { get; set; }
        public string GeneratedResume { get; set; }
        public DateTime CreatedAt { get; set; }
        public User User { get; set; }
    }
}