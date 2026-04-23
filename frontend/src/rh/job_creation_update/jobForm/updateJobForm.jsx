import React, { useState, useEffect } from 'react';
import { fetchJobData, updateJob } from '../services/jobApi';
import SkillsAndWeightSystem from './SkillsAndWeightSystem';

// TODO (JUST TO LOOK IN ORANGE) : uuid for test is e4345214-c59e-4f8e-973c-f4beccc39f59 
function UpdateJobForm({ job_uuid }) {
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadJobData() {
            if (!job_uuid) {
                setError('No job UUID provided. Cannot load data.');
                console.error('No job UUID provided. Cannot load data.');
                setLoading(false);
                return;
            }
            try {
                const data = await fetchJobData(job_uuid);
                setJobData(data);
                console.log('Fetched job data:', data);
            }
            catch (error) {
                console.error('Error fetching job data:', error);
                setError('Failed to load job data.');
            } finally {
                setLoading(false);
            }
        }
        loadJobData();

    }, [job_uuid]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!jobData) return <div>No job data found.</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;
        const clampedValue = Math.max(0, Math.min(1, numValue));
        setJobData(prev => {
            if (name === 'macro_weight') {
                return { ...prev, macro_weight: clampedValue, micro_weight: (1 - clampedValue).toFixed(2) };
            } else if (name === 'micro_weight') {
                return { ...prev, micro_weight: clampedValue, macro_weight: (1 - clampedValue).toFixed(2) };
            } else {
                return { ...prev, [name]: value };
            }
        })
    }

    const handleIfPriorityChange = (e) => {
        const { checked } = e.target;
        setJobData(prev => ({ ...prev, using_priority: checked }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateJob(job_uuid, jobData);
            //TODO ADD NAVIGATION TO THE JOB DETAIL PAGE AFTER UPDATING
        } catch (error) {
            console.error("Error updating job:", error);
        }
    }

    return (
        <div>
            <div>

                <div>
                    <form onSubmit={handleSubmit}>
                        <p>Job Creation Form</p>

                        <div>
                            <label>Job Title:</label>
                            <input
                                name="title"
                                autoComplete="on"
                                spellCheck={true}
                                required
                                placeholder="Job Title..."
                                value={jobData.title}
                                onChange={handleChange} />
                            <label htmlFor="job_department">Job Department:</label>
                            <select
                                id="job_department"
                                name="job_department"
                                value={jobData.job_department}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a field</option>
                                <option value="computer science">Computer science</option>
                                <option value="healthcare">healthcare</option>
                                <option value="business/finance">Business/Finance</option>
                                <option value="service/logistics">Service/Logistics</option>
                            </select>
                        </div>

                        <div>
                            <label>Job Description:</label>
                            <div></div>
                            <textarea
                                name="job_description"
                                autoComplete="on"
                                spellCheck={true}
                                required
                                wrap="soft"
                                placeholder="Describe the job description for the candidate..."
                                value={jobData.job_description}
                                onChange={handleChange}>
                            </textarea>
                        </div>

                        <div>
                            <label>Job Requirements:</label>
                            <div></div>
                            <textarea
                                name="jobs_requirement_raw"
                                autoComplete="on"
                                spellCheck={true}
                                required
                                wrap="soft"
                                placeholder="Describe the job requirements..."
                                value={jobData.jobs_requirement_raw}
                                onChange={handleChange}
                            >
                            </textarea>
                        </div>

                        <div>
                            <label>Using Custom Weight:</label>
                            <input
                                type="checkbox"
                                name="using_priority"
                                checked={jobData.using_priority}
                                onChange={handleIfPriorityChange}
                            >
                            </input>
                        </div>

                        {jobData.using_priority && (
                            <div>
                                <label>Macro Weight:</label>
                                <input
                                    type="range"
                                    name="macro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={jobData.macro_weight}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="macro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={jobData.macro_weight}
                                    onChange={handleChange}
                                />
                                <label>Micro Weight:</label>
                                <input
                                    type="range"
                                    name="micro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={jobData.micro_weight}
                                    onChange={handleChange} />
                                <input
                                    type="number"
                                    name="micro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={jobData.micro_weight}
                                    onChange={handleChange} />
                            </div>)}

                        <button type="submit">Submit</button>
                    </form>
                </div>

                <div>
                    <h2>Job Created! Now assign skills</h2>
                    <SkillsAndWeightSystem jobUuid={job_uuid} using_priority={jobData.using_priority} onParentSave={handleSubmit} />
                </div>

            </div>
        </div>
    );
}

export default UpdateJobForm;