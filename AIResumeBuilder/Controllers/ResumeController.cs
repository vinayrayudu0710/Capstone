using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AIResumeBuilder.Models;
using AIResumeBuilder.Repositories;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;

namespace AIResumeBuilder.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ResumeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public ResumeController(AppDbContext context, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task<IActionResult> CreateResume([FromBody] ResumeInputModel input)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var inputJson = JsonConvert.SerializeObject(input);

            var generatedText = await GenerateResumeFromAI(inputJson);

            var resume = new Resume
            {
                UserId = userId,
                InputData = inputJson,
                GeneratedResume = generatedText,
                CreatedAt = DateTime.Now
            };

            _context.Resumes.Add(resume);
            await _context.SaveChangesAsync();
            return Ok(resume);
        }

        [HttpGet]
        public IActionResult GetMyResumes()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var resumes = _context.Resumes.Where(r => r.UserId == userId).ToList();
            return Ok(resumes);
        }

       private async Task<string> GenerateResumeFromAI(string inputJson)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                var apiKey = _configuration["Gemini:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                    throw new Exception("Gemini API key is missing.");

                var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}";
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = $"Generate a professional resume Based on the details: {inputJson}" }
                            }
                        }
                    }
                };

                var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(url, content);
                response.EnsureSuccessStatusCode();

                var result = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());
                return result.candidates[0].content.parts[0].text.ToString().Trim();
            }
            catch (HttpRequestException ex)
            {
                return $"Error calling Gemini AI: {ex.Message}";
            }
        }
    }
}