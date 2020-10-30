using System;

namespace WebAppDemo.Models
{
    public class Comment
    {
        public int id { get; set; }
        public int postid { get; set; }
        public DateTime commented { get; set; }
        public string content { get; set; }
        public string author { get; set; }
    }
}