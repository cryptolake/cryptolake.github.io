# Car Detector: a month long journey

![](https://miro.medium.com/max/1400/1*gbMQRdjJX1Fjuv7aV3EV7g.png)

# What is Car Detector?

This is our end of the year project: [car detector](https://car-detect.systems/), It’s a web app/bot/API for car brand, model, year and color detection and classification using AI and machine learning.

We are a team of 4 students from Holberton School, We were friends since day one and now we made our dream project:

Dhia Hak Ben Dahmeni: Team Lead, Machine learning, Devops

Rayen Hedri: Data Gathering/Cleaning

Mouna Ben Ali: Backend/DB

Montassar Barbouchi: Frontend

Now for our timeline, We started by defining the technologies we are going to use.

Then we took the proactive approach and we began by learning what’s missing for example: I had to learn about machine learning and neural network, Montassar had to learn about Reat.

After learning we started iterating first we had a beta with flask templates and a model with data i found in kaggle that only uses cars from 2012 Then we implemented a simple front end and a restful api backend, finally we implemented everything including the Database, The full model with over 4000 car models and a nice frontend.

![](https://miro.medium.com/max/1400/1*jhmf8-uua5qPx7itFPAgIg.png)

# How It all Began

Like All Tunisian youth i had an interest into cars, It was always a frequent subject into my conversations with friends, discussing the new BMW, If you had X amount of money which car would you buy etc.

One time We were riding home, Rayen was always the one driving (he’s the only one with a license) and we were talking about one of the cars on the street, then he brought up a game he used to play: He would guess the car on the street before seeing their branding, Right then a light bulb lit up above my head “Why don’t we make this our end of year project?”, All of our faces brighten up.

You see We were struggling for an idea at that time something that we actually like to make, Next day we were at Holberton I talked to Mouna about and she agreed to join, And our team is formed!

![](https://miro.medium.com/max/1400/0*1pM8gGkPf-rH8IrY)

Our Deployment Architecture

# Let’s Delve Deeper

That is our application architecture in deployment and here’s a breakdown of our tech stack:

Docker: we used docker as our container manager we went with this approach as docker offers hassle free configuration for many different part of the app organized by services using compose.

Nginx: We used nginx as our webserver and proxy, it’s very reliable and it has plenty of resources.

Flask: Flask offers a low bar of entry and it’s very easy to bend it however you like, It was also what we learned at Holberton.

Mongodb: Again mongodb is very flexible and since we aren’t using such complex relations it was the perfect choice.

React: Reactjs offers a great documentation plus it’s handling of state and components made changing and adding features snappy.

pytorch: As fastai usses pytorch i had learn the basics of neural network and learn more about pytorch i also used a pretrained resnet model that offered great results when testing.

For an overview of the features i developed:

-   An AI library that plugs into the model initiate it with the picture file and it returns the prediction results in a python dict.
-   The website is responsive and mobile friendly.
-   A detection model that has over 4000 classes with accuracy up to 93% with some of them.

# What made this challenging?

![](https://miro.medium.com/max/1400/1*6Nq73Af9-LkXJu4fA-9npA.png)

The AI model architecture: Resnet

After gathering the new data for training, we found out that some of our data classes contain a very small number of images in which it was impossible to split between training and testing, and what made it worse that in almost all the folders we had a bunch of car interior images that will make the data quality even worse.

So i gathered a bunch of images of cars put them in a folder, then another folder with car interior images and trained a resnet model with fastai the accuracy was optimal and then i transferred the model to where our data resides there I've made a script to loop through all the images, push them into the new model and delete any image that indicates interior.

But the data is still lacking cleaning for example we found out that a couple of brands are not useful to be there like Abarth for example it’s basically a modified fiat brand so the model is not going to distinguish between them due to the similarities so we deleted those brands completely.

Even with all of this we still have two steps to accomplish first we delete any model that is very obscure along with obscure brands we did this by deleting any car model with no or very few images in our data source (auto data).

Second we gather more data due to a requirement I decided on which is 30 picture per car model and we did that using duckduckgo we scrape the results of each query until we have 30 picture per folder.

With all of this we had a clean data foundation to work with and train the model with, which in turn got us an accuracy of 60% on all the cars with the model and year and 93% with the brand only.

# It was above all, a learning experience

![](https://miro.medium.com/max/1400/1*3ZFZeOaxskM30iJYMFQ2Jw.png)

Our Backend data flow

I can say after this project i have a solid introduction into a bunch of topics in software engineering but also statistics, math and machine learning.

I can say now that i have things that would want different for example, i wish i used fastapi instead of flask or bigger neural network from the get go and most importantly implementing extracting cars from pictures which in turn will enable multiple car detection in a picture + verifying if the picture contains a car even.

> From machine learning to flask and mongodb to beautifulsoup into css and javascript, to docker and nginx.

This project is very unique because of all the different layers connected yet it works because of engineering behind the standards that were offered to use like http, posix sockets, linux kernel: this what SWE is all about, creating standards that is not just a trend but a building block for projects.

> I know see that programming isn’t merely a job or a hobby it’s a trade much like carpenter or a blacksmith a programmer is a person with tools and resources which they know how to make something out of…It requires both logic and creativity.

sidenote: neovim >>> emacs

# Finishing up

![](https://miro.medium.com/max/1400/0*oPkc8KdzHIWB3uPZ.jpg)

The dream team

I’m Dhia Hak Ben Dahmeni, 19 years old and That is my team, before Holberton i was fresh out of high school and now i’m a full stack developer at Lokafy and now for my specialization year i’m planning to pursue machine learning!

This is the project github: [https://github.com/pfadrm/car_detector](https://github.com/pfadrm/car_detector)

Our deployed website: [https://car-detect.systems](https://car-detect.systems/)

And finally my linkedIn: [https://www.linkedin.com/in/dhia-dahmeni-577a42216/](https://www.linkedin.com/in/dhia-dahmeni-577a42216/)

Thank you for reading!