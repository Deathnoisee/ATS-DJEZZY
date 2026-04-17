# ALL THE POSSIBLE END POINTS

## USERS RELATED END POINTS

- Register Candidate : /authentication/register/candidate/ POST
- Register HR : /authentication/register/hr/ POST
- Login : /auth/jwt/create/ POST
- Refresh token : /auth/jwt/refresh/ POST
- Get Self Profile : /auth/users/me/ GET
- Update Self Profile : /auth/users/me/ PATCH
- Delete self : authentication/candidate/delete-me/ DELETE
- List All Users (HR) authentication/hr/users GET (TODO)
- Update Any User (HR) authentication/hr/update/\<uuid>/update/
- Delete Any User (HR) authentication/hr/users/\<uuid>/delete/

## HR RELATED END POINTS

    (ALL TO DO)

- [ ] Create Job : job/jobs_data/create POST
- [ ]Fetch all jobs : job/jobs_data/all GET
- [ ]Fetch specific job : job/jobs_data/\<uuid> GET
- [ ]Delete an open job : job/jobs_data/\<uuid>/delete DELETE
- [ ]Update Job Data : job/jobs_data/\<uuid>/update PATCH/UPDATE
- [ ]Fetch raw job description (for ai) : job/jobs_data/\<uuid>/rawRequirement GET
- [ ]Create Job Requirements : job/job_skills/create POST
- [ ]Fetch specific job_skills with job UUID : job
