import React, { useState, useEffect } from 'react';
import { fetchSkills, updateSkills, createSkillsBulk, deleteSkill, updateJob } from '../services/jobApi';

function SkillsAndWeightSystem({ jobUuid, onParentSave, handleBack }) {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [using_priority, setUsingPriority] = useState(false);
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
        setUsingPriority(prev => !prev);
        try {
            await updateJob(jobUuid, { using_priority: using_priority });
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
        <div>
            <div>
                <label>Using Custom Weight:</label>
                <input
                    type="checkbox"
                    name="using_priority"
                    checked={using_priority}
                    onChange={handlePriorityToggle}
                >
                </input>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Skill name</th>
                        {using_priority && <th>Weight</th>}
                        <th>Experience (years)</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill) => (
                        <tr key={skill.uuid}>
                            <td>
                                {skill.isNew ? (
                                    <input
                                        type="text"
                                        placeholder="Enter skill..."
                                        value={skill.skill}
                                        onChange={(e) => handleNameChange(skill.uuid, e.target.value)}
                                    />
                                ) : (
                                    skill.skill
                                )}
                            </td>
                            {using_priority && (
                                <td>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={skill.weight}
                                        onChange={(e) => handleWeightChange(skill.uuid, e.target.value)}
                                    />
                                    <span>{skill.weight}</span>
                                </td>
                            )}
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={skill.experience}
                                    onChange={(e) => handleExperienceChange(skill.uuid, e.target.value)}
                                />
                            </td>
                            <button onClick={() => {
                                if (skill.isNew) {
                                    setSkills(prevSkills => prevSkills.filter(s => s.uuid !== skill.uuid));
                                } else {
                                    deleteSkill(skill.uuid);
                                    setSkills(prevSkills => prevSkills.filter(s => s.uuid !== skill.uuid));
                                }
                            }}>Delete</button>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button type="button" onClick={addSkill}>+ Add Skill Row</button>
            <button onClick={handleSave}>Save Changes</button>
            <div></div>
            <button onClick={handleBack}>Back - Requirements</button>
        </div>
    );
}
export default SkillsAndWeightSystem;