import { connect } from '../db.js';
import { getNextSequence } from '../models/Counter.js';
import QuizQuestion from '../models/QuizQuestion.js';
import QuizOption from '../models/QuizOption.js';

const gemstoneQuizData = [
    {
        question_text: 'When you wake up most days, how do you usually feel?',
        step_order: 1,
        options: [
            { option_text: 'Calm but emotionally sensitive', option_tag: 'A', order: 1 },
            { option_text: 'Mentally tired or overthinking', option_tag: 'B', order: 2 },
            { option_text: 'Energetic but restless', option_tag: 'C', order: 3 },
            { option_text: 'Heavy, drained, or low', option_tag: 'D', order: 4 },
        ],
    },
    {
        question_text: 'Which area of life feels most out of balance right now?',
        step_order: 2,
        options: [
            { option_text: 'Love, emotions, or relationships', option_tag: 'A', order: 1 },
            { option_text: 'Mental peace and clarity', option_tag: 'B', order: 2 },
            { option_text: 'Career, money, or growth', option_tag: 'C', order: 3 },
            { option_text: 'Protection and stability', option_tag: 'D', order: 4 },
        ],
    },
    {
        question_text: 'What are you seeking the most at this phase of life?',
        step_order: 3,
        options: [
            { option_text: 'Emotional healing and self-love', option_tag: 'A', order: 1 },
            { option_text: 'Guidance and inner clarity', option_tag: 'B', order: 2 },
            { option_text: 'Confidence, success, and motivation', option_tag: 'C', order: 3 },
            { option_text: 'Grounding and protection', option_tag: 'D', order: 4 },
        ],
    },
    {
        question_text: 'How do you usually react to stressful situations?',
        step_order: 4,
        options: [
            { option_text: 'I get emotionally affected easily', option_tag: 'A', order: 1 },
            { option_text: 'I overthink and feel mentally exhausted', option_tag: 'B', order: 2 },
            { option_text: 'I push myself harder to overcome it', option_tag: 'C', order: 3 },
            { option_text: 'I withdraw and feel low on energy', option_tag: 'D', order: 4 },
        ],
    },
    {
        question_text: 'What kind of energy do you wish to attract right now?',
        step_order: 5,
        options: [
            { option_text: 'Gentle, loving, and soothing', option_tag: 'A', order: 1 },
            { option_text: 'Calm, peaceful, and balanced', option_tag: 'B', order: 2 },
            { option_text: 'Powerful, confident, and abundant', option_tag: 'C', order: 3 },
            { option_text: 'Protective, grounding, and stable', option_tag: 'D', order: 4 },
        ],
    },
    {
        question_text: 'Which affirmation resonates most with you?',
        step_order: 6,
        options: [
            { option_text: '"I am worthy of love and healing."', option_tag: 'A', order: 1 },
            { option_text: '"My mind is calm and clear."', option_tag: 'B', order: 2 },
            { option_text: '"I attract success and abundance."', option_tag: 'C', order: 3 },
            { option_text: '"I am safe, protected, and grounded."', option_tag: 'D', order: 4 },
        ],
    },
    {
        question_text: 'How would you like your crystal to support you?',
        step_order: 7,
        options: [
            { option_text: 'Heal my emotions and bring comfort', option_tag: 'A', order: 1 },
            { option_text: 'Clear my mind and improve focus', option_tag: 'B', order: 2 },
            { option_text: 'Boost my confidence and growth', option_tag: 'C', order: 3 },
            { option_text: 'Protect my energy and keep me grounded', option_tag: 'D', order: 4 },
        ],
    },
];

async function seedGemstoneFinder() {
    try {
        await connect();
        
        console.log('🌟 Seeding Gemstone Finder Quiz Questions...');
        
        // Clear existing data
        await QuizQuestion.deleteMany({});
        await QuizOption.deleteMany({});
        console.log('✓ Cleared existing quiz data');

        // Seed questions and options
        for (const questionData of gemstoneQuizData) {
            const questionId = await getNextSequence('quiz_questions');
            
            // Create question
            const question = await QuizQuestion.create({
                id: questionId,
                question_text: questionData.question_text,
                step_order: questionData.step_order,
            });
            
            console.log(`✓ Created question ${questionData.step_order}: "${questionData.question_text}"`);

            // Create options for this question
            for (const optionData of questionData.options) {
                const optionId = await getNextSequence('quiz_options');
                
                await QuizOption.create({
                    id: optionId,
                    question_id: questionId,
                    option_text: optionData.option_text,
                    option_tag: optionData.option_tag,
                    order: optionData.order,
                });
            }
            
            console.log(`  ├─ Added 4 options (A, B, C, D)`);
        }

        console.log('\n✅ Gemstone Finder Quiz seeded successfully!');
        console.log(`📊 Total: ${gemstoneQuizData.length} questions with 4 options each`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding quiz:', error.message);
        process.exit(1);
    }
}

seedGemstoneFinder();
