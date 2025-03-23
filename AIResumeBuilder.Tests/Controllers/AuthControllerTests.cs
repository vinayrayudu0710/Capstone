using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using AIResumeBuilder.Controllers;
using AIResumeBuilder.Models;
using AIResumeBuilder.Services;
using AIResumeBuilder.Repositories;

namespace AIResumeBuilder.Tests
{
    public class AuthControllerTests
    {
        // Helper method to create in-memory DbContext
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        // Test for Register - Password mismatch
        [Fact]
        public async Task Register_PasswordsDoNotMatch_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var tokenServiceMock = new Mock<IJwtTokenService>();
            var controller = new AuthController(context, tokenServiceMock.Object);
            var model = new RegisterModel
            {
                Email = "test@example.com",
                Password = "Password123",
                ConfirmPassword = "Password124"
            };

            // Act
            var result = await controller.Register(model);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Passwords do not match", badRequestResult.Value);
        }

        // Test for Register - Email already exists
        [Fact]
        public async Task Register_EmailExists_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var tokenServiceMock = new Mock<IJwtTokenService>();
            var controller = new AuthController(context, tokenServiceMock.Object);
            var existingUser = new User
            {
                Email = "test@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
                Role = "User"
            };
            context.Users.Add(existingUser);
            await context.SaveChangesAsync();

            var model = new RegisterModel
            {
                Email = "test@example.com", 
                Password = "Password123",
                ConfirmPassword = "Password123"
            };

            // Act
            var result = await controller.Register(model);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Email already exists", badRequestResult.Value);
        }

        // Test for Register - Successful registration
        [Fact]
        public async Task Register_ValidInput_ReturnsOk()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var tokenServiceMock = new Mock<IJwtTokenService>();
            var controller = new AuthController(context, tokenServiceMock.Object);
            var model = new RegisterModel
            {
                Email = "test@example.com",
                Password = "Password123",
                ConfirmPassword = "Password123"
            };

            // Act
            var result = await controller.Register(model);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User registered successfully", okResult.Value);
            var user = context.Users.FirstOrDefault(u => u.Email == model.Email);
            Assert.NotNull(user);
            Assert.True(BCrypt.Net.BCrypt.Verify("Password123", user.PasswordHash));
        }

        [Fact]
        public void Login_InvalidCredentials_ReturnsUnauthorized()
        {
            var context = GetInMemoryDbContext();
            var tokenServiceMock = new Mock<IJwtTokenService>();
            var controller = new AuthController(context, tokenServiceMock.Object);
            var model = new LoginModel
            {
                Email = "test@example.com",
                Password = "WrongPassword"
            };

            var result = controller.Login(model);

            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("Invalid credentials", unauthorizedResult.Value);
        }

       
    
        [Fact]
public void Login_ValidCredentials_ReturnsOkWithToken()
{
    var context = GetInMemoryDbContext();
    var tokenServiceMock = new Mock<IJwtTokenService>();
    var controller = new AuthController(context, tokenServiceMock.Object);
    var user = new User
    {
        Email = "test@example.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
        Role = "User"
    };
    context.Users.Add(user);
    context.SaveChanges();

    tokenServiceMock.Setup(ts => ts.GenerateToken(user)).Returns("fake-jwt-token");

    var model = new LoginModel
    {
        Email = "test@example.com",
        Password = "Password123"
    };

    var result = controller.Login(model);

    var okResult = Assert.IsType<OkObjectResult>(result);
    var response = Assert.IsType<TokenResponse>(okResult.Value);
    Assert.Equal("fake-jwt-token", response.Token);
}

    public class AnonymousObject
    {
        public string Token { get; set; }
        public AnonymousObject(dynamic obj)
        {
            Token = obj.Token;
        }
    }
} }