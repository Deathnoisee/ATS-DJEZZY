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

- [x] Create Job : **jobs/create/** POST
- [x] Fetch all jobs : **jobs/** GET
- [x] Fetch specific job : **jobs/\<uuid>/** GET
- [x] Delete an open job (Soft Deletion) : **jobs/\<uuid>/delete** DELETE
- [x] Update Job Data : **jobs/\<uuid>/update/** PATCH/UPDATE
- [x] Fetch raw job description (for ai) : **jobs/\<uuid>/rawRequirement/** GET\

---

#### Job_skills

- [x] Create Job requirements Bulk : **skills/bulk/\<uuid:job_uuid>/create/**
- [x] Fetch all job_skills with job UUID : **skills/\<uuid:job_uuid>/** GET
- [x] Update specific job_skills with UUID : **skills/\<uuid:uuid>/update/** UPDATE PATCH
- [x] Delete a specific job_skill with UUID : **skills/\<uuid>/delete/** DELETE

---

#### Job_requirements

- [x] Create minimum_requirements BULK : **requirements/bulk/\<uuid:job_uuid>/create/** POST
- [x] Fetch all minimum_requirements with job uuid : **requirements/\<uuid:job_uuid>/** GET
- [x] Update minimum_requirements with job UUID: **requirements/\<uuid>/update/** UPDATE PATCH
- [x] Delete a specific minimum_requirements with uuid : **requirements/\<uuid>/delete/** DELETE

---

## Candidate related endpoints

### 1 resume to apply for all

#### Applications endpoints

- [ ] Create application : **application/\<uuid:user_uuid>/\<uuid:job_uuid>/create** POST
- [ ] Fetch All applications for user : **application/\<uuid:user_uuid>/** GET
- [ ] Fetch All application for job : **aplication/\<uuid:job_uuid>/** GET
- [ ] Fetch Top 5 for job : **application/\<uuid:job_uuid>/Top** GET
- [ ] Update Application : **application/\<uuid>/update/** UPDATE PATCH
- [ ] Delete Application : **application/\<uuid>/delete** DELETE (soft deletion)

#### Candidate Skills endpoints

- [ ] Create candidate skills bulk : **candidate_skills/\<uuid:user_uuid>/\<uuid:candidate_resume_uuid>/create** POST
- [ ] Fetch all candidate skills : **candidate_skills/\<uuid:user_uuid>/** GET
- [ ] Delete candidate skills bulk : **candidate_skills/\<uuid:user_uuid>/delete** DELETE
- [ ] 

## important VIEWS

![alt text](image.png)
