import { browserHistory } from 'react-router';

export const handleSendMessage = async (user) => {
    const conversationId = await Meteor.user().findExistingConversationWithUsers([user._id]) || `new?toUsername=${user.username}`;
    if (conversationId) {
        browserHistory.push(`/messages/${conversationId}`);
    }
}
