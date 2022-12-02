const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema ({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
});

//VIRTUAL PROPERTIES ARE DOCUMENT PROPERTIES THAT YOU CAN GET AND SET 
//BUT THAT DO NOT GET PERSISTED TO MongoDB

//virtual for author's full name
AuthorSchema.virtual('name').get(function () {
    //to avoid errors in case where an author does not have either
    //a family name or first name, we want to make sure we handle
    //the exception by returning an empty string for that case
    let fullname = '';
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }
    if (!this.first_name || !this.family_name) {
        fullname = '';
    }
    return fullname;
});

//virtual for author's URL
AuthorSchema.virtual('url').get(function () {
    //we do not use an arrow function as we will need this object
    return `/catalog/author/${this._id}`;
});


AuthorSchema.virtual('lifespan').get(function () {
    return DateTime.fromJSDate(this.date_of_birth, this.date_of_death).toLocaleString(DateTime.DATE_MED);
})
module.exports = mongoose.model('Author', AuthorSchema);