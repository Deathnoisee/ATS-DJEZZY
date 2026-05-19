// THE DESIGN (html and css)
import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import "../../../styles/job_creation_update/JobForm.css";
import SkillsAndWeightSystem from './SkillsAndWeightSystem';
import { createJob, updateJob } from '../services/jobApi';
function JobCreateForm() {
    const { theme, toggleTheme } = useOutletContext();
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

        if (name === "macro_weight") {
            const numValue = parseFloat(value) || 0;
            const clampedValue = Math.max(0, Math.min(1, numValue));
            setFormData(prev => ({
                ...prev,
                macro_weight: clampedValue,
                micro_weight: parseFloat((1 - clampedValue).toFixed(2))
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const HandleSelectChange = (e) => {
        handleChange(e);
        e.target.blur();
    };


    const handleNext = async (e) => {
        e.preventDefault();

        const form = e.target.closest('form');
        if (form && !form.reportValidity()) {
            return;
        }

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

    const handleMarkdownChange = (name) => (value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value ?? ''
        }));
    };

    return (
        <div className={`hr-parent-container ${theme}-theme`}>
            <div className={`djezzy-header ${theme}-theme`}>
                <label className="switch" aria-label="Toggle theme">
                    <input
                        type="checkbox"
                        className="input__check"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            <div >
                <div className="steps">
                    <div className="step">
                        <div className={index == 0 ? "circle active" : "circle idle"}>1</div>
                        <span className="label">Details</span>
                    </div>
                    <div className={index >= 1 ? "line active" : "line"}></div>

                    <div className="step">
                        <div className={index == 1 ? "circle active" : "circle idle"}>2</div>
                        <span className="label">Requirements</span>
                    </div>
                    <div className={index >= 2 ? "line active" : "line"}></div>

                    <div className="step">
                        <div className={index == 2 ? "circle active" : "circle idle"}>3</div>
                        <span className="label">Skills & weights</span>
                    </div>
                </div>

                <form>
                    {(index == 0) && (
                        <div className="job-containers">
                            <div className="hr-job-header">
                                <h2 className="hr-job-header-title">Candidate Details</h2>
                                <div className="line-between"></div>
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
                                            <label htmlFor="Location" className="hr-form-label">Location:</label>
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
                                        <MDEditor
                                            data-color-mode={theme === 'dark' ? 'dark' : 'light'}
                                            data-color-mode={theme === 'dark' ? 'dark' : 'light'}
                                            name="job_description"
                                            textareaProps={{
                                                autoComplete: 'on',
                                                autoCorrect: 'on',
                                                spellCheck: true,
                                                required: true
                                            }}
                                            preview="edit"
                                            placeholder="e.g. Write about the job role..."
                                            value={formData.job_description}
                                            onChange={handleMarkdownChange('job_description')}>
                                        </MDEditor>
                                    </div>

                                    <div className="job-information-next">
                                        <button type="button" onClick={handleNext} className="hr-btn">
                                            Forward - Requirements
                                        </button>
                                    </div>

                                </div>

                            </div>

                        </div>)
                    }
                    {(index == 1) && (
                        <div className="job-containers">
                            <div className="hr-job-header">
                                <h2 className="hr-job-header-title">Job Requirements</h2>
                                <div className="line-between"></div>
                                <div className="hr-job-header-subtitle-container">
                                    <span className="hr-job-header-subtitle"> Skills are extracted automatically from your requirements text by the AI. </span>
                                </div>
                            </div>
                            <div className="job-details-body">
                                <div className="job-details-description">
                                    <span className="job-details-description-title">Job Details</span>
                                    <p className="job-details-description-text">Give some details for the Ai extraction about the job</p>
                                </div>

                                <div className="job-information-body">

                                    <div className="job-information-department">
                                        <label htmlFor="job_department" className="job-information-label">Job Department:</label>
                                        <select className="Double-form-input-menu"
                                            id="job_department"
                                            name="job_department"
                                            value={formData.job_department}
                                            onChange={HandleSelectChange}
                                            required
                                        >
                                            <option value="">Select a field</option>
                                            <option value="computer science">Computer science</option>
                                            <option value="healthcare">healthcare</option>
                                            <option value="business/finance">Business/Finance</option>
                                            <option value="service/logistics">Service/Logistics</option>
                                        </select>
                                    </div>

                                    <div className="job-information-description">
                                        <label>Job Requirements:</label>
                                        <MDEditor
                                            name="jobs_requirement_raw"
                                            textareaProps={{
                                                autoComplete: 'on',
                                                autoCorrect: 'on',
                                                spellCheck: true,
                                                required: true
                                            }}
                                            wrap="soft"
                                            placeholder="Describe the job requirements..."
                                            value={formData.jobs_requirement_raw}
                                            onChange={handleMarkdownChange('jobs_requirement_raw')}>
                                        </MDEditor>
                                    </div>

                                    <div className="job-information-macro-micro">
                                        <div className="weight-pie-container">
                                            <span className="weight-legend">
                                                {Math.round(formData.micro_weight * 100)}% Micro
                                            </span>
                                            <div
                                                className="weight-pie-chart"
                                                style={{
                                                    background: `conic-gradient(var(--primary) 0% ${formData.macro_weight * 100}%, #e0dcd6 ${formData.macro_weight * 100}% 100%)`
                                                }}
                                            ></div>
                                            <span className="weight-legend">
                                                {Math.round(formData.macro_weight * 100)}% Macro
                                            </span>
                                        </div>
                                        <div className="job-information-macro-weight-container ">
                                            <input className="job-information-macro-weight-slider"
                                                type="range"
                                                name="macro_weight"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={formData.macro_weight}
                                                onChange={handleChange}
                                            />
                                            <input className="job-information-macro-weight-input"
                                                type="number"
                                                name="macro_weight"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={formData.macro_weight}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="job-information-buttons-container">
                                <button type="button" onClick={handleBack} className="hr-btn-ghost" >Back - Requirements</button>
                                <button type="button" onClick={handleNext} className="hr-btn">Forward - Skills</button>
                            </div>
                        </div>
                    )}
                    {jobUuid && (index == 2) && (
                        <SkillsAndWeightSystem jobUuid={jobUuid} onParentSave={handleSubmit} handleBack={handleBack} />
                    )}
                </form>
            </div>


        </div>
    );
}

export default JobCreateForm;