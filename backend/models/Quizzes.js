import mongoose from 'mongoose';


const questionSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Quiz = mongoose.model('Quiz', questionSchema);
export default Quiz;