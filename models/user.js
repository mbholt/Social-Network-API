const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: string,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: string,
        required: true,
        unique: true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Enter a valid email address.']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]},
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
});

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
