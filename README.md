# discord-unfuzzle

unfuzzle is a a simple discord bot with some fun message manipulation features.

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
