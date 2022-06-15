const { Schema, Model, Types } = require('mongoose');

const ReactionSchema = new Schema ({
    reactionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: new => Types.ObjectId()
    },
    reactionBody: {
        type: string,
        required: true,
        maxlength: 280
    },
    username: {
        type: string,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    }
});

const ThoughtSchema = new Schema ({
    toughtText: {
        type: String,
        required: true,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true
    },
    reactions: [ReactionSchema]
},
    {
        toJSON: {
            virtuals: true,
            getters: true
    },
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;