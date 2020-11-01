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
            string sql = "SELECT salt FROM admins WHERE id==@id LIMIT 1";
            string salt = await _dataAccess.GetFirstOrDefault<string>(sql, new { id = id });
            return salt;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login/{id}")]
        public async Task<IActionResult> Login(int id, [FromBody] string hashed_password)
        {
            var parameters = new
            {
                id = id,
                hashed_password = hashed_password
            };
            string sql = "SELECT COUNT(id) FROM admins WHERE id==@id AND `password`==@hashed_password LIMIT 1";
            bool correct = await _dataAccess.GetFirstOrDefault<bool>(sql, parameters);

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

            var parameters = new
            {
                hashed_password = data.hashed_password,
                salt = data.salt
            };
            string sql = "INSERT INTO admins (`password`, salt) "
                + "VALUES (@hashed_password,@salt)";
            int affected = await _dataAccess.Set(sql, parameters);
            if (affected <= 0)
                return Problem();

            sql = "SELECT id FROM admins "
                + "WHERE `password`==@hashed_password "
                + "AND salt==@salt LIMIT 1";
            int id = await _dataAccess.GetFirstOrDefault<int>(sql, parameters);
            return Ok(id);
        }

        [HttpPost]
        [Route("post")]
        public async Task<IActionResult> InsertPost([FromBody] Post post)
        {
            var parameters = new
            {
                title = post.title,
                content = post.content
            };
            string sql = "INSERT INTO posts (title,content) "
                + "VALUES (@title,@content)";
            int affected = await _dataAccess.Set(sql, parameters);
            return Ok(affected);
        }

        [HttpPut]
        [Route("post")]
        public async Task<IActionResult> UpdatePost([FromBody] Post post)
        {
            var parameters = new
            {
                title = post.title,
                content = post.content,
                id = post.id
            };
            string sql = "UPDATE posts SET "
                + "title=@title, content=@content, modified=datetime('now') "
                + "WHERE id==@id";
            int affected = await _dataAccess.Set(sql, parameters);
            return Ok(affected);
        }

        [HttpDelete]
        [Route("post")]
        public async Task<IActionResult> DeletePost([FromBody] int id)
        {
            string sql = "DELETE FROM posts WHERE id==@id";
            int affected = await _dataAccess.Set(sql, new { id = id });
            return Ok(affected);
        }

        [HttpDelete]
        [Route("comment")]
        public async Task<IActionResult> DeleteComment([FromBody] int id)
        {
            string sql = "DELETE FROM comments WHERE id==@id";
            int affected = await _dataAccess.Set(sql, new { id = id });
            return Ok(affected);
        }
    }
}