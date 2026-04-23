import { useParams } from 'react-router-dom';
import UpdateForm from "../jobForm/updateJobForm";

function UpdateJobPage() {
    const { jobUuid } = useParams();

    return (
        <div>
            <h1>Update Job Page</h1>
            <UpdateForm job_uuid={jobUuid} />
        </div>
    );
}

export default UpdateJobPage;