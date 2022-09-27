# Probability Models and Axioms

## Goals
 Probability as a mathematical framework for reasoning about uncertainty
* Sample space
* Axioms of probability
* Simple Examples

## Symbols:
- `P(A)` The probability of the subset/event A
- `∨` This is the symbol for  the OR operation
- `∧` This is the symbol for the AND operation
- `Ω`  This is the symbol for the entire set in the sample space
- `A'c` Complement of A, The set of probability that are not A

## Sample Space
### What is a Sample Space?
* "List" of possible outcomes
* List must be:
	* Mutually exclusive
	* Collectively exhaustive
	* At the right granularity

Example of sample space: flipping a coin, rolling a die etc..

![[Mathematics/Porbability/Pasted image 20220926152103.png]]
Here we have an the sample space (the list of all possibilities) of 3 coins each with two possibility of H or T. We can calculate the number of all combinations with 2^3.

So let's get into details:

### Mutually exclusive:
If an outcome happens for example (HHT) that's the only outcome happening, no other outcome is happening with it.

### Collectively exhaustive:
We have all the possible outcomes in our sample space, therefore it is *Exhaustive*.

### At the right granularity
Imagine we have the sample space of flipping a coin we have two possible outcomes: H for heads or T for tails, we can actually express an infinite list of outcomes depending for example H + bad weather, H + good weather, T + bad weather, T + good weather if we thing that the quality of weather has a hand into determining our outcome, This what we mean by granularity, for the problem of coin tossing the first sample space of H and T will be better for the problem of spinning a coin, but this is not a hard requirement it just mean that the second information (raining and not raining) is irrelevant.


### Examples of Sample space:
Suppose we have the set 

<math xmlns="http://www.w3.org/1998/Math/MathML" data-semantic-type="relseq" data-semantic-role="equality" data-semantic-id="6" data-semantic-children="0,5" data-semantic-content="1" data-semantic-complexity="13">
  <mi mathvariant="normal" data-semantic-type="identifier" data-semantic-role="greekletter" data-semantic-font="normal" data-semantic-id="0" data-semantic-parent="6" data-semantic-complexity="1">&#x3A9;</mi>
  <mo data-semantic-type="relation" data-semantic-role="equality" data-semantic-id="1" data-semantic-parent="6" data-semantic-operator="relseq,=" data-semantic-complexity="1">=</mo>
  <mrow data-semantic-type="fenced" data-semantic-role="leftright" data-semantic-id="5" data-semantic-children="3" data-semantic-content="2,4" data-semantic-parent="6" data-semantic-complexity="8">
    <mo fence="false" stretchy="false" data-semantic-type="fence" data-semantic-role="open" data-semantic-id="2" data-semantic-parent="5" data-semantic-operator="fenced" data-semantic-complexity="1">{</mo>
    <mstyle displaystyle="false" scriptlevel="0" data-semantic-complexity="3">
      <maction id="MJX-Collapse-1" actiontype="toggle" selection="2" data-semantic-complexity="3">
        <mtext data-semantic-complexity="3">&#x25C2;...&#x25B8;</mtext>
        <mtext data-semantic-type="text" data-semantic-role="unknown" data-semantic-font="normal" data-semantic-id="3" data-semantic-parent="5" data-semantic-complexity="30">Heads and it is raining, Heads and it is not raining, Tails</mtext>
      </maction>
    </mstyle>
    <mo fence="false" stretchy="false" data-semantic-type="fence" data-semantic-role="close" data-semantic-id="4" data-semantic-parent="5" data-semantic-operator="fenced" data-semantic-complexity="1">}</mo>
  </mrow>
</math>

This is a valid set since it's mutually exclusive and and collectively exhaustive.

<math xmlns="http://www.w3.org/1998/Math/MathML" data-semantic-type="relseq" data-semantic-role="equality" data-semantic-id="6" data-semantic-children="0,5" data-semantic-content="1" data-semantic-complexity="13">
  <semantics>
    <mrow>
      <mi mathvariant="normal" data-semantic-type="identifier" data-semantic-role="greekletter" data-semantic-font="normal" data-semantic-id="0" data-semantic-parent="6" data-semantic-complexity="1">&#x3A9;</mi>
      <mo data-semantic-type="relation" data-semantic-role="equality" data-semantic-id="1" data-semantic-parent="6" data-semantic-operator="relseq,=" data-semantic-complexity="1">=</mo>
      <mrow data-semantic-type="fenced" data-semantic-role="leftright" data-semantic-id="5" data-semantic-children="3" data-semantic-content="2,4" data-semantic-parent="6" data-semantic-complexity="8">
        <mo fence="false" stretchy="false" data-semantic-type="fence" data-semantic-role="open" data-semantic-id="2" data-semantic-parent="5" data-semantic-operator="fenced" data-semantic-complexity="1">{</mo>
        <mstyle displaystyle="false" scriptlevel="0" data-semantic-complexity="3">
          <maction id="MJX-Collapse-2" actiontype="toggle" selection="2" data-semantic-complexity="3">
            <mtext data-semantic-complexity="3">&#x25C2;...&#x25B8;</mtext>
            <mtext data-semantic-type="text" data-semantic-role="unknown" data-semantic-font="normal" data-semantic-id="3" data-semantic-parent="5" data-semantic-complexity="30">Heads and it is raining, Tails and it is not raining, Tails</mtext>
          </maction>
        </mstyle>
        <mo fence="false" stretchy="false" data-semantic-type="fence" data-semantic-role="close" data-semantic-id="4" data-semantic-parent="5" data-semantic-operator="fenced" data-semantic-complexity="1">}</mo>
      </mrow>
    </mrow>
  </semantics>
