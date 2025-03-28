using AIResumeBuilder.Models;
using Microsoft.EntityFrameworkCore;

namespace AIResumeBuilder.Repositories
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        public DbSet<User> Users{get; set;}
        public DbSet<Resume> Resumes {get; set;}

        
    }
    
}