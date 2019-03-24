---
layout: post
category: or
title: Performance profile
short: R-library to draw performance profiles
date: 2019-03-23
---

## Introduction
Performance profiles were introduced by [Dolan and Moré, 2002] as a way to compare different algorithms/models to solve different instances. Formally, let $$M$$ be a set of models built for solving a set of instances $$I$$ and let $$t_i^m$$ be the CPU execution time for model $m$ to solve instance $$i$$. We define the performance function of model $$m$$ (relatively to the others) by 

$$
    P_m(r) = \dfrac{ |\{ \displaystyle i\in I | t_i^m \le r\times\min_{m'\in M}t_i^{m'} \}| }{ |I| }, r\in\mathbb R_+
$$

Thus, a point $$(r, P_m(r))$$ can be interpreted as the number of instances which can be solved under $$r$$ times the best execution time. 

## R package

Strangely enough, I was unable to find an R package which would ease the drawing of performance profiles. That's how I started to develop one, available in my [github](https://github.com/hlefebvr/r-performance-profile). 

With the simple following code 
```r
plot.perf(results,
          algorithm.col = "model",
          acost.col = "time",
          n = 50,
          ylim = c(.8, 1),
          xlim = c(0, 2e+10),
          legend = c("model A", "model KP", "model B")
        )
```
You'll get plotted your performance profile like so :
![performance profile](https://raw.githubusercontent.com/hlefebvr/r-performance-profile/master/example.png)

# TODO

## References
[Dolan and Moré, 2002] Dolan, E. D. and Moré, J. J. (2002). Benchmarking optimization software with performance
profiles. Mathematical Programming, 91(2):201–213.