#Plan

##Features

###Profile
- Login and authenticate (Google or manual)
    - Use `Firestore`
- Follow or unfollow people
- Show display name, username, # followers, # following, # posts, description, posts
    - Have edit profile button
- Can change username and password

###Posts 
- Make Image or Video Posts with text.
    - Use `Firestore`
- Delete Posts
- Like posts.
- Comment on Posts.
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
