---
layout: post
category: lsolver
title: Using the Dantzig-Wolfe decomposition
short: to solve LPs or NLPs
date: 2019-11-21
---

In this very short tutorial, we will see how to run a dantzig-wolfe decomposition on a given LP model. Consider the following model:

$$
    \begin{align}
        \textrm{minimize } & f_0(x) + g_0(y) \\
        \textrm{s.t. } & \varphi(x) \le 0 \\
        & \psi(y) \le 0 \\
        & f_i(x) + g_i(y) \ge 0 \quad \forall i =1,...,m \\
        & x\in\mathbb R^n_+\\
        & y\in\mathbb R^p_+
    \end{align}
$$

where $$f, g, \varphi$$ and $$\psi$$ are convex functions. Let us denote by $$\mathcal X$$ and $$\mathcal Y$$ the feasible spaces for variables $$x$$ and $$y$$ disregarding the linking constraints, i.e., 

$$ \mathcal X = \{ x\in\mathbb R_+^n | \varphi(x) \le 0 \} $$

$$ \mathcal Y = \{ y\in\mathbb R_+^p | \psi(y) \le 0 \} $$

Because the sets are convex, by definition, they may be expressed, assuming boundedness, as:

$$ \mathcal X = \left\{ x\in\mathbb R_+^n \middle| \int_{\partial\mathcal X} x\alpha(x)dx \quad \int_{\partial\mathcal X}\alpha(x)dx = 1 \right\} $$

$$ \mathcal Y = \left\{ y\in\mathbb R_+^p \middle| \int_{\partial\mathcal Y} y\mu(y)dy \quad \int_{\partial\mathcal Y}\mu(y)dy = 1 \right\} $$

where $$\partial\mathcal X$$ and $$\partial\mathcal Y$$ denote the border of $$\mathcal X$$ and $$\mathcal Y$$. By considering only a finite, countable, subset of extreme points of $$\mathcal X$$ and $$\mathcal Y$$, we can approximate these with the following:

$$ \widehat{\mathcal X} = \left\{ x\in\mathbb R^n_+ \middle| x = \sum_{e\in E_x} \mathbf x^e\alpha_e \quad \sum_{e\in E}\alpha_e = 1 \right\} $$

$$ \widehat{\mathcal Y} = \left\{ y\in\mathbb R^n_+ \middle| y = \sum_{e\in E_y} \mathbf y^e\mu_e \quad \sum_{e\in E}\mu_e = 1 \right\} $$

where $$E_x$$ and $$E_y$$ denote a list for the indices of the extreme points of $$\mathcal X$$ and $$\mathcal Y$$. By substitution, one obtains the following approximation of the original problem:

$$
    \begin{align}
        \textrm{minimize } & f_0\left(\sum_{e\in E_x}\alpha_e\mathbf{x}^e\right) + g_0\left(\sum_{e\in E_y}\mu_e\mathbf{y}^e\right) \\
        \textrm{s.t. } & f_i\left(\sum_{e\in E_x}\alpha_e\mathbf{x}^e\right) + g_i\left(\sum_{e\in E_y}\mu_e\mathbf{y}^e\right) \ge 0 \quad\forall i=1,...,m \\
        & \sum_{e\in E_x}\alpha_e = 1 \\
        & \sum_{e\in E_y}\mu_e = 1 \\
        & \alpha, \mu \ge 0
    \end{align}
$$

By convexity of $$f$$ and $$g$$, the following problem approximates the above model (note that if only linear functions are involved, the approximation is exact):

$$
    \begin{align}
        \textrm{minimize } & \sum_{e\in E_x}\alpha_ef_0(\mathbf{x}^e) + \sum_{e\in E_y}\mu_eg_0(\mathbf{y}^e) \\
        \textrm{s.t. } & \sum_{e\in E_x}\alpha_ef_i(\mathbf{x}^e) + \sum_{e\in E_y}\mu_eg_i(\mathbf{y}^e) \ge 0 \quad\forall i=1,...,m \\
        & \sum_{e\in E_x}\alpha_e = 1 \\
        & \sum_{e\in E_y}\mu_e = 1 \\
        & \alpha, \mu \ge 0
    \end{align}
$$

The obtained formulation being linear, the column generation algortihm may be employed with the following pricing problems:

$$
    \begin{align}
        \textrm{minimize } & f_0(x) - \sum_{i=1}^m \pi_if_i(x) \\
        \textrm{s.t. } & \varphi(x) \le 0 \\
        & x\in\mathbb R^n_+
    \end{align}
$$

$$
    \begin{align}
        \textrm{minimize } & g_0(y) - \sum_{i=1}^m \pi_ig_i(y) \\
        \textrm{s.t. } & \psi(y) \le 0 \\
        & y\in\mathbb R^p_+
    \end{align}
$$

Iterating from solving a so-called restricted master problem and a pricing problem to exhibit an entering column, the obtained procedure converges (finitely for LPs !). See [1] for a proof of convergence and more details on its derivation.

## Applying the Dantzig-Wolfe decomposition with L-Solver

To make this tutorial simple, we will assume as done in the above example that (1) only two separable blocks are present (though L-Solver is able to handle an arbitrary number of sub-problems) and that (2) the model is already formulated in L-Solver and stored in a variable `model` of type `Model`. The only requirement for applying a Dantzig-Wolfe decomposition to our model is to build a `Decomposition` object that will discribe how the model shall be decomposed. Let us look at the following lines:

```c++
Environment env;
// ...
VariableVector x(env, "x");
VariableVector y(env, "y");
// ....
Model model;
// ...

// build a decomposition description
Decomposition decomposition(model);
decomposition.add_block_indicator("E_x", [](const Variable& var){ return var.user_defined_name()[0] == 'x'; });
decomposition.add_block_indicator("E_y", [](const Variable& var){ return var.user_defined_name()[0] == 'y'; });

// solve the model!
DantzigWolfeDecomposition<CplexAdapter> dw_solver(decomposition);
dw_solver.solve();

// display results:
if (model.objective().status() == Optimal) {
    for (const Variable& _x : x.components())
        cout << _x.user_defined_name() << " = " << _x.value() << endl;
    for (const Variable& _y : y.components())
        cout << _y.user_defined_name() << " = " << _y.value() << endl;
}
```

As one can see, a block description based on variable names are given to build the decomposition. For instance, block "E_x" is regroups all variables whose name start by "x". That is, the vector of "x" variables. Here, we chose to describe our decomposition through character comparison because it is very fast. However, one can imagine any discrimination criteria. The only condition though is that the description yields a feasible decomposition, i.e., that the two blocks are really seperable - as it is the case in the example from the introduction. 

Then, the `DantzigWolfeDecomposition<CplexAdapter>` solver is instanciated. By the means of the decomposition description, it is able to build a block angular formulation of the model and to apply a systematic Dantzig-Wolfe decomposition. Calling the `.solve()` method solves the problem through column generation. 

## One final note for LPs

For LP models, boundedness of the subproblems is not required since any polyhedron can be expressed as a convex combination of its extreme points plus an affine combination of its extreme ray. Because LP sovler adapters are required to return an extreme ray for unbounded LPs as a solution, L-Solver uses can exploit that information which allows the procedure to terminate even when the subproblems are unbounded for some dual prices. 


***

[1] *Optimization Theory for Large Systems*, Leon S. Lasdon