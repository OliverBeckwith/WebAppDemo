using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using WebAppDemo.Data;
using System.Threading.Tasks;

namespace WebAppDemo.Controllers
{
    [Authorize]
    [Route("admin")]

    public class AdminController : ControllerBase
    {
        private DataAccess _dataAccess;
        public AdminController()
        {
            //Placeholder
            string connString = "Data Source=webappdemo.db";

            _dataAccess = new DataAccess(connString);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<string> GetHashSalt(int id)
        {
            string sql = $"SELECT salt FROM admins WHERE id=={id} LIMIT 1";
            string salt = await _dataAccess.GetFirstOrDefault<string>(sql);
            return salt;
        }

        [HttpPost]
        [AllowAnonymous]
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

        [HttpGet]
        public string GetTest()
        {
            return "This is working";
        }
    }
}