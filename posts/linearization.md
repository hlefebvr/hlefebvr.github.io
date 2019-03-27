---
layout: post
category: or
title: Linearization cheatsheet
short: Several linearization techniques
date: 2019-03-25
---

## Bilinear terms
### Binary-Continuous positive
Let $$x$$ be a binary decision variable and $$u$$ a positive continuous decision variable bounded by a quantity $$M$$. One can express the product $$xu$$ using an auxiliary variable $$z$$, positive and continuous subject to the following constraints :

$$
    z = xu \Longleftrightarrow
    \begin{cases}
        z \le Mx\\
        z \le u\\
        z \ge u - (1 - x)M
    \end{cases}, x\in\{0,1\}, u\in\mathbb R_+, z\in\mathbb R_+ 
$$

*If $$u$$ is not bounded, the linearization is not possible*

### Binary-Binary
Let $$x$$ and $$y$$ be two binary decision variable, one can express their product as

$$
    z = xy \Longleftrightarrow
    \begin{cases}
        z \le x\\
        z \le y\\
        z \ge x + y - 1
    \end{cases},
    z \in\{0,1\},x\in\{0,1\}, y\in\{0,1\}
$$

### Integer-Continuous
Let $$x$$ be a continous decision variable and $$n$$ be an integer decision variable. Assume that $$n$$ is bounded by $$M_n$$ and $$x$$ by $$M_x$$. Then, by introducing $$\log_2 M_n$$ variables, one can write $$n$$ in base 2 as 

$$ n = \sum_{i=0}^{\log_2 M_n} 2^iq_i, q\in\{0,1\}^{\log_2 M_n} $$

Then it holds that $$nx$$ is equal to $$ \sum 2^iq_ix $$ where $$ x $$ is continuous and $$q_i$$ binary. One can then apply the previous linearization. 

## Finite minimum

$$
\begin{align}
    \textrm{maximize} &&& \min_{k=1,\dots,n} c^Tx^k\\
    \textrm{subject to} &&& x^k \in \mathcal X
\end{align}
$$

Using an epigraph formulation, is equivalent to

$$
\begin{align}
    \textrm{maximize} &&& \theta \\
    \textrm{subject to} &&& x^k \in \mathcal X \\
    &&& c^Tx^k\ge\theta, k=1,\dots,n \\
    &&& \theta\in\mathbb R
\end{align}
$$

## Absolute value

$$
\begin{align}
    \textrm{minimize} &&& |x| \\
    \textrm{subject to} &&& x \in \mathcal X
\end{align}
$$

is equivalent to

$$
\begin{align}
    \textrm{minimize} &&& y \\
    \textrm{subject to} &&& x \in \mathcal X \\
    &&& y\ge x \\
    &&& y\ge -x
\end{align}
$$

## Ceiling function

To linearize $$ \left\lceil x \right\rceil $$, introduce an integer variable $$ y\in\mathbb Z$$ such that :

$$ y = \left\lceil x \right\rceil \Leftrightarrow x - (1-\varepsilon) \le y \le x, \varepsilon\approx 0.00\dots 001 $$

## Floor function

To linearize $$ \left\lfloor x \right\rfloor $$, introduce an integer variable $$ y\in\mathbb Z$$ such that :

$$  \left\lfloor x \right\rfloor \Leftrightarrow x\le y\le x + (1 - \varepsilon), \varepsilon\approx 0.00\dots 001  $$