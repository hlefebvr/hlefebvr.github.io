---
layout: post
category: lsolver
title: Modeling and solving a MILP with L-Sover
short: Using its natural formulation
date: 2019-11-21
---

This tutorial explains how to use the L-Solver library in order to model an optimization problem and to solve it via an external solver. The modeling framework in L-Solver is actually rather similar to some comercial solvers. The most important thing to grasp is how the Environment class and the Model class interacts and which role is played by each. In the following section, we shall first discuss the role of Environments and how its components are stored. Then, we will show how to use a Model to actually solve an optimization problem.

## L::Environment and modeling components

Basically, an Environment is an object responsible for the life and death of its components. A component may be a variable, a constraint or an objective. Let us first look at the following example which creates a new variable in the environment:

```c++
Environment env; // creates an environment
Variable x = Variable(env, "x"); // creates a new variable
```

What this two lines of code do behind the hood is actually not straightforward. Indeed, one may notice that we create here a new Variable object that one can kill (via `delete &x;`) any time he wants. Moreover, `x` will automatically be destroyed at the end of its scope. So, is really `env` responsible for the life and death of `x` ? Does `env` still contain an `x` variable after `x` is being killed by the end of its scope ? The answer to these questions is found in the concept of Core components and regular components. In fact, calling `Variable(env, "x")` does not return a "real" variable but gives you an indirection to a core variable. A core variable is an actual implementation of a variable and is managed, and accessible, only by the environement. Core variables (as implemented by the CoreVariable class) is the essence of what a regular Variable represents in the sense that it posesses all of its attributes like name, value, upper bound, lower bound, type, etc. A (regular) variable (as implemented by the Variable class) does nothing but to forward method calls to its associated core variable. Variables can therefore be seen as references to a given core variable. For instance, the lb() method, used to access the variable's lower bound, is implemented as the following:

```c++
virtual float AbstractVariable::lb() = 0;
float Variable::lb() const override { return _core.lb(); }
float CoreVariable::lb() const override { return _lb; }
```

Where we clearly see that the Variable class is just using a reference (`_core`) to a core variable to which it forwards any modification action. As you can see, CoreVariable and Variable both inherit from an abstract class AbstractVariable which implements the interface for generic variables. This Environment mechanism allows to have a memory safe framework for calling solvers. For instance, it prevents from calling a solver on a model whose variables will be deleted. Clearly however, if an environment is deleted, all of its components are also deleted.

This approach is used for variables (implemented by AbstractVariable, Variable and CoreVariable), constraints (implemented as AbstractConstraint, Constraint and CoreConstraint) and objectives (implemented by AbstractObjective, Objective and CoreObjective). Note that an Environment can have several CoreObjective objects.

One last notion to grasp is the one of detached component. Let's consider the case of detached variables which is implemented through the DetachedVariable class (or DetachedConstraint, DetachedObjective). A DetachedVariable can be seen as a mix between a CoreVariable and a regular Variable. Though it inherits only from CoreVariable. Because of that later remark, DetachedVariable's do posess their own attributes yet, they are still linked to a CoreVariable. It can be used to make an independent copy of a CoreVariable while keeping a link to its source. Thus, modification to a DetachedVariable is local to the detached variable. To forward the modifications made on a detached variable to its core variable, one may use specific update() functions. For instance, we may consider the following bunch of code:
```c++
Environment env;
Variable x(env, "x");
DetachedVariable detached_x(x); // creates a detached variable, linked to the core variable of regular variable x

detached_x.value(100);
x.value(0);

std::cout << x.value() << " / " << detached_x.value() << std::endl; // prints: "0 / 100"

detached_x.update_core_value();

std::cout << x.value() << " / " << detached_x.value() << std::endl; // prints: "100 / 100"
```

As a conclusion, the following UML diagram sums up what has been said:

<center>
    <img src="/public/img/core_regular_detached.png" />
</center>

## L::Model

We may now turn our intention to the Model class. A model represents an optimization problem modelisation. It is therfore the aggregation of a set of variables, a set of constraint and one objective. It is important to understand that models are not responsible for the life and death of its components. It is only a collection of "pointers" to some components which, together, form a modelisation. Components are added to a model using the `add()` method. The following example speaks for itself:

```c++
Environemnt env;
VariableVector x(env, "x"); // vectors are a handy indirection to create several components
ConstraintVector ctr(env, "ctr");
Objective obj(env, "obj");

// defining objective function
obj.expression() = x(0) + x(1) + x(2);

// defining some constraints
ctr(0).expression() = 3 * x(0) + 2 * x(1) + 4 * x(2) - 5; // constraints are GreaterOrEqualTo zero by default
ctr(1).expression() = 5 * x(1) + 3 * x(2) - 7; // constraints are GreaterOrEqualTo zero by default

// defining variable types (default is Positive)
x(0).type(Binary);
x(1).type(Binary);

// building model
Model model;
model.add(obj);
model.add(ctr);
model.add(x);
```

## Solving a model using the DirectMILP solver

To solve a MILP model using its straightforward formulation, one can use the DirectMILPSolver. This solver depends on an external solver and can be used like so:

```
DirectMILPSolver<CplexAdapter> solver(model); // builds a new solver
solver.solve(); // solves the problem

cout << "Status: " << obj.status() << std::endl; // or model.objective().status()
cout << "Time: " << solver.last_execution_time() << std::endl;
if (obj.status() == Optimal) {
    for (const Variable& var : model.variables) {
        cout << var.user_defined_name() << " = " << var.value() << std::endl;
    }
}
```

And here you are! You have solved your model. In some next tutorial, we shall see how we can solve an optimization problem using a custom column generation or the generic Dantzig-Wolfe decomposition.