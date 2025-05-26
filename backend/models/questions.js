import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    category: String,
    type: String,
    difficulty: String,
    question: String,
    correct_answer: String,
    incorrect_answers: [String],
});

//module.exports = mongoose.model('Question', questionSchema);
export default mongoose.model('Question', questionSchema);