---
layout: post
title: Convex conjugate cheatsheet
category: posts
short: Some usefull formulas regarding convex conjugates
preview: conjugate.png
---

Convex conjugacy plays a prominent role in many scientific fields. In particular, it is central for deriving tractable robust counterparts of uncertain optimization problems. This page regroups several facts (along with their proof) regarding conjugate calculus and related formulas. This page, however, does not intend to give any insight on geometrical properties of convex conjugates, for a discussion on Fenchel duality and various interpretations, please read [this article](/posts/2022/06/14/fenchel.html).

<div class="unproved" style="padding:5px">
    <i>With a red left-border, propositions which have no proofs on this page yet (though the result is correct!). I will add them asap.</i>
</div>

<div>
    <b>Notations</b>
    Throughout this page, we will denote \( \overline{\mathbb R} = \mathbb R \cup \{ -\infty, +\infty \} \) the extended real number line. For a given function \( f:\mathbb R^n \rightarrow \overline{\mathbb R} \), we let \( \textrm{dom}(f) = \{ \mathbf x\in\mathbb R^n : f(\mathbf x) < +\infty \} \) be the domain of \(f\).
</div>

## Definition and properties

<p>
Let \( f: \mathbb R^n \rightarrow \overline{\mathbb R}  \) be a given function. 
</p>

<div class="theorem">
    <b>Definition</b>
    The convex conjugate of \( f \) is noted \( f^* \) and is defined as
    $$ f^*(\mathbf y) = \sup_{ \mathbf x\in \textrm{dom}(f) } \{ \mathbf y^T\mathbf x - f(\mathbf x) \} $$
</div>

<div class="theorem">
    <b>Proposition</b> (Fenchel inequality)
    For any \( \mathbf x\in\mathbb R^n \) and any \( \mathbf y\in\mathbb R^n \), the following holds.
    $$ \mathbf y^T\mathbf x \le f(\mathbf x) + f^*(\mathbf y) $$
    <details>
        <summary>Proof</summary>
        <div>
            This directly follows from the definition of \( f^* \) by a characterization of supremum.
        </div>
    </details>
</div>

<div class="theorem">
    <b>Proposition</b> (Convexity)
    \( f^* \) is closed and convex.
    <details>
        <summary>Proof</summary>
        <div>
            \( f^* \) is the supremum of affine functions.
        </div>
    </details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Double conjugate)
    \( f^{**} \le f \). 
    Moreover, if \( f \) is closed and convex, then \( f = f^{**} \).
    <details>
    <summary>Proof</summary>
    <div>
        From Fenchel inequality, we have that for all \( \mathbf x\in\mathbb R^n \), \( \mathbf x^T\mathbf y - f^*(\mathbf y) \le f(\mathbf x) \) for all \( \mathbf y\in\mathbb R^n \). Thus, \( \sup_{ \mathbf y \in\textrm{dom}(f^*) } \{ \mathbf x^T\mathbf y - f^*(\mathbf y) \} \le f(\mathbf x) \) which shows that \(f^{**} \le f^*\). Now, let us assume that \( f \) is closed and convex. We show that \( f^{**} \ge f \). TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Subgradients)
    Asume \( f \) is closed and convex, then $$ \mathbf y \in \partial f(\mathbf x) \Leftrightarrow \mathbf x \in \partial f^*(\mathbf y) \Leftrightarrow \mathbf x^T\mathbf y = f(\mathbf x) + f^*(\mathbf y). $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Strongly convex)
    Asume \( f \) is closed and strongly convex with parameter \( \mu > 0 \) for the norm \( ||.|| \), then \( \textrm{dom}(f^*) = \mathbb R^n \). Moreover, \( f^* \) is differentiable everywhere with
    $$ \nabla f^*(\mathbf y) = \textrm{argmax} \{ \mathbf y^T\mathbf x - f(\mathbf x) : \mathbf x \in\mathbb R^n \} $$
    and \( \nabla f^*(\mathbf y) \) is \( \frac 1\mu \)-Lipschitz continuous with respect to the dual norm \( ||.||_* \), i.e., 
    $$ || \nabla f^*(\mathbf y) - \nabla f^*(\mathbf y') || \le \frac 1\mu || \mathbf y - \mathbf y' ||_*. $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Fenchel duality)
    Asume \( f \) is proper and convex and let \(g : \mathbb R^n \rightarrow \overline{\mathbb R} \) be a given proper concave function. If the following Slater's conditions hold,
    $$ \exists \hat{\mathbf x} \in \textrm{int}(\textrm{dom}(f))\cap\textrm{int}(\textrm{dom}(-g)), $$
    then the following equality holds.
    $$ \inf_{ \mathbf x\in\textrm{dom}(f)\cap\textrm{dom}(-g) } \{ f(\mathbf x) - g(\mathbf x) \} = \sup_{ \mathbf y\in\textrm{dom}(f^*)\cap\textrm{dom}(-g_*) } \{ g_*(\mathbf y) - f^*(\mathbf y) \} $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem">
    <b>Proposition</b> (Maximizing a concave function over a convex set)
    Let \( X\subseteq\mathbb R^n \) be a convex set with non-empty interior and let \( g:\mathbb R^n\rightarrow \mathbb R \) be a proper concave function over \( X \), then the following holds.
    $$
        \sup_{\mathbf x\in X} g(\mathbf x)
        =
        \inf_{\mathbf y\in\textrm{dom}({-g})}\{ \delta^*(\mathbf y | X) - g_*(\mathbf y) \}
    $$
    <details>
    <summary>Proof</summary>
    <div>
        This results from a direct application of Fenchel duality by observing that \( \sup_{\mathbf x\in X} g(\mathbf x) = \sup_{\mathbf x\in\mathbb R^n} \{ g(\mathbf x) - \delta(\mathbf x | X) \} \).
    </div>
