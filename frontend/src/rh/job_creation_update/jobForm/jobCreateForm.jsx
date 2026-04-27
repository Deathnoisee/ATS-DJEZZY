// THE DESIGN (html and css)
import React, { useState } from 'react';
import "../../../styles/job_creation_update/JobForm.css";
import SkillsAndWeightSystem from './SkillsAndWeightSystem';
import { createJob, updateJob } from '../services/jobApi';
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
    const [index, setIndex] = useState(0); // state for which page we're in

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
    const HandleSelectChange = (e) => {
        handleChange(e);
        e.target.blur();
    };


    const handleNext = async (e) => {
        e.preventDefault();
        if (index == 1) {
            try {
                if (!jobUuid) {
                    const newJob = await createJob(formData);
                    setJobUuid(newJob.uuid);
                    setIndex(index + 1);
                } else {
                    await updateJob(jobUuid, formData);
                    setIndex(index + 1);
                }
            } catch (error) {
                console.error("Error creating job:", error);
                alert("An error occurred while creating the job. Please try again.");
            }
        } else {
            setIndex(index + 1);
            console.log("forward")

        }
    }
    const handleBack = (e) => {
        e.preventDefault();
        if (index > 0) {
            setIndex(index - 1);
            console.log("back")
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!jobUuid) {
                alert("The job doesnt exist, consider creating it first before adding weights and skills");
            } else {
                await updateJob(jobUuid, formData);
            }
        } catch (error) {
            console.error("Error creating job:", error);
        }
    };

    return (
        <div className="hr-parent-container">

            <div>
                <form>
                    {(index == 0) && (
                        <div className="job-containers">
                            <div className="job-header">
                                <h2>Job Creation Form</h2>
                            </div>

                            <div className="job-details-body">

                                <div className="job-details-description">
                                    <span className="job-details-description-title">Candidate Details</span>
                                    <p className="job-details-description-text">Give some details for the candidate about the job</p>
                                </div>

                                <div className="job-information-body">

                                    <div className="job-information-title-location">

                                        <div className="job-information-title">
                                            <label className="hr-form-label">Job Title:</label>
                                            <input className="Double-form-input"
                                                name="title"
                                                autoComplete="on"
                                                spellCheck={true}
                                                required
                                                placeholder="e.g. Data analyste"
                                                value={formData.title}
                                                onChange={handleChange} />
                                        </div>

                                        <div className="job-information-location">
                                            <label htmlFor="location" className="hr-form-label">Location:</label>
                                            <select className="Double-form-input-menu"
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={HandleSelectChange}
                                                required

                                            >
                                                <option value="">Select a location</option>
                                                <option value="Algeria">Algeria</option>
                                                <option value="France">France</option>
                                                <option value="USA">USA</option>
                                                <option value="Remote">Remote</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="job-information-description">
                                        <label className="job-information-description-label">Job Description:</label>
                                        <textarea className="job-information-description-textarea"
                                            name="job_description"
                                            autoComplete="on"
                                            spellCheck={true}
                                            required
                                            wrap="soft"
                                            placeholder="e.g Write about the job role, responsabilities, some details worth mentioning for the candidates"
                                            value={formData.job_description}
                                            onChange={handleChange}>
                                        </textarea>
                                    </div>

                                    <div className="job-information-next">
                                        <button type="button" onClick={handleNext} >Forward - Requirements</button>
                                    </div>

                                </div>

                            </div>

                        </div>)
                    }
                    {(index == 1) && (
                        <div className="job-containers">
                            <div>
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
                            </div>
                            <div>
                                <button type="button" onClick={handleNext} >Forward - Skills</button>
                                <div></div>
                                <button type="button" onClick={handleBack} >Back - Requirements</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>


            {jobUuid && (index == 2) && (
                <div>
                    <h2>Job Created! Now assign skills</h2>
                    <SkillsAndWeightSystem jobUuid={jobUuid} onParentSave={handleSubmit} handleBack={handleBack} />
                </div>
            )}
        </div>
    );
}
export default JobCreateForm;