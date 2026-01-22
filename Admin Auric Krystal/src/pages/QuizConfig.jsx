import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit2,
    Trash2,
    HelpCircle,
    Loader2,
    AlertCircle,
    X,
    ArrowUp,
    ArrowDown,
    Save
} from 'lucide-react';

const QuizConfig = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [formData, setFormData] = useState({
        question_text: '',
        step_order: 1
    });

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        let isMounted = true;

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/admin/quiz/questions`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (isMounted) {
                    setQuestions(response.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load quiz questions');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchQuestions();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingQuestion) {
                await axios.put(
                    `${API_BASE}/admin/quiz/questions/${editingQuestion.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                );
                setQuestions(prev => prev.map(q => 
                    q.id === editingQuestion.id ? { ...q, ...formData } : q
                ).sort((a, b) => a.step_order - b.step_order));
            } else {
                const response = await axios.post(
                    `${API_BASE}/admin/quiz/questions`,
                    formData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                );
                // Refetch to get the new question with ID
                const updatedQuestions = await axios.get(`${API_BASE}/admin/quiz/questions`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setQuestions(updatedQuestions.data);
            }
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save question');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        
        try {
            await axios.delete(`${API_BASE}/admin/quiz/questions/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete question');
        }
    };

    const moveQuestion = async (question, direction) => {
        const currentIndex = questions.findIndex(q => q.id === question.id);
        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === questions.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const newQuestions = [...questions];
        const temp = newQuestions[currentIndex];
        newQuestions[currentIndex] = newQuestions[newIndex];
        newQuestions[newIndex] = temp;

        // Update step_order for both questions
        try {
            await Promise.all([
                axios.put(
                    `${API_BASE}/admin/quiz/questions/${newQuestions[currentIndex].id}`,
                    { ...newQuestions[currentIndex], step_order: currentIndex + 1 },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                ),
                axios.put(
                    `${API_BASE}/admin/quiz/questions/${newQuestions[newIndex].id}`,
                    { ...newQuestions[newIndex], step_order: newIndex + 1 },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                )
            ]);

            setQuestions(newQuestions.map((q, i) => ({ ...q, step_order: i + 1 })));
        } catch (err) {
            alert('Failed to reorder questions');
        }
    };

    const openModal = (question = null) => {
        if (question) {
            setEditingQuestion(question);
            setFormData({
                question_text: question.question_text,
                step_order: question.step_order
            });
        } else {
            setEditingQuestion(null);
            setFormData({
                question_text: '',
                step_order: questions.length + 1
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
        setFormData({ question_text: '', step_order: 1 });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Quiz Configuration</h1>
                    <p className="text-neutral-500 mt-1">Manage gemstone finder quiz questions</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Question
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="card p-4 border-red-200 bg-red-50">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-red-900">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Card */}
            <div className="card p-6 bg-gradient-to-br from-auric-purple/5 to-auric-purple/10 border-auric-purple/20">
                <div className="flex items-start gap-3">
                    <HelpCircle className="text-auric-purple flex-shrink-0" size={24} />
                    <div>
                        <h3 className="font-semibold text-neutral-900 mb-2">About Quiz Questions</h3>
                        <p className="text-sm text-neutral-600">
                            These questions help customers find the perfect gemstone based on their preferences. 
                            Questions are displayed in order (step 1, 2, 3...) during the quiz flow.
                        </p>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-auric-purple animate-spin" />
                </div>
            ) : questions.length === 0 ? (
                <div className="card p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-600">No questions yet</h3>
                    <p className="text-neutral-500 mt-2">Create your first quiz question to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div key={question.id} className="card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                                {/* Step Number */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-auric-purple to-auric-purple-dark rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-auric-purple/20">
                                        {question.step_order}
                                    </div>
                                </div>

                                {/* Question Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-neutral-900 mb-1">
                                        {question.question_text}
                                    </h3>
                                    <p className="text-xs text-neutral-500">
                                        Question ID: {question.id}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Reorder Buttons */}
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => moveQuestion(question, 'up')}
                                            disabled={index === 0}
                                            className="p-1 text-neutral-600 hover:bg-neutral-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move up"
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveQuestion(question, 'down')}
                                            disabled={index === questions.length - 1}
                                            className="p-1 text-neutral-600 hover:bg-neutral-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move down"
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                    </div>

                                    {/* Edit/Delete */}
                                    <button
                                        onClick={() => openModal(question)}
                                        className="p-2 text-auric-purple hover:bg-auric-purple/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(question.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-neutral-900">
                                {editingQuestion ? 'Edit Question' : 'Add Question'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Question Text *
                                </label>
                                <textarea
                                    name="question_text"
                                    value={formData.question_text}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="input-ghost w-full resize-none"
                                    placeholder="e.g., What is your primary goal for using gemstones?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Step Order *
                                </label>
                                <input
                                    type="number"
                                    name="step_order"
                                    value={formData.step_order}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="input-ghost w-full"
                                    placeholder="1"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    The order in which this question appears in the quiz
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <Save size={18} />
                                    {editingQuestion ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizConfig;