</details>
</div>

## Examples

<div class="theorem unproved">
    <b>Proposition</b> (Affine functions)
    Assume \( f(\mathbf x) = \mathbf a^T\mathbf x + \mathbf b \), then,
    $$
        f^*(\mathbf y) = \begin{cases}
            -\mathbf b & \textrm{if } \mathbf y = \mathbf a \\
            +\infty & \textrm{otherwise}
        \end{cases}
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Convex quadratic functions)
    Assume \( f(\mathbf x) = \frac 12\mathbf x^T\mathbf A\mathbf x + \mathbf b^T\mathbf x + c \) with \( \mathbf A \) a psd matrix, then,
    $$
        f^*(\mathbf y) = \begin{cases}
            \frac 12(\mathbf y - \mathbf b)^T\mathbf A^\dagger(\mathbf y - \mathbf b) - c & \textrm{if } \mathbf y \in \textrm{span}(\mathbf A) + \mathbf b \\
            +\infty & \textrm{otherwise}
        \end{cases}
    $$
    where \(\mathbf A^\dagger\) is the Moore-Penrose pseudo inverse of \( \mathbf A \). If \( f \) is strictly convex (i.e., \( \mathbf A \) is positive definite), then \( \mathbf A^\dagger = \mathbf A^{-1} \) and the column span of \( \mathbf A \) is \( \mathbb R^n \).
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Max)
    Assume \( f(\mathbf x) = \max_{i=1,...,n} x_i \), then,
    $$
        f^*(\mathbf y) = \begin{cases}
            0 & \textrm{if } \sum_{i=1}^n y_i = 1, \mathbf y \ge \mathbf 0 \\
            +\infty & \textrm{otherwise}
        \end{cases}
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Soft max)
    Assume \( f(\mathbf x) = \log\left(\sum_{i=1}^n e^{x_i}\right) \), then,
    $$
        f^*(\mathbf y) = \begin{cases}
            \sum_{i=1}^n y_i\log(y_i) & \textrm{if } \sum_{i=1}^n y_i = 1, \mathbf y \ge \mathbf 0 \\
            +\infty & \textrm{otherwise}
        \end{cases}
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Norms)
    Assume \( f(\mathbf x) = ||\mathbf x|| \), then,
    $$
        f^*(\mathbf y) = \begin{cases}
            0 & \textrm{if } ||\mathbf y||_* \le 1 \\
            +\infty & \textrm{otherwise}
        \end{cases}
    $$ where \( ||\bullet||_* \) is the dual norm of \( ||\bullet|| \).
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Negative entropy)
    Assume \( f(\mathbf x) = \sum_{i=1}^n x_i\log{x_i} \) with \( \textrm{dom}(f) = \mathbb R_{++}^n \), then,
    $$
        f^*(\mathbf y) = \sum_{i=1}^n e^{y_i-1}
    $$
    <details>
    <summary>Proof</summary>
    <div>
        See https://piazza.com/class_profile/get_resource/is58gs5cfya7ft/ivubdhmws163zc
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Negative logarithm)
    Assume \( f(\mathbf x) = -\sum_{i=1}^n \log{x_i} \) with \( \textrm{dom}(f) = \mathbb R_{++}^n \), then,
    $$
        f^*(\mathbf y) = \begin{cases}
            -\sum_{i=1}^n \log{-y_i} - n & \textrm{if } \mathbf y \le \mathbf 0 \\
            +\infty & \textrm{otherwise}
        \end{cases}
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Indicator of a convex set/cone)
    Let \( X \) be a given convex set, then, by definition,
    $$
        \delta^*(\mathbf y | X) = \sup_{\mathbf x\in X} \mathbf y^T\mathbf x.
    $$
    Moreover, assume that \( X \) is a convex cone, then the following holds.
    $$
        \delta^*(\mathbf y | X) = \delta^*(\mathbf y | -X^*) = \delta^*(-\mathbf y | X^*) =
        \begin{cases}
            0 & \textrm{if } \mathbf y^T\mathbf x \le 0 \quad \forall\mathbf x\in X \\
            +\infty & \textrm{otherwise}
        \end{cases}
    $$
    where \( X^* \) denotes the dual cone of \( X \).
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

