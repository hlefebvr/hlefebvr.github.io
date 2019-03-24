---
layout: post
category: or
title: Linearizing a product of decision variables
short: Several linearization techniques
date: 2019-03-25
---

## Binary-Continuous positive
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

## Binary-Binary
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