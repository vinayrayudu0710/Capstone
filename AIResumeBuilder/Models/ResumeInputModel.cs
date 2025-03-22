namespace AIResumeBuilder.Models
{
    public class ResumeInputModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public List<Education> Education { get; set; }
        public List<string> Skills { get; set; }
        public List<Experience> Experience { get; set; }
        public List<string> Certifications { get; set; }
        public string GitHub { get; set; }
        public List<string> Languages { get; set; }
    }

    public class Education
    {
        public string Degree { get; set; }
        public string Institution { get; set; }
        public string Year { get; set; }
    }

    public class Experience
    {
        public string Title { get; set; }
        public string Company { get; set; }
        public string Duration { get; set; }
    }

    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}