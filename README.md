# URL-Shortener-Api

 A URl shortener with user authentication
 
#Link to postman documentation: 
https://documenter.getpostman.com/view/20417456/2s83mdKPxL

### Endpoints
The following endpoints are available on this server:
- `/api/v1/users/sigup`: registers a new user.
- `/api/v1/users/login`: logs in a user.
- `/api/v1/users/logout`: logs out a user(protected route).
- `/api/v1/users/forgotPassword`: to get reset password url.
- `/api/v1/users/resetPassword/:token`: to reset password.
- `/api/v1/url/`: to get url shorten history
- `/api/v1/url/shortenUrl`: to shorten a url
- `/api/v1/url/:id`: to delete a shortened url 

