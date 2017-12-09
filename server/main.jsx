import { Meteor } from 'meteor/meteor';

import { publishComposite } from 'meteor/reywood:publish-composite';

import { User } from 'meteor/socialize:user-model';
import { RequestsCollection } from 'meteor/socialize:requestable';
import { FriendsCollection } from 'meteor/socialize:friendships';
import { BlocksCollection } from 'meteor/socialize:user-blocking';
import { LikesCollection } from 'meteor/socialize:likeable';
import { CommentsCollection } from 'meteor/socialize:commentable';
import { PostsCollection } from 'meteor/socialize:postable';

publishComposite(null, {
    find() {
        const user = User.createEmpty(this.userId);
        return user.feed().posts({ sort: { createdAt: -1 }, limit: 10 });
    },
    children: [
        {
            find(post) {
                return post.comments();
            },
            children: [
                {
                    find(comment) {
                        // return comment.likesBy(this.userId);
                    },
                },
            ],
        },
        {
            find(post) {
                // return post.likesBy(this.userId);
            },
        },
    ],
});


Meteor.publish(null, function nullPublish() {
    return [
        // Meteor.users.find(),
        RequestsCollection.find(),
        // FriendsCollection.find(),
        BlocksCollection.find(),
        // MessagesCollection.find(),
        // ConversationsCollection.find(),
        // ParticipantsCollection.find(),
        // PostsCollection.find(),
        // LikesCollection.find(),
        // CommentsCollection.find(),
    ];
}, { is_auto: true });
