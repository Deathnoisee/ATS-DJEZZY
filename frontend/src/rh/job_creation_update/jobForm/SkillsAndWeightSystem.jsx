import react, { useState } from 'react';
import { useEffect } from 'react';
import { fetchSkills, updateWeights, createSkillsBulk } from '../services/jobApi';

function SkillsAndWeightSystem({ job_uuid }) {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false); // New state

    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillWeight, setNewSkillWeight] = useState(0.5);

    const addSkill = () => {
        if (!newSkillName.trim()) return;
        const newSkill = {
            uuid: Date.now().toString(),
            skill: newSkillName,
            weight: parseFloat(newSkillWeight),
            experience: 0,
            is_required: false,
        };
        setSkills(prevSkills => [...prevSkills, newSkill]);
        setNewSkillName('');
        setNewSkillWeight(0.5);
        setShowAddForm(false);
    }
    const handleWeightChange = (uuid, newWeigt) => {
        setSkills(prevSkills =>
            prevSkills.map(skill =>
                skill.uuid == uuid ? { ...skill, weight: parseFloat(newWeigt) } : skill
            )
        )
    }
    const handleSave = async () => {
        try {
            const existingSkills = skills.filter(s => !isNaN(Number(s.uuid)) === false);
            const realSkills = skills.filter(s => s.uuid.length === 36);
            const newSkills = skills.filter(s => s.uuid.length !== 36);

            for (const skill of realSkills) {
                await updateWeights(skill.uuid, { weight: skill.weight });
            }

            if (newSkills.length > 0) {
                await createSkillsBulk(job_uuid, newSkills.map(s => ({
                    skill: s.skill,
                    weight: s.weight,
                    experience: s.experience,
                    is_required: s.is_required,
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
                        <th>Skills</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill) => (
                        <tr key={skill.uuid}>
                            <td>{skill.skill}</td>
                            <td>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    value={skill.weight}
                                    onChange={(e) => handleWeightChange(skill.uuid, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {!showAddForm ? (
                <button onClick={() => setShowAddForm(true)}>Add New Skill</button>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="New skill name"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                    />
                    <input
                        type="range"
                        step="0.01"
                        min="0"
                        max="1"
                        value={newSkillWeight}
                        onChange={(e) => setNewSkillWeight(parseFloat(e.target.value))}
                    />
                    <span>{newSkillWeight}</span>
                    <button onClick={addSkill}>Confirm Add</button>
                    <button onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
            )}

            <button onClick={handleSave}>Save Changes</button>
        </div>
    )
}
export default SkillsAndWeightSystem;