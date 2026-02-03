import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VITE_API_BASE_URL from '../config/api';
import {
    Plus,
    HelpCircle,
    Loader2,
    AlertCircle,
    X,
    Save,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const QuizConfig = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [questionOptions, setQuestionOptions] = useState({});
    const [loadingOptions, setLoadingOptions] = useState({});
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [optionFormData, setOptionFormData] = useState({
        option_text: '',
        option_tag: 'A'
    });

    const API_BASE = VITE_API_BASE_URL;

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/admin/quiz/questions`);
            setQuestions(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load quiz questions');
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = async (questionId) => {
        const isExpanded = expandedQuestions[questionId];
        
        setExpandedQuestions(prev => ({
            ...prev,
            [questionId]: !isExpanded
        }));

        // Fetch options if expanding and not already loaded
        if (!isExpanded && !questionOptions[questionId]) {
            await fetchOptions(questionId);
        }
    };

    const fetchOptions = async (questionId) => {
        try {
            setLoadingOptions(prev => ({ ...prev, [questionId]: true }));
            const response = await axios.get(`${API_BASE}/api/admin/quiz/questions/${questionId}/options`);
            setQuestionOptions(prev => ({
                ...prev,
                [questionId]: response.data
            }));
        } catch (err) {
            alert('Failed to load options');
        } finally {
            setLoadingOptions(prev => ({ ...prev, [questionId]: false }));
        }
    };

    const openOptionModal = (questionId, option = null) => {
        setCurrentQuestionId(questionId);
        if (option) {
            setEditingOption(option);
            setOptionFormData({
                option_text: option.option_text,
                option_tag: option.option_tag
            });
        } else {
            setEditingOption(null);
            const existingOptions = questionOptions[questionId] || [];
            setOptionFormData({
                option_text: '',
                option_tag: ['A', 'B', 'C', 'D'].find(tag => 
                    !existingOptions.some(opt => opt.option_tag === tag)
                ) || 'A'
            });
        }
        setIsOptionModalOpen(true);
    };

    const closeOptionModal = () => {
        setIsOptionModalOpen(false);
        setEditingOption(null);
        setCurrentQuestionId(null);
        setOptionFormData({ option_text: '', option_tag: 'A' });
    };

    const handleOptionSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOption) {
                await axios.put(
                    `${API_BASE}/api/admin/quiz/options/${editingOption.id}`,
                    optionFormData
                );
            } else {
                await axios.post(
                    `${API_BASE}/api/admin/quiz/questions/${currentQuestionId}/options`,
                    optionFormData
                );
            }
            await fetchOptions(currentQuestionId);
            closeOptionModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save option');
        }
    };

    const handleDeleteOption = async (optionId, questionId) => {
        if (!window.confirm('Are you sure you want to delete this option?')) return;

        try {
            await axios.delete(`${API_BASE}/api/admin/quiz/options/${optionId}`);
            await fetchOptions(questionId);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete option');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Quiz Configuration</h1>
                    <p className="text-neutral-500 mt-1">Manage gemstone finder quiz questions and options</p>
                </div>
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
                            Click on any question to view and manage its answer options.
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
                    <p className="text-neutral-500 mt-2">Run the seed script to populate quiz questions</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question) => (
                        <div key={question.id} className="card overflow-hidden">
                            {/* Question Header */}
                            <div 
                                className="p-6 cursor-pointer hover:bg-neutral-50 transition-colors"
                                onClick={() => toggleQuestion(question.id)}
                            >
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
                                    </div>

                                    {/* Expand Icon */}
                                    <div className="flex-shrink-0">
                                        {expandedQuestions[question.id] ? (
                                            <ChevronUp className="text-neutral-400" size={24} />
                                        ) : (
                                            <ChevronDown className="text-neutral-400" size={24} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Options Section */}
                            {expandedQuestions[question.id] && (
                                <div className="border-t bg-neutral-50 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-neutral-700">Answer Options</h4>
                                        <button
                                            onClick={() => openOptionModal(question.id)}
                                            className="btn-secondary text-sm flex items-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Option
                                        </button>
                                    </div>

                                    {loadingOptions[question.id] ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="w-8 h-8 text-auric-purple animate-spin" />
                                        </div>
                                    ) : questionOptions[question.id]?.length > 0 ? (
                                        <div className="space-y-3">
                                            {questionOptions[question.id]
                                                .sort((a, b) => a.option_tag.localeCompare(b.option_tag))
                                                .map((option) => (
                                                <div 
                                                    key={option.id}
                                                    className="bg-white rounded-lg p-4 border border-neutral-200 hover:border-auric-purple/30 transition-colors"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-auric-purple/10 text-auric-purple font-bold rounded-lg">
                                                                {option.option_tag}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-neutral-900">{option.option_text}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteOption(option.id, question.id)}
                                                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete option"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-neutral-500">
                                            <p className="text-sm">No options yet. Add options (A, B, C, D) for this question.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Option Modal */}
            {isOptionModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-neutral-900">
                                {editingOption ? 'Edit Option' : 'Add Option'}
                            </h2>
                            <button
                                onClick={closeOptionModal}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleOptionSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Option Text *
                                </label>
                                <textarea
                                    value={optionFormData.option_text}
                                    onChange={(e) => setOptionFormData(prev => ({ ...prev, option_text: e.target.value }))}
                                    required
                                    rows={3}
                                    className="input-ghost w-full resize-none"
                                    placeholder="e.g., I want to attract love and harmony"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Tag (A-D) *
                                </label>
                                <select
                                    value={optionFormData.option_tag}
                                    onChange={(e) => setOptionFormData(prev => ({ ...prev, option_tag: e.target.value }))}
                                    required
                                    className="input-ghost w-full"
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Options will be displayed in order A, B, C, D
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeOptionModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <Save size={18} />
                                    {editingOption ? 'Update' : 'Create'}
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