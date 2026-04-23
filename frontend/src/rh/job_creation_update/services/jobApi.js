// API CALLS (similar to serializers.py but for frontend)

const API_JOB_DATA = "/hr/jobs/";
const API_SKILLS = "/hr/skills/";

async function createJob(data) {
    const response = await fetch(API_JOB_DATA + "create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
        const errorMessage =
            result.detail || result.non_field_errors?.[0] || "Request failed";
        throw new Error(errorMessage);
    }
    return result;
}
async function fetchSkills(job_uuid) {
    const response = await fetch(API_SKILLS + job_uuid + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
    const result = await response.json();
    if (!response.ok) {
        const errorMessage =
            result.detail || result.non_field_errors?.[0] || "Request failed";
        throw new Error(errorMessage);
    }
    return result;
}
async function updateWeights(uuid, data) {
    const response = await fetch(API_SKILLS + uuid + "/update/",
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(data),
        });
    const result = await response.json();
    if (!response.ok) {
        const errorMessage = result.detail || result.non_field_errors?.[0] || "Request failed";
        throw new Error(errorMessage);
    }
    return result;
}
async function createSkillsBulk(job_uuid, skillsArray) {
    const response = await fetch(`${API_SKILLS}bulk/${job_uuid}/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ skill: skillsArray }),
    });
    const result = await response.json();
    if (!response.ok) {
        const errorMessage = result.detail || result.non_field_errors?.[0] || 'Request failed';
        throw new Error(errorMessage);
    }
    return result;
}
export { createJob, fetchSkills, updateWeights, createSkillsBulk };
