using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AIResumeBuilder.Repositories;

namespace AIResumeBuilder.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = _context.Users.Select(u => new { u.Id, u.Email, u.Role }).ToList();
            return Ok(users);
        }

        [HttpGet("users/{userId}/resumes")]
        public IActionResult GetUserResumes(int userId)
        {
            var resumes = _context.Resumes.Where(r => r.UserId == userId).ToList();
            return Ok(resumes);
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("resumes/{resumeId}")]
        public async Task<IActionResult> DeleteResume(int resumeId)
        {
            var resume = _context.Resumes.FirstOrDefault(r => r.Id == resumeId);
            if (resume == null) return NotFound();

            _context.Resumes.Remove(resume);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}