import React, { useState, useEffect } from 'react';
import { fetchJobData, updateJob } from '../services/jobApi';
import MDEditor from '@uiw/react-md-editor';
import SkillsAndWeightSystem from './SkillsAndWeightSystem';
import { useOutletContext } from 'react-router-dom';

// TODO (JUST TO LOOK IN ORANGE) : 039cad1f-edc4-4df6-a03b-50d513bcae5f
function UpdateJobForm({ job_uuid }) {
    const { theme, toggleTheme } = useOutletContext();
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
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


    const HandleSelectChange = (e) => {
        handleChange(e);
        e.target.blur();
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateJob(job_uuid, jobData);
            //TODO ADD NAVIGATION TO THE JOB DETAIL PAGE AFTER UPDATING
        } catch (error) {
            console.error("Error updating job:", error);
        }
    }
    const handleNext = async (e) => {
        e.preventDefault();

        const form = e.target.closest('form');
        if (form && !form.reportValidity()) {
            return;
        }

        if (index == 1) {
            try {
                if (job_uuid) {
                    await updateJob(job_uuid, jobData);
                    setIndex(index + 1);
                } else {
                    alert("Job UUID is missing. Cannot save data.");
                    console.error("Job UUID is missing. Cannot save data.");
                }
            } catch (error) {
                console.error("Error updating job:", error);
                alert("An error occurred while updating the job. Please try again.");
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
    const handleMarkdownChange = (name) => (value) => {
        setJobData(prev => ({
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
                                                value={jobData.title}
                                                onChange={handleChange} />
                                        </div>

                                        <div className="job-information-location">
                                            <label htmlFor="Location" className="hr-form-label">Location:</label>
                                            <select className="Double-form-input-menu"
                                                id="location"
                                                name="location"
                                                value={jobData.location}
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
                                            value={jobData.job_description}
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
                                    <span className="job-details-description-title">Candidate Details</span>
                                    <p className="job-details-description-text">Give some details for the candidate about the job</p>
                                </div>

                                <div className="job-information-body">

                                    <div className="job-information-department">
                                        <label htmlFor="job_department" className="job-information-label">Job Department:</label>
                                        <select className="Double-form-input-menu"
                                            id="job_department"
                                            name="job_department"
                                            value={jobData.job_department}
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
                                            value={jobData.jobs_requirement_raw}
                                            onChange={handleMarkdownChange('jobs_requirement_raw')}>
                                        </MDEditor>
                                    </div>

                                    <div className="job-information-macro-micro">
                                        <div className="weight-pie-container">
                                            <span className="weight-legend">
                                                {Math.round(jobData.micro_weight * 100)}% Micro
                                            </span>
                                            <div
                                                className="weight-pie-chart"
                                                style={{
                                                    background: `conic-gradient(var(--primary) 0% ${jobData.macro_weight * 100}%, #e0dcd6 ${jobData.macro_weight * 100}% 100%)`
                                                }}
                                            ></div>
                                            <span className="weight-legend" style={{ color: "var(--primary)" }}>
                                                {Math.round(jobData.macro_weight * 100)}% Macro
                                            </span>
                                        </div>
                                        <div className="job-information-macro-weight-container ">
                                            <input className="job-information-macro-weight-slider"
                                                type="range"
                                                name="macro_weight"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={jobData.macro_weight}
                                                onChange={handleChange}
                                            />
                                            <input className="job-information-macro-weight-input"
                                                type="number"
                                                name="macro_weight"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={jobData.macro_weight}
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
                    {job_uuid && (index == 2) && (
                        <SkillsAndWeightSystem jobUuid={job_uuid} onParentSave={handleSubmit} handleBack={handleBack} />
                    )}
                </form>
            </div>


        </div>)
}

export default UpdateJobForm;