using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAppDemo.Data;
using WebAppDemo.Models;

namespace WebAppDemo.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("api/posts")]
    public class PostController : ControllerBase
    {
        private DataAccess _dataAccess;
        public PostController()
        {
            //Placeholder
            string connString = "Data Source=webappdemo.db";

            _dataAccess = new DataAccess(connString);
        }

        [HttpGet]
        public async Task<List<Post>> GetPosts()
        {
            string sql = "SELECT * FROM posts";
            List<Post> posts = await _dataAccess.Get<Post>(sql);
            return posts;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<Post> GetPost(int id)
        {
            string sql = $"SELECT * FROM posts WHERE id=={id} LIMIT 1";
            Post post = await _dataAccess.GetFirstOrDefault<Post>(sql);
            return post;
        }

        [HttpPost]
        [Route("new")]
        public async Task<IActionResult> InsertPost([FromBody] Post post)
        {
            string sql = "INSERT INTO posts (title,content,author,posted) "
                + $"VALUES ('{post.title}','{post.content}','{post.author}',datetime('now'))";
            int affected = await _dataAccess.Set(sql);
            return Ok(affected);
        }
    }
}