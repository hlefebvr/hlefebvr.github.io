---
layout: post
category: lsolver
title: Using the branch-and-price solver
short: for MI(N)LPs
date: 2019-11-25
---

In this very small tutorial, we are going to see how to use the branch-and-price solver from the L-Solver library to solve a MILP problem. It follows directly this [tutorial on Using a Dantzig-Wolfe decomposition](https://hlefebvr.github.io/posts/en_lsolver_dantzig_wolfe.html). We now consider the following model:

$$
    \begin{align}
        \textrm{minimize } & c^Tx + d^Ty \\
        \textrm{s.t. } & Ax \le b \\
        & By \le f \\
        & Tx + Hy \ge h \\
        & x\in\mathbb R^n_+\\
        & y\in\mathbb \{0,1\}^p
    \end{align}
$$

which, by the same steps as those done in the previous tutorial, leads to the following restricted master problem:

$$
    \begin{align}
        \textrm{minimize } & c^T\sum_{e\in E_x}\alpha_e\mathbf{x}^e + d^Ty \\
        \textrm{s.t. } & T\sum_{e\in E_x}\alpha_e\mathbf{x}^e + Hy \ge h \\
        & \sum_{e\in E_x}\alpha_e = 1 \\
        & By \ge f \\
        & \alpha \ge 0 \\
        & y\in\mathbb \{0,1\}^p
    \end{align}
$$

Note that here, we applied the Dantzig-Wolfe decomposition only on the $$x$$ variables. Applying the DW decomposition to the $$y$$ variables would make the resulting problem a relaxation of the original problem (which can be shown to be as good as its Lagrangian relaxation). Because the $$y$$ variables are required to take integer values however, one cannot deduce a pricing problem analogous to that of the Simplex algorithm, as done for LPs. We therefore solve this problem by using a branch-and-bound algorithm where each node is an LP and is solved via column-generation. The obtained procedure is called Branch-and-Price and has a generic implementation in L-Solver.

Suppose that the above model has already been formulated in C++ and is available in `(Model) model`. The following code can be used to solve it via branch-and-price:

```c++
Environment env;
Model model;
VariableVector x(env, "x");
VariableVector y(env, "y");

/* Defining the model.. */

// build a decomposition description
Decomposition decomposition(model);
decomposition.add_block_indicator("E_x", [](const Variable& var){ return var.user_defined_name()[0] == 'x'; });

// use branch-and-price
DantzigWolfeBranchAndPrice<CplexAdapter, DirectLPSover<CplexAdapter>> bap_solver(decomposition);
bap_solver.solve();

// done!
```

The template arguments for `DantzigWolfeBranchAndPrice` are the same as for `DantzigWolfeSolver`. 

## Important note for integer sub-problems

In the case one wants to have an integer sub-problem (which corresponds to a relaxation of the original problem in the general case) it is important to specify that no branching should be done over the sub-problem's variable. Though it would still lead a valid result, it is more efficient to generate integer extreme points with external solvers and solve the RMP as an LP rather than branching on the RMP and solve each relaxation via column generation. For instance, if, in our example, $$x$$ was alos required to be integer, the same decomposition would be a relaxation of the original problem. A small edit should be done on the above code. Namely, the following line should be added when defining the $$x$$ variables:

```c++
x.priority(0); // do not branch on the x variables
```