#Plan

##Features

###Profile
- [x] Login and authenticate (Google or manual)
    - Add alert if email or username already in use
- [x] Follow or unfollow people
- [x] Show display name, username, # followers, # following, # posts, description, posts
    - [x] Have edit profile button
- Can change username and password

###Posts 
- [x] Make Image post with text.
    - Use `Firestore`
- Post Options
    - Unfollow Poster, get link, go to post
    - Delete post, edit post, go to post
- [x] Like posts.
- [x] Comment on Posts.
- Share Posts.

###Messaging
- Message other users realtime
    - Use `Firestore`

###Notifications
- Get notifications if:
    - Posts liked, commented
    - Followed or messages by other users
        - Use `Firestore`

###Search
- Search for other users and update results realtime
    - Use `Firestore`

###Settings
- Change username, password, email, notifications
- [x] Change profile picture, bio and display name

###Themes
- Light and dark modes

###Accessibility 
- Built for mobile


#Firestore Database Planning

##Users
- Users
    -> unique user
        - UserInfo: Username, Display name, Profile Picture, User UID, email, profile description, created date;
        -> Messages
            - Each conversation
        -> Posts

- Posts
    -> unique post
    - PostInfo: User UID, image data, caption, aspect ratio, timestamp