</math>

This is not a valid as it is not mutually exclusive we have Tails and it is not raining and Tails which have the same outcome Tails.

### Sample Space: discrete/finite
For Example if we took the sample space of flipping two coins we find that it is discrete: it has a possible set of values {HT, TH, HH, TT} (For our problem order matters we can also deal with problems where the order doesn't matter) and finite as that set is made of only 4 possibilities. one way to represent the space is a matrix:

H | T
-- | --
HH | HT
TH | TT

where have the possibilities of the first coin as columns and second coin as lines.


### Sample Space: Continuous
For example let's say we are playing throwing darts we can have a sample space of the (x,y) coordinates of our throw in the board, given that we have a range of possible values we say that our Sample space is coninuous. 

## Probability axioms

Let's take the example of the last sample space the dart throwing case, the probability of hitting any point there is 0 because each point is infinitely small so we don't assign probability to a single element in the sample space rather we choose a *subset* of the sample space that's called an *Event*.

### Event:
A subset of the sample space
- Probability is assigned  to events in the following notation: `P(A)` A being the event.

### Probability:
notation: `P(A)`

By convention probabilities are always given in range between 0 and 1, 0 means that we believe something cannot happen and 1 we are certain that the *event* is going to happen.

### Axioms:
- Nonnegativity: `P(A) >= 0` A probability can never be negative
- Normalization: `P(Ω) = 1` The probability of the entire sample space is always 1
- (Finite) Additivity: `If A ∧ B = None, then P(A ∨ B) = P(A) + P(B)`

### Example:
Let A and B be events on the same sample space, with P(A)=0.6 and P(B)=0.7. Can these two events be disjoint?

The answer is: *NO*

If the two events were disjoint, the additivity axiom would imply that P(A∪B)=P(A)+P(B)=1.3>1, which would contradict the normalization axiom.

These are consequences of the axioms.

### Rules of probability:
Rules are the results of the axioms

-  ![[Mathematics/Porbability/Pasted image 20220927111322.png]]
if we have two sets A and B, A is part of B so set A smaller than B, So if B is larger than A then naturally the probability that the outcome falls inside B should be at least as big as the probability that the outcome falls inside A.

Formally:
if A inside B, then P(A) <= P(B)

B = A U (B ∩ A'c)
P(B) = P(A) + P(B ∩ A'c) >= P(A) Since a probability can never be negative

-  ![[Mathematics/Porbability/Pasted image 20220927111430.png]]

let's say a=P(A and B'c) b=P(A and B) c=P(B and A'c)

![[Mathematics/Porbability/Pasted image 20220927111537.png]]


```
P(A U B) = a + b + c
P(A) + P(B) - P(A and B) = (a+b) + (b+c) - b
						 = a + b + c

```

As a consequence we have:

 ![[Mathematics/Porbability/Pasted image 20220927112036.png]]


![[Mathematics/Porbability/Pasted image 20220927112143.png]]

![[Mathematics/Porbability/Pasted image 20220927112600.png]]

### More Examples: Discrete

![[Mathematics/Porbability/Screenshot_20220927_120306.png]]


We Can see that every possible outcome has a probability of 1/16
Let `P(x = 1) = 4 * 1/16 = 1/4` this the probability that the first roll is 1

Let `Z = min(x,y)` is a function that gives us the minimum of x and y
`P(z == 4) = 1/16` this is because if `x==4`  then `y==4` vice versa.

Let `P(Z==2) = 5 * 1/16` this is because we take all `x, y` that are `x, y >= 2` which are 5

### Discreet uniform law

![[Mathematics/Porbability/Pasted image 20220927121508.png]]

### More Examples: Continuous
	![[Mathematics/Porbability/Pasted image 20220927145207.png]]

let's take the example of the dart board from earlier

the Area of a subset is the *probability* of that area of that subset.
![[Mathematics/Porbability/Pasted image 20220927145938.png]]

for the first probability P({(x, y) | x + y <= 1/2}))  we took the area under that triangle and got 1/8, this the probability of x equals or under half and y equals or under 1/2.

for the second probability we have P({(0.5, 0.3)}) it's 0 because the area of a single point it zero.

## Probability calculation steps
We have four steps

- ### Specify the sample space:
	we first write down the sample space

- ### Specify a probability law:
	Choose a probability that suits the phenomena that you are studying
	for example for the last example we chose the event in which the area of the subset is the probability of the event

- ### Identify an event of interest
	We need to know the event to get the probability of

- ### Calculate...



## Notes:
PS: i just discovered you can mathjax in obsidian so i can output math by latex inside `$ $` like so:
$\mathbf{P}(A) + \mathbf{P}(A^ c) +\mathbf{P}(B) = \mathbf{P}(A\cup A^ c\cup B)$
