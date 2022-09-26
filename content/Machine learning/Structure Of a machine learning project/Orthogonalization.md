# Orthogonalization

## Intro:
One of the challenges of training an ML model is that there are a lot of things to tune, to change, knowing what to tune in order to achieve the desired result is what is called orthogonalization.
For example when driving a car we have a set of two controls one for steering (steering wheel) and one for speed (Acceleration and braking). with these we can plot the steering on the y axis and the speed in x axis and get and *orthogonal* axis of these elements if we control steering we don't effect speed and vice versa, now let's say we have another set  of controls: 
1. `0.3 steering + 0.5 speed`
2. `0.5 steering + 0.3 speed`
these are the type of controls we are trying to avoid in machine learning and with orthogonalization we will try to separate the effect to better control the results of training.



