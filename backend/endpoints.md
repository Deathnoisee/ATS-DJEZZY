# ALL THE POSSIBLE END POINTS

## USERS RELATED END POINTS

- [x] Register Candidate : **/authentication/register/candidate/** POST
- [x] Register HR : **/authentication/register/hr/** POST
- [x] Login : **/auth/jwt/create/** POST
- [x] Refresh token : **/auth/jwt/refresh/** POST
- [x] Get Self Profile : **/auth/users/me/** GET
- [x] Update Self Profile : **/auth/users/me/** PATCH
- [x] Delete self : **authentication/candidate/delete-me/** DELETE
- [x] List All Users (HR) **authentication/hr/users** GET
- [x] Update Any User (HR) **authentication/hr/update/\<uuid>** UPDATE PATCH
- [x] Delete Any User (HR) **authentication/hr/users/\<uuid>** DELETE

## HR RELATED END POINTS

### Macro is requirement Micro is skills

#### Job_data

- [x] Create Job : **hr/jobs/create/** POST
- [x] Fetch all jobs : **hr/jobs/** GET
- [x] Fetch specific job : **hr/jobs/\<uuid>/** GET
- [x] Delete an open job (Soft Deletion) : **hr/jobs/\<uuid>/delete** DELETE
- [x] Update Job Data : **hr/jobs/\<uuid>/update/** PATCH/UPDATE

---

#### Job_skills

- [x] Create Job requirements Bulk (usually we will get only 1): **hr/skills/bulk/\<uuid:job_uuid>/create/** POST
- [x] Fetch all job_skills with job UUID : **hr/skills/\<uuid:job_uuid>/** GET
- [x] Update specific job_skills with UUID : **hr/skills/\<uuid:uuid>/update/** UPDATE PATCH
- [x] Delete a specific job_skill with UUID : **hr/skills/\<uuid>/delete/** DELETE

---

#### Job_requirements

- [x] Create minimum_requirements BULK : **hr/requirements/bulk/\<uuid:job_uuid>/create/** POST
- [x] Fetch all minimum_requirements with job uuid : **hr/requirements/\<uuid:job_uuid>/** GET
- [x] Update minimum_requirements with job UUID: **hr/requirements/\<uuid>/update/** UPDATE PATCH
- [x] Delete a specific minimum_requirements with uuid : **hr/requirements/\<uuid>/delete/** DELETE

---

## Candidate related endpoints

### 1 resume to apply for all

#### Applications endpoints

- [x] Create application : **candidate/application/create** POST
- [x] Fetch All applications for user : **candidate/application/** GET
- [x] Fetch specified application for user **candidate/application/\<uuid>/** GET
- [x] Fetch All application for job (hr) : **candidate/aplication/hr/\<uuid:job_uuid>/** GET
- [x] Fetch Top 5 for job (hr): **candidate/application/hr/\<uuid:job_uuid>/Top** GET
- [x] Update Application : **candidate/application/\<uuid>/update/** UPDATE PATCH
- [x] Delete Application : **candidate/application/\<uuid>/delete** DELETE (soft deletion)

#### Candidate resumes endpoints

- [x] Create candidate resume : **candidate/candidate_resume/create** POST
- [x] Fetch all resumes (hr): **candidate/candidate_resume/** GET
- [x] Fetch Candidate resume (any): **candidate/candidate_resume/\<uuid:user_uuid>/** GET
- [x] Delete Candidate resume : **candidate/candidate_resume/delete/** DELETE
- [x] Delete any candidate resume : **candidate/candidate_resume/\<uuid:user_uuid>/delete/** DELETE

### Stats Endpoints

- [x] Total Jobs: **hr/stats/?type=total_jobs** GET
- [x] Total Open Jobs: **hr/stats/?type=total_open_jobs** GET
- [x] Total Closed Jobs: **hr/stats/?type=total_closed_jobs** GET
- [x] Total Jobs by Department: **hr/stats/?type=total_jobs_by_department&department=<department_name>** GET
- [x] Total Jobs by Location: **hr/stats/?type=total_jobs_by_location&location=<location_name>** GET
- [x] Total Users: **hr/stats/?type=total_users** GET
- [x] Total Applications: **hr/stats/?type=total_applications** GET
- [x] Most Applied Jobs: **hr/stats/?type=most_applied_jobs** GET

- [x] Job Total Applications: **hr/stats/jobs/<uuid:job_uuid>/?type=total_applications** GET
- [x] Job Application Status Distribution: **hr/stats/jobs/<uuid:job_uuid>/?type=application_status_distribution** GET
- [x] Job Average Scores: **hr/stats/jobs/<uuid:job_uuid>/?type=average_scores** GET
- [x] Job Best 5 Applications: **hr/stats/jobs/<uuid:job_uuid>/?type=best_5** GET

## FIRST ADMIN ACCOUNT

    email = admin@rh.com
    password = admin123
    username = admin
    last_name = admin

## important VIEWS

![alt text](image.png)
