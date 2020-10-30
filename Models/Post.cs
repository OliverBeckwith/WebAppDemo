
using System;

namespace WebAppDemo.Models
{
    public class Post
    {
        public int id { get; set; }
        public DateTime posted { get; set; }
        public string title { get; set; }
        public string content { get; set; }
    }
}