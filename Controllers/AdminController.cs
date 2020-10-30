using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using WebAppDemo.Data;
using System.Threading.Tasks;
using WebAppDemo.Models;
using Microsoft.AspNetCore.Authentication;

namespace WebAppDemo.Controllers
{
    [Authorize]
    [Route("api/admin")]

    public class AdminController : ControllerBase
    {
        public class PasswordData
        {
            public string hashed_password { get; set; }
            public string salt { get; set; }
        }

        private DataAccess _dataAccess;
        public AdminController(DataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("logincheck")]
        public IActionResult IsLoggedIn()
        {
            try
            {
                if (this.User.Identity.IsAuthenticated)
                    return Ok(true);
            }
            catch (System.Exception e) { }
            return Ok(false);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("salt/{id}")]
        public async Task<string> GetUserSalt(int id)
        {
            string sql = $"SELECT salt FROM admins WHERE id=={id} LIMIT 1";
            string salt = await _dataAccess.GetFirstOrDefault<string>(sql);
            return salt;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login/{id}")]
        public async Task<IActionResult> Login(int id, [FromBody] string hashedpassword)
        {
            string sql = $"SELECT COUNT(id) FROM admins WHERE id=={id} AND `password`=='{hashedpassword}' LIMIT 1";
            bool correct = await _dataAccess.GetFirstOrDefault<bool>(sql);

            if (!correct)
                return Problem("Invalid id and password combination.");

            var claims = new[] {
                new Claim("id", id.ToString())
            };

            ClaimsIdentity identity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme
            );
            ClaimsPrincipal principal = new ClaimsPrincipal(identity);

            return SignIn(principal, CookieAuthenticationDefaults.AuthenticationScheme);
        }

        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            return this.SignOut(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        [HttpPost]
        [Route("createadmin")]
        public async Task<IActionResult> CreateAdmin([FromBody] PasswordData data)
        {
            if (data.hashed_password == null || data.salt == null)
                return Problem();

            string sql = "INSERT INTO admins (`password`, salt) "
                + $"VALUES ('{data.hashed_password}','{data.salt}')";
            int affected = await _dataAccess.Set(sql);
            if (affected <= 0)
                return Problem();

            sql = "SELECT id FROM admins "
                + $"WHERE `password`=='{data.hashed_password}' "
                + $"AND salt=='{data.salt}' LIMIT 1";
            int id = await _dataAccess.GetFirstOrDefault<int>(sql);
            return Ok(id);
        }

        [HttpPut]
        [Route("post")]
        public async Task<IActionResult> UpdatePost(Post post)
        {
            string sql = "UPDATE posts set "
                + $"title='{post.title}', content='{post.content}',modified=datetime('now') "
                + $"WHERE id=={post.id}";
            int affected = await _dataAccess.Set(sql);
            return Ok(affected);
        }

        [HttpDelete]
        [Route("post")]
        public async Task<IActionResult> DeletePost(int id)
        {
            string sql = $"DELETE FROM posts WHERE id=={id}";
            int affected = await _dataAccess.Set(sql);
            return Ok(affected);
        }

        [HttpDelete]
        [Route("comment")] 
        public async Task<IActionResult> DeleteComment([FromBody]int id)
        {
            string sql = $"DELETE FROM comments WHERE id=={id}";
            int affected = await _dataAccess.Set(sql);
            return Ok(affected);
        }
    }
}