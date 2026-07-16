# Sets, sequences and series

## Sets:
Sets are a collection of distinct elements, we could specify a set by 
$\{a, b, c, d\}$: finite
$R$: set of all real numbers infinite
another way to specify a set is this notation:
$\{ x \in R: \cos(x) > 1/2 \}$ we took a smaller of set of R that specifies the condition
$\cos(x) > 1/2$

we can also consider the universal set $\Omega$ which makes all of the sets subset of $\Omega$ 
and also it enable us to specify everything not belonging to our set which is for set $S$
is it's complement $S^c$ formally $S^c = \{x \in S^c \ if \  x \in \Omega,\  x \notin S\}$ in effect $(S^c)^c = S$

another set of interest is the empty set $\phi$ which is the set that contains no elements in effect $\Omega^c = \phi$ 

if we have a set inside a set we denote the following:
$S \subset T\ :\ x \in S \implies x \in T$

![[Mathematics/Pasted image 20220930134642.png]]

 now when we have two sets we can talk about their unions and intersections.
 ![[Mathematics/Pasted image 20221001122338.png]]
 $S \cup T$ This is the union of $S$ and $T$ meaning $x \in S \cup T \Leftrightarrow x \in S\ or\ x \in T$
 $S \cap T$ This is the intersection of $S$ and $T$ meaning $x \in S \cap T \Leftrightarrow x \in S\ and\ x \in T$

And actually we can have an infinite number of sets with intersections and unions.

![[Mathematics/Pasted image 20221001123415.png]]

### Properties of Sets:

![[Mathematics/Pasted image 20221001123547.png]]

### De Morgan's laws:
![[Mathematics/Pasted image 20221001131509.png]]

$\qquad \displaystyle {\Big(\bigcup _ n S_ n\Big)^ c=\bigcap _ n S_ n^ c,\qquad \Big(\bigcap _ n S_ n\Big)^ c=\bigcup _ n S_ n^ c}$

De morgan's law are very useful they allow us to go back forth from unions to intersections.

## Sequences:

So a sequence is nothing but some of collection of elements that are coming out of some set, and that collection of elements is indexed by natural numbers.
$a_1, a_2, a_3, ...$
we normally use this notation: sequence $a_i, \{a_i\}$ we have $i \in N = \{1, 2, 3, ...\}$ and $a_i \in S$, $S$ can be the set of real numbers $R$ or $R^n$ in which case we will be dealing with vectors but it also could be any other kind of set.

Formally a sequence is a function $f:N\rightarrow S$ that means we feed the function a natural number and it returns an element of the set $S$ which is an element of the sequence.
$f(i) = a_i$

### Convergence and divergence

We typically care if a sequence converges to some number a and we often use this notation, $a_i \rightarrow a\ as\ i \rightarrow \infty$ and a more formal notation we say that the $lim_{i\to\infty} a_i = a$ but what does this mean? formally? let's plot it out!
![[Mathematics/Pasted image 20221001145004.png]]
 for any $\varepsilon > 0$ , there exists $i_0$, such that if $i \geq i_0$ , then $|a_i - a| < \varepsilon$
 What this definition is saying is that no matter what kind of band i take around my limit a, eventually, the sequence will be inside this band and will stay inside there.
 
Convergence of sequences has some very nice properties For example, if a sequence $a_i$ converges to $a$ and another sequence $b_i$ converges to $b$ then we have $a_i + b_i \rightarrow a+b$ which means $a_i + b_i$ converges to $a+b$ similarly $a_i b_i \rightarrow ab$.

In addition, $g$ is a continuous function then $g(a_i) \rightarrow g(a)$ for example if $a_i \rightarrow a \implies a_i^2 \rightarrow a^2$

### When does a sequence Converge?
there are two criteria there are commonly used, the first one deals with the case where we have a sequence of numbers that keep increasing, in that case those numbers may go up forever without any bound.

- If $a_i \leq a_{i+1}$, for all $i$ than either:
	- the sequence "Converges to $\infty$"
	- the sequence converges to some real number $a$

another way of establishing convergence is to derive some bound on the distance of our sequence from the number we suspect be the limit if that distance become smaller and smaller (converges to 0) the it is guaranteed that since the distance goes down to then the sequence converges to a real number  $a$.
- If $|a_i - a| \leq b_i$, for all $i$, and $b_i \rightarrow 0$, then $a_i \rightarrow a$

A variation of this argument is the *sandwich argument* and it goes as follows if we have a sequence $a_i$ and a sequence $c_i$ they both converge to $a$ then our sequence $b_i$ that is between them must converge to $a$.

## Series:

### Infinite Series:
we are given a sequence a of numbers $a_i$ indexed by $i$ where $i$ ranges from 1 to $\infty$,
so it's an infinite sequence and we want to add the terms of that sequence together the resulting notation is the following:
	$\sum_{i=1}^\infty a_i = \lim_{n \rightarrow \infty} \sum_{i=1}^n a_i$ provided limit exists

when does limit exists:
- If $a_i \geq 0$: limit exists
- if terms $a_i$ do not all have the same sign:
	- limit need not exist
	- limit may exist but different if we sum in a different order
	- *Fact*: Limit exists and independent of order of summation if $\sum_{i=1}^\infty |a_i| < \infty$

#### Geometric Series:
The geometric shows up in many applications and problems, it is when we are given a number $\alpha$ and we want to sum all the powers of alpha, starting from the 0th power, which is equal to 1, this gives us an infinite series.
	$S=\sum_{i=0}^\infty \alpha_i = 1 + \alpha + \alpha^2 + ...$
for this series to converge we need the terms to go down so we denote $|\alpha| < 1$
this results into the following equation:
![[Mathematics/Pasted image 20221001154109.png]]

We use algebraic identity to derive this:
$(1-\alpha)(1+\alpha+...+\alpha^n)=1-\alpha^{n+1}$
and as $n \rightarrow \infty$ we use the notation from the infinite series we have
$(1-\alpha)S=1 \implies S=1/1-\alpha$ 

#### Order of summation in series with multiple indices


![[Mathematics/Pasted image 20221001155141.png]]

each one of those points corresponds to one of the terms that we want to add, so we can sum the different terms in some arbitrary order, as long the series converges to some term then this series will be well defined and in principle, those different orders might give us different kinds of results.

on the other hand, as long as the sum of the absolute values of all the terms tuns out to be finite, the particular order in which we're adding the different terms will turn out that it doesn't matter.
	$\sum |a_{ij}| < \infty$

we can also do the summation by fixing a particular value of $i$ and adding all $j$ to infinity or vice versa.
![[Mathematics/Pasted image 20221001160010.png]]

so this 	$\sum |a_{ij}| < \infty$ guarantees no matter which is the order we are going to get same results.

This condition is not always satisfied suppose we have this particular sequence:

![[Mathematics/Pasted image 20221001160526.png]]

and that every dot represents a zero, if we do the summation by fixing a j and adding over all i's we will have a sum of 0, but if we do the summation by fixing i and adding over all j's we will have 1.

let's now consider the case where we want to add the terms of a double sequence but over a limited range of indices for example: