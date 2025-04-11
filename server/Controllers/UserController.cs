using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetUsers()
    {
        return Ok(_context.Users.ToList());
    }

    [HttpGet("test")]
    public IActionResult TestConnection()
    {
        return Ok(new { message = "Работает!" });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    public IActionResult AddUser(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
        return Ok(user);
    }
}
