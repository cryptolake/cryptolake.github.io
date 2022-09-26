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
