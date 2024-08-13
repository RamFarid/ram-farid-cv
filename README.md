# Newest version of My CV (11)

After my Academic high school studies and the surprised that my website is being in the top searchs! So, I should have to update my cv to be more efficient And I had a lot of ideas to implement.
So far my website - CV - has gone through three radical changes:

- React Stage (Unfortunately, there is no source to display this version. It can be avaliable later)
- [First Next Stage](https://ramfarid-git-nextjs-ramfarid.vercel.app)
- Second Next Stage 1.0 (Current version)

## What's new?

From the _First Next Stage (Previous version)_ to the _Current version_ there is a multiple things I have done:

- A smooth slider in the Home page.  
  Really it was very difficult, Because I tried to make a slider I have seen in another website. I have put all my sections in the slider except the [Portfolio](https://ramfarid.vercel.app/portfolio) in a separate page. There are some keypoints of the Home Page Slider
  - It was difficult to adjust the full height of the Slider Container on mobile devices due to the toolbars and the link address. But I get the solution by fixed the slider height.
  - The slider very smooth in use due to the auto-focus of the container I have made
  - You can use the wheel of the mouse or the touch screen swipes

Due to the slider that I wanted to do the screen being very small to display each section content So:

- I decided to do a 3D double-face card to display a two face each face has a section data. It's only two face but it's enough for my case
  - There is a smooth animation with swipes that has done.

After reaching the end section of the slider the body itself has scrolled down to let you see my marquee projects!

- A nice marquee to display my projects is the best idea to get intro to get into my projects. ([Go down to see more 👇](#the-marquee))
- You can click on the [portfolio](/portfolio) title to pick up you to the [portfolio](/portfolio) page or click on any project in the marquee and it also pick up you to the portfolio page with focus on the project you clicked and scroll into it
- you can edit the project if you were Ram "me" by click on edit project on the top of the project description

### The Projects Marquee {#the-marquee}

In the projects marquee I was facing two problems

- The Speed of the marquee
- Smoothness of the animation

#### Handling Speed Marquee

**Through calculations**, I came up with two **_mathematical equations_** that guarantees smoothness and stability of the marquee speed with the addition or deletion of dozens of projects. Let me clarify:

I made a manual experience and I got that every **300 pixels** take **6 seconds**
Therefore, `Speed of the animation = 348px/6sec = 58 px/sec`
Therefore, `Speed = Length/Time`
In our case the length would be the _width_ of the container of the marquee and the time is the _animation duration_
Now we can get the duration of the animation from `58=Width/Time`, `T = Width/58`
Now The equation has the unknown Width.
The dilemma now is to reduce or even lack of JavaScript client code. So I decided to calculate the width manually to get the width of the marquee container before reaching the client browser. **How can I do this?**

The marquee is card by card in front of each others

- There is a gap between each card with **16 pixels**
- Each card is **100 pixels**
- There is no margins for the container

By the previous information I could calculate the marquee container even if it isn't rendered. By adding the gaps and the number of cards we get the final width equation: `Width = 100 * cardsNo. + ((16 * cardsNo) - 1)`
Now, We came up with all necessary things to solve Speed problem and fix a speed of 58px/sec by the equation:

- `T = Width/58`
- `Width = 100 * cardsNo. + ((16 * cardsNo) - 1)`

But we still have one problem

#### Smoothness of the animation

Basically, The Smoothness of the animation is the main target of the animation. If the animation isn't smooth so no need for animation
The animation seemed to be crash after all the projects end So we solve this problem by start the all animation from the first of the screen
