import { Profile } from 'meteor/socialize:user-profile';
import SimpleSchema from 'simpl-schema';

Profile.attachSchema(new SimpleSchema({
    firstName: {
        type: String,
        optional: true,
    },
    lastName: {
        type: String,
        optional: true,
    },
    about: {
        type: String,
        optional: true,
    },
}));

Profile.methods({
    fullName() {
        return this.firstName && this.lastName && `${this.firstName} ${this.lastName}`;
    },
});
