---
layout: post
category: codes
title: WNTJ with CPLEX
short: Minimizing the weighted number of tardy jobs using CPLEX
date: 2019-02-10
---

Here I share an very small project which is an implementation of three MILP models to minimize the weighted number of tardy jobs. A famous NP-hard problem denoted in the literature as:

$$ 1|r_j|\sum w_iU_i $$

The three models are described in this article: [A Mixed Integer Linear Programming approach to minimize the number of late jobs with and without machine availability constraints](https://hal.inria.fr/hal-00880908/) where they are called (A), (B) and (MMKP). 

My implementation is done in C++ and uses the IBM Cplex solver. It is available on my GitHub: [hlefebvr](https://github.com/hlefebvr/cplex-cpp-1riwiUi).