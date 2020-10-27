using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using WebAppDemo.Data;
using System.Threading.Tasks;
using WebAppDemo.Models;

namespace WebAppDemo.Controllers
{
    [Authorize]
    [Route("api/admin")]

    public class AdminController : ControllerBase
    {
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
            try {
                if (this.User.Identity.IsAuthenticated)
                    return Ok(true);
            }
            catch(System.Exception e){}
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
        [Route("login")]
        public async Task<IActionResult> LoginPost(int id, string hashedpassword)
        {
            string sql = $"SELECT COUNT(id) FROM admins WHERE id=={id} AND `password`=={hashedpassword} LIMIT 1";
            bool correct = await _dataAccess.GetFirstOrDefault<bool>(sql);

            if (!correct)
                return this.Problem("Invalid id and password combination.");

            ClaimsIdentity identity = new ClaimsIdentity(new[] { new Claim("id", id.ToString()) });
            ClaimsPrincipal principal = new ClaimsPrincipal(identity);

            return SignIn(principal, CookieAuthenticationDefaults.AuthenticationScheme);
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdatePost(Post post)
        {
            string sql = "UPDATE posts set "
                + $"title='{post.title}', content='{post.content}',author='{post.author}',modified=datetime('now') "
                + $"WHERE id=={post.id}";
            int affected = await _dataAccess.Set(sql);
            return Ok(affected);
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeletePost(int id)
        {
            string sql = $"DELETE FROM posts WHERE id=={id}";
            int affected = await _dataAccess.Set(sql);
            return Ok(affected);
        }
    }
}