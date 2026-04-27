import React, { useState, useEffect } from 'react';
import { fetchSkills, updateSkills, createSkillsBulk, deleteSkill, updateJob } from '../services/jobApi';

function SkillsAndWeightSystem({ jobUuid, onParentSave, handleBack }) {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [using_priority, setUsingPriority] = useState(false);
    const remainingWeight = (1 - skills.reduce((sum, skill) => sum + skill.weight, 0)) * 100;
    const addSkill = () => {
        const newSkill = {
            uuid: `new-${Date.now()}-${Math.random()}`, // Added unique temporary uuid
            skill: '',
            weight: 0.5,
            experience: 0,
            is_required: false,
            isNew: true
        };
        setSkills(prevSkills => [...prevSkills, newSkill]);
    };

    const handleNameChange = (uuid, newName) => {
        setSkills(prevSkills =>
            prevSkills.map(skill =>
                skill.uuid === uuid ? { ...skill, skill: newName } : skill
            )
        );
    };

    const handleWeightChange = (uuid, newWeightRaw) => {
        const newWeight = parseFloat(newWeightRaw) || 0;
        setSkills(prevSkills => {
            const targetSkill = prevSkills.find(s => s.uuid === uuid);
            if (!targetSkill) return prevSkills;


            const otherSkillsTotal = prevSkills
                .filter(s => s.uuid !== uuid)
                .reduce((sum, s) => sum + s.weight, 0);

            const maxAllowed = 1.0 - otherSkillsTotal;
            const clampedWeight = Math.min(newWeight, maxAllowed);

            if (newWeight <= maxAllowed) {
                return prevSkills.map(skill =>
                    skill.uuid === uuid ? { ...skill, weight: clampedWeight } : skill
                );
            }

            const excess = newWeight - maxAllowed;

            const otherSkills = prevSkills.filter(s => s.uuid !== uuid && s.weight > 0);
            const totalOtherWeight = otherSkills.reduce((sum, s) => sum + s.weight, 0);

            if (totalOtherWeight === 0) {
                return prevSkills;
            }

            const updatedSkills = prevSkills.map(skill => {
                if (skill.uuid === uuid) {
                    return { ...skill, weight: newWeight };
                }
                if (skill.weight > 0) {

                    const reduction = (skill.weight / totalOtherWeight) * excess;
                    return { ...skill, weight: Math.max(0, skill.weight - reduction) };
                }
                return skill;
            });
            updatedSkills.forEach(s => {
                if (s.uuid !== uuid) {
                    s.weight = parseFloat(s.weight.toFixed(2));
                }
            });
            return updatedSkills;
        });
    };
    const handleExperienceChange = (uuid, newExperience) => {
        newExperience = parseFloat(newExperience) || 0;
        setSkills(prevSkills =>
            prevSkills.map(skill =>
                skill.uuid === uuid ? { ...skill, experience: newExperience } : skill
            )
        )
    }
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const realSkills = skills.filter(s => !s.isNew);
            const newSkills = skills.filter(s => s.isNew && s.skill.trim() !== '');

            if (realSkills.length > 0) {
                const updatedRealSkills = realSkills.map(s => ({
                    ...s,
                    weight: parseFloat(s.weight.toFixed(2))
                }));
                await updateSkills({ skill: updatedRealSkills });
            }

            let total_weight = skills.reduce((sum, skill) => sum + skill.weight, 0);
            if (total_weight > 1 && using_priority) {
                alert('Total weight cannot exceed 1. Please adjust the weights.');
                return;
            } else if (total_weight < 1 && using_priority) {
                alert('Total weight cannot be less than 1. Please adjust the weights.');
                return;
            }

            if (newSkills.length > 0) {
                const formattedNewSkills = newSkills.map(s => ({
                    skill: s.skill,
                    weight: parseFloat(s.weight.toFixed(2)),
                    experience: s.experience,
                    is_required: s.is_required,
                    with_ai: false
                }));
                await createSkillsBulk(jobUuid, formattedNewSkills);
            }

            const refreshedSkills = await fetchSkills(jobUuid);
            setSkills(refreshedSkills);
            if (onParentSave) {
                console.log("saved onParent");
                onParentSave(e);
            }
            alert('Changes saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save');
        }
    };
    const handlePriorityToggle = async () => {
        const newValue = !using_priority;
        setUsingPriority(newValue);

        try {
            await updateJob(jobUuid, { using_priority: newValue });
        } catch (error) {
            console.error("Failed to update job priority setting:", error);
            alert("Failed to update job priority setting");
        }
    }


    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await fetchSkills(jobUuid);
                setSkills(data);
            } catch (error) {
                console.error("Error fetching skills:", error);
            } finally {
                setLoading(false);
            }
        }
        loadSkills();
    }, [jobUuid]);
    if (loading) {
        return <div>Loading skills...</div>;
    }

    return (
        <div className="job-containers">
            <div className="job-header">
                <h2>Job Created! Now assign skills</h2>
                <div className="line-between"></div>

            </div>

            <div className="job-details-body">
                <div className="job-details-description">
                    <span className="job-details-description-title">Skills & Experiences</span>
                    <p className="job-details-description-text">Give some details for the candidate about the job</p>
                </div>
                <div className="job-information-body">

                    <div className="priority-toggle-container">
                        <span className="priority-toggle-label">Using Custom Weight:</span>
                        <button
                            type="button"
                            className={`priority-toggle ${using_priority ? 'active' : ''}`}
                            onClick={handlePriorityToggle}
                            aria-pressed={using_priority}
                        >
                            <span className="toggle-track">
                                <span className="toggle-thumb" />
                            </span>
                        </button>
                    </div>

                    <div className="job-header-subtitle-container">
                        <span className="job-header-subtitle"> Remaining Weight : {remainingWeight.toFixed(2)}% - Factors need to add up to 100%</span>
                    </div>

                    <div className="skills-list-container">
                        <div className="skills-grid-header">
                            <span>Skills</span>
                            <span>Experience</span>
                            {using_priority && <span>Weight</span>}
                        </div>

                        <div className="skills-list">
                            {skills.map((skill) => (
                                <div className="skill-row" key={skill.uuid}>
                                    <div className="skill-name">
                                        {skill.isNew ? (
                                            <input
                                                type="text"
                                                className="skill-name-input"
                                                placeholder="Enter skill..."
                                                value={skill.skill}
                                                onChange={(e) => handleNameChange(skill.uuid, e.target.value)}
                                            />
                                        ) : (
                                            <span>{skill.skill}</span>
                                        )}
                                    </div>

                                    <div className="skill-experience">
                                        <input
                                            type="number"
                                            className="experience-box-input"
                                            value={skill.experience}
                                            onChange={(e) => handleExperienceChange(skill.uuid, e.target.value)}
                                        />
                                    </div>

                                    {using_priority && (
                                        <div className="skill-weight-container">
                                            <div className="slider-wrapper">
                                                <input
                                                    type="range"
                                                    className="skill-slider"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    value={skill.weight}
                                                    onChange={(e) => handleWeightChange(skill.uuid, e.target.value)}
                                                />
                                            </div>
                                            <div className="weight-percentage-box">
                                                {Math.round(skill.weight * 100)}%
                                            </div>
                                        </div>
                                    )}

                                    <button className="delete-skill-btn" onClick={() => {
                                        if (skill.isNew) {
                                            setSkills(prevSkills => prevSkills.filter(s => s.uuid !== skill.uuid));
                                        } else {
                                            deleteSkill(skill.uuid);
                                            setSkills(prevSkills => prevSkills.filter(s => s.uuid !== skill.uuid));
                                        }
                                    }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="button" onClick={addSkill}>+ Add Skill Row</button>

                </div>
            </div>

            <div className="job-information-buttons-container">
                <button onClick={handleBack} className="hr-btn-ghost">Back - Requirements</button>
                <button onClick={handleSave} className="hr-btn">Save Changes</button>
            </div>
        </div>
    );
}
export default SkillsAndWeightSystem;