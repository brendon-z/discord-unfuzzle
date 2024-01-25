# discord-unfuzzle

unfuzzle is a discord bot with some fun message manipulation and utility features.

## fuzzling
That's a word I made up to describe a peculiar way one of my friends would swap the first and last letters in every word of a sentence.

So `hello there` becomes `oellh ehert`.

## Image association with users
This bot implements a local datastore which contains a `map` data structure that associates a image url with a user id. The goal is for users to be able to associate an image link embed with themselves for use in other bot commands.

Calling the command `/image` with some image URL input stores this `{userID, imageURL}` key pair in the data store.

### Example with `/user`
The `user` command displays a user profile containing details and stats about the user. 

The embed object contains a field, `image`. This lets us embed images with urls!

```js
image: {
  ...(hasImageUrl(target.id)) && {url: imageUrlAssociated},
  ...(!hasImageUrl(target.id)) && {url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Double-compound-pendulum.gif'},
},
```
As you can see, if there's no key pair with the user (target) id, it uses a default image:
https://upload.wikimedia.org/wikipedia/commons/4/45/Double-compound-pendulum.gif

If a key pair exists, the associated URL image is displayed.
<<<<<<< HEAD
=======

## Calendar support ##
This bot supports iCal calendars; this is intended to allow users to upload their calendar links for parsing and processing. Any user can then request everyone's or a specific user's calendar. Great for checking who's on campus and planning meetups.

To add a calendar use `/calendar` and enter your iCal link. The ics file is then downloaded from the link and stored locally for faster retrieval and processing.

To check everyone's calendar, use `campus`, with the option to choose the date to request. Invalid dates will simply return today's events.
To check a specific user, use `where` with a required target username and an optional date similar to above.
>>>>>>> 4921f9091e361c5252fe82434b4d2d940d66b5b5
