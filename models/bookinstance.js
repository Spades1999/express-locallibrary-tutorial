const { DateTime } = require('luxon');

//IT REPRESENT A SPECIFIC COPY OF A BOOK THAT SOMEONE MIGHT BORROW
//AND INCLUDES INFORMATIONS ABOUTH WHETHER THE COPY IS AVAILABLE,
//ON WHAT DATE IT IS EXPECTED BACK, AND VERSION DETAILS
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], //set the allowed values of a string
        default: 'Maintenance' //set the default status for newly created bookinstances
    },
    due_back: { type: Date, default: Date.now },
});

//virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
    return `/catalog/bookinstance/${this._id}`;
});

//we use fromJSDate() to import JavaScript date string 
//and toLocaleString() to output the date in DATE_MED format in English: Dec 2nd, 2022
BookInstanceSchema.virtual('due_back_formatted').get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);