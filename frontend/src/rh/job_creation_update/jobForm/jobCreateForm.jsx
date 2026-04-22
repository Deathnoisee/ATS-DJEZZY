// THE DESIGN (html and css)
import React, { useState } from 'react';
import SkillsAndWeightSystem from './SkillsAndWeightSystem';
import { createJob, updateJob } from '../services/jobApi';
//TODO : after submiting, if he changes a value and submit again, it should update the job instead of creating a new one or delete the previous one and create a new one
function JobCreateForm() {
    const [formData, setFormData] = useState({
        title: '',
        jobs_requirement_raw: '',
        job_department: '',
        job_description: '',
        using_priority: false,
        macro_weight: 0.5,
        micro_weight: 0.5,
        location: 'Algeria',
    });
    const [jobUuid, setJobUuid] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;
        const clampedValue = Math.max(0, Math.min(1, numValue));
        setFormData(prev => {
            if (name === 'macro_weight') {
                return { ...prev, macro_weight: clampedValue, micro_weight: (1 - clampedValue).toFixed(2) };
            } else if (name === 'micro_weight') {
                return { ...prev, micro_weight: clampedValue, macro_weight: (1 - clampedValue).toFixed(2) };
            } else {
                return { ...prev, [name]: value };
            }
        })
    };
    const handleIfPriorityChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!jobUuid) {
                const newJob = await createJob(formData);
                setJobUuid(newJob.uuid);
            } else {
                await updateJob(jobUuid, formData);
                console.log("Job already created, consider updating it instead of creating a new one.");
            }
        } catch (error) {
            console.error("Error creating job:", error);
        }
    };

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
                                value={formData.title}
                                onChange={handleChange} />
                            <label htmlFor="job_department">Job Department:</label>
                            <select
                                id="job_department"
                                name="job_department"
                                value={formData.job_department}
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
                                value={formData.job_description}
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
                                value={formData.jobs_requirement_raw}
                                onChange={handleChange}
                            >
                            </textarea>
                        </div>

                        <div>
                            <label>Using Custom Weight:</label>
                            <input
                                type="checkbox"
                                name="using_priority"
                                checked={formData.using_priority}
                                onChange={handleIfPriorityChange}
                            >
                            </input>
                        </div>

                        {formData.using_priority && (
                            <div>
                                <label>Macro Weight:</label>
                                <input
                                    type="range"
                                    name="macro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={formData.macro_weight}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    name="macro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={formData.macro_weight}
                                    onChange={handleChange}
                                />
                                <label>Micro Weight:</label>
                                <input
                                    type="range"
                                    name="micro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={formData.micro_weight}
                                    onChange={handleChange} />
                                <input
                                    type="number"
                                    name="micro_weight"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={formData.micro_weight}
                                    onChange={handleChange} />
                            </div>)}

                        <button type="submit">Submit</button>
                    </form>
                </div>

                {jobUuid ? (
                    <div>
                        <h2>Job Created! Now assign skills</h2>
                        <SkillsAndWeightSystem job_uuid={jobUuid} using_priority={formData.using_priority} onParentSave={handleSubmit} />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
export default JobCreateForm;