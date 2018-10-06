import queryString from 'query-string';
import { browserHistory } from 'meteor/communitypackages:react-router-ssr';


export const addQuery = (rawQuery) => {
    const { location } = browserHistory;
    const query = { ...queryString.parse(location.search), ...rawQuery };
    const newLocation = { ...location };
    newLocation.search = queryString.stringify(query);
    browserHistory.push(newLocation);
};

export const removeQuery = (...queryNames) => {
    const { location } = browserHistory;
    const query = queryString.parse(location.search);
    const newLocation = { ...location };
    queryNames.forEach(q => delete query[q]);
    newLocation.search = queryString.stringify(query);
    browserHistory.push(newLocation);
};
