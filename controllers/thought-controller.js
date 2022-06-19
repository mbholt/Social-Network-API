const { User, Thought } = require('../models');

const thoughtController = {

    // GET all thoughts
    getAllThoughts(req, res) {
        Thought.find()
        .then(dbThoughtData => {
            res.json(dbThoughtData)
        })
        .catch(err => {
            res.status(400).json(err);
        });
    },

    // GET a single thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            res.status(400).json(err);  
        });
    },

    // POST to create new thought
    // (don't forget to push the created thought's _id to the associated user's thoughts array field)

    // // example data
    // {
    //   "thoughtText": "Here's a cool thought...",
    //   "username": "lernantino",
    //   "userId": "5edff358a0fcb779aa7b118b"
    // }

    createThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findByIdAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No user found with this id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // PUT to update a thought by id
    updateThought({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // DELETE to remove a thought by id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id.' });
                return;
            }

            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: {thoughts: params.id}},
                { new: true }
            );
        })
        .then(userData => {
            res.json({ 
                success: true, 
                message: 'Deleted thought succesfully',
                data: userData
            })
        })
        .catch(err => res.status(400).json(err));
    },

    // /api/thoughts/:thoughtId/reactions

    // POST to create a reaction stored in a single thought's reactions array field
    addReaction({ params }, body, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body }},
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // DELETE to pull and remove a reaction by the reaction's reactionId value
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } }},
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = thoughtController;