// SIMILAR TO URLS.py

import JobForm from "../jobForm/jobCreateForm";

function CreateJobPage() {
    return (
        <div>
            <h1>Create Job Page</h1>
            <JobForm />
        </div>
    );
}
function UpdateJobPage() {
    return (
        <div>
            <h1>Update Job Page</h1>
            <JobForm />
        </div>
    );
}

export default CreateJobPage;