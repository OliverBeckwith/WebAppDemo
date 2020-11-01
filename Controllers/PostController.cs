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
        public PostController(DataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }

        [HttpGet]
        public async Task<List<Post>> GetPosts()
        {
            string sql = "SELECT posts.*, counts.count as `comment_count` FROM posts "
                + "LEFT OUTER JOIN ( "
                    + "SELECT Count(post_id) as `count` FROM comments "
                + ") as counts ON posts.id==counts.count";
            List<Post> posts = await _dataAccess.Get<Post>(sql);
            return posts;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<Post> GetPost(int id)
        {
            string sql = "SELECT * FROM posts WHERE id==@id LIMIT 1";
            Post post = await _dataAccess.GetFirstOrDefault<Post>(sql, new { id = id });
            return post;
        }

        [HttpGet]
        [Route("{post_id}/comments")]
        public async Task<Comment[]> GetComments(int post_id)
        {
            string sql = "SELECT * FROM comments WHERE post_id==@post_id ORDER BY commented ASC";
            var comments = await _dataAccess.Get<Comment>(sql, new { post_id = post_id });
            return comments.ToArray();
        }

        [HttpPost]
        [Route("{post_id}/newcomment")]
        public async Task<IActionResult> InsertComment(int post_id, [FromBody] Comment comment)
        {
            var parameters = new
            {
                post_id = post_id,
                content = comment.content,
                author = comment.author
            };
            string sql = "INSERT INTO comments (post_id, content, author) "
                + "VALUES (@post_id,@content,@author)";
            int affected = await _dataAccess.Set(sql, parameters);
            return Ok(affected);
        }
    }
}