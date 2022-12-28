# Discrete random variables

## Introduction:
For example, we pick a random student out of a class at the end of the experiment we may want to know if the student was female or male, that is we may want to know whether a certain event has occurred. But besides events we want to know some other result of the experiment, for example the weight of the student and it's not quite like reporting an event instead we are giving the numerical value of some quantity associated with the outcome of the student, such quantity is called a random variable.

## Notation:
Random variable $X$ / Numerical value $x$

## Random Variables:
Random variables make the subject of probability much richer and allow us to talk about random numerical quantities and their relations, we will be talking about:
 - Their distribution
 - expectation, variance
 A random  variable  associates a value (a number) to every possible outcome, Mathematically it is a function from the sample space to the real numbers, it can take discrete or continuous values.
 - we can have several random variable defined on the same sample space
 - A function of one or several random variables is also a random variable
	 - meaning of $X + Y$ : r.v takes value $x + y$ when $X$ takes value $x$ and $Y$ takes value $y$
 
## Probability mass functions (Discrete Random Variable)

### Introduction:
A random variable can take different numerical values depending on the outcome of the experiment, some outcomes are more likely than others, and similarly some of the possible numerical values of a random variable will be more likes than others
 - It is the "probability law" or "probability distribution" of $X$
 - If we fix some $x$, then $X = x$ is an event 
for example:
![[Mathematics/Porbability/Pasted image 20220928201247.png]]
$x = 5\ then \ X = 5$ 
$\{\omega:X(\omega)=5\} = \{a,b\}$
we denote the following notation:
$P_X(5) = 1/2$
for the probability of the random variable $X$ is equals to 5.
$P_X(x) = P(X=x) = P(\{\omega \in \Omega \ s.t \ X(\omega)=x\})$

So The probability mass function $PMF$ is a function of an argument $x$ and for any $x$ it specifies the probability that the random variable takes on this particular value.

- Properties:
	- $P_X(x) \geq 0$ 
	since we are talking about a probability and probabilities are always positive
	- $\sum_xP_X(x)=1$
	the sum of all probabilities of $x$ should add to 1

### Calculation:
let's have the sample space of two rolls of tetrahedral die:
![[Mathematics/Porbability/Screenshot_20220929_112856.png]]
$X$ and $Y$ are random variables. Let every possible outcome have probability 1/16