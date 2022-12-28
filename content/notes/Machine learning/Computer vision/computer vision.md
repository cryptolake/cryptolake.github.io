# computer vision: yolo and r-cnn

## Classification vs localization vs detection

classification is where you label a picture as a class, localisation is where you need to put a bounding box on the object it and detection is detecting one or multiple instances of the class the three together form the basis of many problems like self driving vehicles.

## Localization
Along with the classes percentages with localization you get 4 coordinates of the bounding box and whether there's an object in the picture:
- pc: whether there is a car in the picture
- bx the x axis coordinate of the center of the rectangle
- by the y axis coordinate of the center of the rectangle
- bh the height of the rectangle
- bw the width of the rectangle