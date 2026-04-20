import React, { useState, useEffect } from 'react';
import { fetchSkills, updateWeights, createSkillsBulk } from '../services/jobApi';

function SkillsAndWeightSystem({ job_uuid }) {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    const addSkill = () => {
        const newSkill = {
            uuid: `new-${Date.now()}`,
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

    const handleWeightChange = (uuid, newWeight) => {
        setSkills(prevSkills =>
            prevSkills.map(skill =>
                skill.uuid === uuid ? { ...skill, weight: parseFloat(newWeight) } : skill
            )
        )
    }
    const handleExperienceChange = (uuid, newExperience) => {
        setSkills(prevSkills =>
            prevSkills.map(skill =>
                skill.uuid === uuid ? { ...skill, experience: parseInt(newExperience) } : skill
            )
        )
    }
    const handleSave = async () => {
        try {
            const realSkills = skills.filter(s => !s.isNew);
            const newSkills = skills.filter(s => s.isNew && s.skill.trim() !== '');

            for (const skill of realSkills) {
                await updateWeights(skill.uuid, { weight: skill.weight });
            }

            if (newSkills.length > 0) {
                await createSkillsBulk(job_uuid, newSkills.map(s => ({
                    skill: s.skill,
                    weight: s.weight,
                    experience: s.experience,
                    is_required: s.is_required,
                    with_ai: false
                })));
            }

            alert('Changes saved!');
        } catch (error) {
            console.error(error);
            alert('Failed to save');
        }
    };
    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await fetchSkills(job_uuid);
                setSkills(data);
            } catch (error) {
                console.error("Error fetching skills:", error);
            } finally {
                setLoading(false);
            }
        }
        loadSkills();
    }, [job_uuid]);
    if (loading) {
        return <div>Loading skills...</div>;
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Skill name</th>
                        <th>Weight</th>
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
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    max = "10"
                                    value={skill.experience}
                                    onChange={(e) => handleExperienceChange(skill.uuid, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button type="button" onClick={addSkill}>+ Add Skill Row</button>
            <button onClick={handleSave}>Save Changes</button>
        </div>
    );
}
export default SkillsAndWeightSystem;