## Calculus rules

<div class="theorem unproved">
    <b>Proposition</b> (Addition to affine mappings)
    Assume \( f(\mathbf x) = \tilde f(\mathbf x) + \mathbf a^T\mathbf x + b \), then,
    $$
        f^*(\mathbf y) =  \tilde f^*\left( \mathbf y - \mathbf a \right) - b
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Composition with invertible affine mappings)
    Assume \( f(\mathbf x) = \tilde f(\mathbf A\mathbf x + \mathbf b) \) with \( \det(\mathbf A) \neq 0 \), then,
    $$
        f^*(\mathbf y) =  \tilde f^*\left( \mathbf A^{-T}\mathbf y \right) - \mathbf b^T\mathbf A^{-T}\mathbf y
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem unproved">
    <b>Proposition</b> (Separable sum)
    Assume \( f(\mathbf x_1, \mathbf x_2) = f_1(\mathbf x_i) + f_2(\mathbf x_2) \), then,
    $$
        f^*(\mathbf y_1, \mathbf y_2) = f_1^*(\mathbf y_1) + f_2^*(\mathbf y_2)
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>


<div class="theorem unproved">
    <b>Proposition</b> (Non-separable sum)
    Assume \( f(\mathbf x) = \sum_{i=1}^p f_i(\mathbf x) \), then,
    $$
        f^*(\mathbf y) = \begin{array}[t]{ll}
            \inf & \sum_{i=1}^p f_i^*(\mathbf v^{(i)}) \\
            \textrm{s.t. } & \sum_{i=1}^p \mathbf v^{(i)} = \mathbf y \\
            & \mathbf V\in\mathbb R^{p\times n}
        \end{array}
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO
    </div>
</details>
</div>


<div class="theorem unproved">
    <b>Proposition</b> (Scalar multiplication)
    Assume \( f(\mathbf x) = \alpha \tilde f(\mathbf x) \), then,
    $$
        f^*(\mathbf y) = \alpha \tilde f^*\left(\frac{\mathbf y}\alpha\right)
    $$
    <details>
    <summary>Proof</summary>
    <div>
        TODO.
    </div>
</details>
</div>

<div class="theorem">
    <b>Proposition</b> (Convex/Concave conjugate)
    Let \( f \) be a given function, then \( (-f)_*(\mathbf y) = -f^*(-\mathbf y) \).
    <details>
    <summary>Proof</summary>
    <div>
        $$
            (-f)_*(\mathbf y) = \inf_{\mathbf x}\{ \mathbf y^T\mathbf x - (-f)(\mathbf x) \}
            = - \sup_{\mathbf x} \{ -\mathbf y^T\mathbf x  - f(\mathbf x) \}
            = -f^*(-\mathbf y)
        $$
    </div>
</details>
</div>
