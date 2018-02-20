import { Meteor } from 'meteor/meteor';
import { Cloudinary } from 'meteor/socialize:cloudinary';

const { cloudinary: clSettingsPublic } = Meteor.settings.public;
const { cloud_name, api_key } = clSettingsPublic;

Cloudinary.config({
    cloud_name,
    api_key,
});
