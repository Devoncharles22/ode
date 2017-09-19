// config/auth.js
// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '777640535778015', // your App ID
        'clientSecret'  : '8c2312a494557c461219e7502b385f3d', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'VRpV9B6oxtmYDQFRZExP5zAFX',
        'consumerSecret'    : 'XOWbXseAh70joggQ9UVY5VD5TvSKA1KRVuxVbOtK5ACamH3OTA',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },
};
