# WebAppDemo
### By Oliver Beckwith
Demonstration of my ability with ASP.NET MVC, Data Access, Admin, React

Built upon a stripped "Asp.Net Core with React" template as described [here](https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react)

---

## App Features
A simple forum app that allows admins to create posts that anyone can comment on. The client-side app is made through React and uses Reactstrap to allow all sizes of display to have a comfortable experience.
 - Admin
   - /admin/ pages only accessible to admins
   - Login with id and password
   - Create new posts
   - Edit existing posts
     - The button is only visible for authenticated clients
     - Adds "Last Modified" datetime to posts 
   - Create new admin logins
   - Delete comments on posts
 - Public
   - View posts and navigate to individual post pages
   - Leave comments on posts (25 character limit for names and 400 character limit for comments)

## Backend Features
The backend is an ASP.NET Core API using appropriate routing and authentication to perform data access. Makes use of both custom routing and request methods ("GET", "POST", etc.)
 - Authentication
   - Login with password hashing using salts (SHA-512)
   - /api/admin methods only accessible to authorised clients
 - `SQLite3` database accessed via [`Dapper`](https://github.com/StackExchange/Dapper)
   - SQL injection safe using parameters rather than string concatenation
