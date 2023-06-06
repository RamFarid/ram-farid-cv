# My curriculum vitae new version (10)! :stuck_out_tongue_winking_eye:

The new version of my cv with **`next js`** version 13.4 **(Stable)** :grin: Build the new version with my own [dashboard](https://ramfarid.vercel.app/dashboard), I made my cv **full-stack** website

## Usages and dependencies

There are many features come with the latest version of **Next.js 13.4** :fire:.

Imagine that I build my new cv version with:

- Messages system
- Database for:
  - My Projects
  - My PDF CV to download
  - Clients number
  - Messages recieve (On dashboard)
  - Message send (On [Contact page](https://ramfarid.vercel.app/contact))
- Authorization (For dashboard)

> _All these stuff **without** even a single API route!_

The secret in one word **_Server Actions_**

### Features with Next.js

- Server actions
- App directory
- Server components

> No uses of built-in images optimization because I hate it :angry:

### Dependencies

##### Server packages

- Firebase Admin SDK
- Firebase
- bcrypt
- jsonwebtoken

> I uses storage and firestore db from Firebase
> jsonwebtoken is used to handle the login for my [dashboard](https://ramfarid.vercel.app/dashboard)
> bcrypt is used to hash the password of the [dashboard](https://ramfarid.vercel.app/dashboard)

##### Client packages

- framer-motion
- react-avatar
- react-icons
- react-toastify
- swiper
- typewriter-effect
- use-detect-keyboard-open
