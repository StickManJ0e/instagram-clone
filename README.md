Hosting link: https://instagram-clone-57e2b.web.app

Note: Current hosting site may pop up with a security warning. It is safe to test the but don't use any actual passports or sensitive information since security for protecting your data is ameature and limited. 

# Plan

## Features

### Profile
- [x] Login and authenticate (Google or manual)
    - Add alert if email or username already in use
- [x] Follow or unfollow people
- [x] Show display name, username, # followers, # following, # posts, description, posts
    - [x] Have edit profile button
- [x] Can change username and password

### Posts 
- [x] Make Image post with text.
    - Use `Firestore`
- [x] Post Options
    - [x] Unfollow Poster, go to post
    - [x] Delete post, edit post, go to post
- [x] Like posts.
- [x] Comment on Posts.
- Share Posts via messages.

### Search
- [x] Search for other users and update results realtime
    - Use `Firestore`

### Messaging
-[x]  Message other users realtime
    - Use `Firestore`

### Notifications
- Get notifications if:
    - [x] Posts liked, commented
    - [x] Followed by other users
        - Use `Firestore`

### Settings
- [x] Change username, password
- [x] Change profile picture, bio and display name

### Themes
- Light and dark modes

### Accessibility 
- Built for mobile


# Firestore Database Planning

## Users
### Users
    - unique user
        - UserInfo: Username, Display name, Profile Picture, User UID, email, profile description, created date;
        - Messages
            - Each conversation
        - Posts
        - Liked
        - Following

### Posts
    - unique post
        - PostInfo: User UID, image data, caption, aspect ratio, timestamp
