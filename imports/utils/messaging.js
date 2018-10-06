import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'meteor/communitypackages:react-router-ssr';

const handleSendMessage = async (user) => {
    const conversationId = await Meteor.user().findExistingConversationWithUsers([user._id]) || `new?toUsername=${user.username}`;
    if (conversationId) {
        browserHistory.push(`/messages/${conversationId}`);
    }
};

export default handleSendMessage;
