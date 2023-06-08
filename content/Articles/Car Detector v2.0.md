# Car Detector v2.0: Let's focus on ML

# What is Car Detector v2.0?

Car Detector 2.0 is successor to my end of year project with my team, this time i added the features that i didn't know how to implement with many improvement.

The first version had many problems: 

* low accuracy.

* data not cleaned and full of useless images.

* no car extraction which means it input a whole picture so it couldn't do multiple car predictions and it won't
distinguish between car and non car subjects

# Let's start with the tech

Here's a breakdown of the tech used:

* Yolos: a transformer based yolo implementation that boasts both great performance, small size and ease of fine tuning

* Huggingface: a platform that makes accessing pretrained for inference or fine tuning very easy through the use of multiple python libraries

* Fastai: An ai library that acts as a wrapper around ML libraries to eliminate boilerplate code

* Fastapi: An api framework in python that is very performant, uses latest features of python (type hints and class models) and easy to use

Overview of the new features developed:

* Multi car extraction

* More information including probability and top predictions

* double the accuracy

* Better inference performance

* smaller memory footprint

# What made this challenging?

I had to understand my previous code and re-do most of it, this is one of the most common exercises
done by software engineers, i redefined the class that handles the prediction and add dataclasses
to verify the data from the models which also create a good layer to serilization and visualization.

In practice however i have encountered many problems:

* divinding the project into parts so that we can improve upon it and use it in many ways, this required creating classes for the predictions and divinding the functionality in the most appropriate way.

* Trying Yolo implementations: yolov3, yolov4, yolov5 most of which are very oversized
for my application.

* Handling yolos output, unlike classic yolo implementation, yolos bounding box is describing two opposing points of a rectangle example: (x0:y0, x1:y1).

* data representation, how to represent data efficiently for other parts of the system this required the use of data classes and nesting the information so that we can serialize to any format (json, csv...).

* Cleaning over 4000 classes of data using custom models (deleting low quality pictures, deleting pictures of cars) this however is still an ongoing problem and can be resolved more. 

* Picking the right architecture for the classification model, i tried resnet, xresnet and efficienet and i found out that xresnet was the one with the best accuracy and performance and also the simplicity of the resnet architecture made debugging the model easy

# Next up!

In my next project i will delving into LLMs and especially local llms and ways to be able to "talk"
to your projects or have a personal assistant over your notes and files!

# Finishing up

This is the project github: [https://github.com/cryptolake/car_detector_v2](https://github.com/cryptolake/car_detector_v2)

And my linkedIn: [https://www.linkedin.com/in/dhia-dahmeni-577a42216/](https://www.linkedin.com/in/dhia-dahmeni-577a42216/)

Thank you for reading!
