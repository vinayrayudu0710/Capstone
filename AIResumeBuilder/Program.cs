using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AIResumeBuilder.Repositories;
using AIResumeBuilder.Models;
using Microsoft.OpenApi.Models;
using AIResumeBuilder.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>{
        builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
    });
});

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>{
        options.TokenValidationParameters = new TokenValidationParameters{
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))

        };
    });

    builder.Services.AddSwaggerGen(c =>{
        c.SwaggerDoc("v1", new() {Title = "AI Resume Builder API", Version = "v1"});

     c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
 });
 builder.Services.AddHttpClient();
 builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

    

var app = builder.Build();

using (var scope = app.Services.CreateScope()){
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    SeedAdminUser(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AI Resume Builder API v1"));
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
Console.WriteLine($"Issuer: {builder.Configuration["Jwt:Issuer"]}, Audience: {builder.Configuration["Jwt:Audience"]}");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();


app.Run();

void SeedAdminUser(AppDbContext context){
    if(!context.Users.Any(u => u.Email =="admin@admin.com")){
        var adminUser = new User{
            Email = "admin@admin.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin@123"),
            Role = "Admin",
            Resumes = new List<Resume>()
    };
    context.Users.Add(adminUser);
    context.SaveChanges();
}
}

