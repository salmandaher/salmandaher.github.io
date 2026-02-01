[DC_Motor_Observer.md](https://github.com/user-attachments/files/24997610/DC_Motor_Observer.md)
# Minimum-Order Observer Design for DC Motor
**Torquenado PRIZM DC Motor**

---

## 1. Introduction

This document presents the complete derivation and implementation of a **minimum-order observer** for velocity estimation in a DC motor system. The design follows the methodology presented in the lecture "Minimum-Order Observer" from Manara University.

### 1.1 Motivation

In the DC motor system:
- **Measurable states**: Position (encoder counts) and current (with filtering)
- **Unmeasurable state**: Velocity (angular velocity)
- **Challenge**: Finite difference of position introduces noise and delay

**Solution**: Design a minimum-order observer that estimates velocity using the full motor dynamics and both available measurements.

---

## 2. DC Motor State-Space Model

### 2.1 Physical Model

A DC motor consists of electrical and mechanical subsystems:

**Electrical subsystem:**
$$V = Ri + L\frac{di}{dt} + K_e\omega$$

**Mechanical subsystem:**
$$J\frac{d\omega}{dt} = K_t i - b\omega$$

where:
- $V$ = applied voltage [V]
- $i$ = armature current [A]
- $R$ = armature resistance [Ω]
- $L$ = armature inductance [H]
- $K_e$ = back-EMF constant [V/(rad/s)]
- $K_t$ = torque constant [N⋅m/A]
- $\omega$ = angular velocity [rad/s]
- $\theta$ = angular position [rad]
- $J$ = moment of inertia [kg⋅m²]
- $b$ = viscous friction coefficient [N⋅m⋅s]

### 2.2 State-Space Representation

Define state vector:
$$\mathbf{x} = \begin{bmatrix} \theta \\ \omega \\ i \end{bmatrix}$$

State equations:
$$\frac{d\theta}{dt} = \omega$$

$$\frac{d\omega}{dt} = -\frac{b}{J}\omega + \frac{K_t}{J}i$$

$$\frac{di}{dt} = -\frac{K_e}{L}\omega - \frac{R}{L}i + \frac{1}{L}V$$

In matrix form:
$$\dot{\mathbf{x}} = \mathbf{A}\mathbf{x} + \mathbf{B}u$$
$$\mathbf{y} = \mathbf{C}\mathbf{x}$$

where:

$$\mathbf{A} = \begin{bmatrix} 
0 & 1 & 0 \\ 
0 & -\frac{b}{J} & \frac{K_t}{J} \\ 
0 & -\frac{K_e}{L} & -\frac{R}{L} 
\end{bmatrix}$$

$$\mathbf{B} = \begin{bmatrix} 0 \\ 0 \\ \frac{1}{L} \end{bmatrix}$$

$$\mathbf{C} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

### 2.3 Numerical Values

**Given parameters:**
- $R = 1.38$ Ω
- $K_e = 0.013178$ V/(rad/s)
- $\frac{b}{J} = 0.881867$ s⁻¹
- $T_s = 0.02$ s (sample time)

**Assumed parameters:**
- $J = 0.001$ kg⋅m² (typical for small DC motor)
- $L = 0.001$ H (small, typical for DC motors)
- $K_t = K_e = 0.013178$ N⋅m/A (common approximation)
- $b = 0.000882$ N⋅m⋅s

**Resulting A matrix:**
$$\mathbf{A} = \begin{bmatrix} 
0 & 1 & 0 \\ 
0 & -0.881867 & 13.178 \\ 
0 & -13.178 & -1380 
\end{bmatrix}$$

$$\mathbf{B} = \begin{bmatrix} 0 \\ 0 \\ 1000 \end{bmatrix}$$

---

## 3. Minimum-Order Observer Design

### 3.1 Theory from Lecture

Following the lecture methodology for scalar output case (extended to 2 outputs):

Since we measure $m = 2$ states (position and current) and have $n = 3$ total states, we need to estimate $n - m = 1$ state (velocity). This gives a **1st-order** minimum-order observer.

### 3.2 State Partitioning

Reorder state vector to separate measured and unmeasured states:

$$\mathbf{x}_{\text{new}} = \begin{bmatrix} \mathbf{x}_a \\ \mathbf{x}_b \end{bmatrix} = \begin{bmatrix} \theta \\ i \\ \omega \end{bmatrix}$$

where:
- $\mathbf{x}_a = \begin{bmatrix} \theta \\ i \end{bmatrix}$ (measurable, dimension 2)
- $\mathbf{x}_b = \omega$ (unmeasurable, dimension 1)

Transformation matrix:
$$\mathbf{P} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$

Transformed system:
$$\mathbf{A}_{\text{new}} = \mathbf{P A P}^{-1} = \begin{bmatrix} 
0 & 0 & 1 \\ 
0 & -1380 & -13.178 \\ 
0 & 13.178 & -0.881867 
\end{bmatrix}$$

$$\mathbf{B}_{\text{new}} = \mathbf{P B} = \begin{bmatrix} 0 \\ 1000 \\ 0 \end{bmatrix}$$

$$\mathbf{C}_{\text{new}} = \mathbf{C P}^{-1} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$

### 3.3 Partitioned Matrices

Following lecture notation:

$$\mathbf{A}_{\text{new}} = \begin{bmatrix} \mathbf{A}_{aa} & \mathbf{A}_{ab} \\ \mathbf{A}_{ba} & \mathbf{A}_{bb} \end{bmatrix}$$

where:

$$\mathbf{A}_{aa} = \begin{bmatrix} 0 & 0 \\ 0 & -1380 \end{bmatrix} \text{ (2×2)}$$

$$\mathbf{A}_{ab} = \begin{bmatrix} 1 \\ -13.178 \end{bmatrix} \text{ (2×1)}$$

$$\mathbf{A}_{ba} = \begin{bmatrix} 0 & 13.178 \end{bmatrix} \text{ (1×2)}$$

$$\mathbf{A}_{bb} = [-0.881867] \text{ (1×1)}$$

$$\mathbf{B}_a = \begin{bmatrix} 0 \\ 1000 \end{bmatrix}, \quad \mathbf{B}_b = [0]$$

### 3.4 Observer Gain Calculation

**Desired observer pole:** $\mu = -20$ (chosen to be 10-20 times faster than slowest plant pole)

The characteristic equation for minimum-order observer is:
$$|s\mathbf{I} - \mathbf{A}_{bb} + \mathbf{K}_e \mathbf{A}_{ab}| = (s - \mu)$$

For our 1st-order observer:
$$s - \mathbf{A}_{bb} + \mathbf{K}_e \mathbf{A}_{ab} = s + 20$$

Solving for $\mathbf{K}_e$ using pole placement (equivalent to MATLAB `acker` function):

$$\mathbf{K}_e = \begin{bmatrix} 0.109459 & -1.442455 \end{bmatrix}$$

**Verification:**
$$\mathbf{A}_{bb} - \mathbf{K}_e \mathbf{A}_{ab} = -0.881867 - \begin{bmatrix} 0.109459 & -1.442455 \end{bmatrix} \begin{bmatrix} 1 \\ -13.178 \end{bmatrix} = -20$$

✓ Correct!

### 3.5 Observer Equations

Following the lecture, define auxiliary variable:
$$\boldsymbol{\eta} = \mathbf{x}_b - \mathbf{K}_e \mathbf{x}_a = \omega - \mathbf{K}_e \begin{bmatrix} \theta \\ i \end{bmatrix}$$

Observer dynamics:
$$\dot{\tilde{\boldsymbol{\eta}}} = \hat{\mathbf{A}}\tilde{\boldsymbol{\eta}} + \hat{\mathbf{B}}\mathbf{y} + \hat{\mathbf{F}}u$$

where:
$$\hat{\mathbf{A}} = \mathbf{A}_{bb} - \mathbf{K}_e \mathbf{A}_{ab} = -20$$

$$\hat{\mathbf{B}} = \hat{\mathbf{A}}\mathbf{K}_e + \mathbf{A}_{ba} - \mathbf{K}_e \mathbf{A}_{aa} = \begin{bmatrix} -2.189187 & -1948.561 \end{bmatrix}$$

$$\hat{\mathbf{F}} = \mathbf{B}_b - \mathbf{K}_e \mathbf{B}_a = 1442.455$$

State reconstruction:
$$\hat{\omega} = \tilde{\eta} + \mathbf{K}_e \begin{bmatrix} \theta \\ i \end{bmatrix}$$

$$\hat{\omega} = \tilde{\eta} + 0.109459 \cdot \theta - 1.442455 \cdot i$$

### 3.6 Discrete-Time Implementation

Using forward Euler discretization with sample time $T_s = 0.02$ s:

$$\tilde{\eta}[k+1] = \tilde{\eta}[k] + T_s \left( \hat{\mathbf{A}}\tilde{\eta}[k] + \hat{\mathbf{B}}\mathbf{y}[k] + \hat{\mathbf{F}}u[k] \right)$$

$$\hat{\omega}[k] = \tilde{\eta}[k] + \mathbf{K}_e \mathbf{y}[k]$$

where $\mathbf{y}[k] = \begin{bmatrix} \theta[k] \\ i_{\text{filt}}[k] \end{bmatrix}$

---

## 4. Implementation Details

### 4.1 Algorithm Flow

```
1. Initialize: η = 0

2. At each sample k:
   a. Read encoder → θ[k]
   b. Read current → i[k]
   c. Filter current → i_filt[k] (moving average)
   d. Read voltage → V[k]
   
   e. Construct measurement vector:
      y[k] = [θ[k]; i_filt[k]]
   
   f. Update observer state:
      η_dot = A_hat * η + B_hat * y[k] + F_hat * V[k]
      η[k+1] = η[k] + Ts * η_dot
   
   g. Reconstruct velocity estimate:
      ω_hat[k] = η[k] + Ke * y[k]
   
   h. Calculate finite difference velocity (for comparison):
      ω_diff[k] = (θ[k] - θ[k-1]) / Ts
```

### 4.2 Parameter Summary

| Parameter | Value | Description |
|-----------|-------|-------------|
| $\hat{\mathbf{A}}$ | -20.0 | Observer pole location |
| $\hat{\mathbf{B}}$ | [-2.189, -1948.561] | Measurement coupling |
| $\hat{\mathbf{F}}$ | 1442.455 | Input coupling |
| $\mathbf{K}_e$ | [0.109459, -1.442455] | Observer gain |
| $T_s$ | 0.02 s | Sample time |

---

## 5. Comparison: Minimum-Order Observer vs Original Method

### 5.1 Original Implementation

Your original code used a simplified observer:

```matlab
omega_hat_dot = -b_over_J * omega_hat + Lobs * (omega_meas - omega_hat)
```

This is essentially:
- A 1st-order low-pass filter on finite-difference velocity
- Only uses velocity measurement (derived from position)
- Does not utilize current or voltage information
- Observer gain $L = 20$ was manually tuned

### 5.2 Minimum-Order Observer Advantages

1. **Uses all available measurements:**
   - Position (encoder)
   - Current (filtered)
   - Voltage input

2. **Based on complete motor dynamics:**
   - Electrical subsystem (R, L, Ke)
   - Mechanical subsystem (J, b, Kt)
   - Proper state coupling

3. **Theoretically optimal:**
   - Pole placement via eigenvalue assignment
   - Guaranteed convergence rate
   - Systematic design procedure

4. **Better noise rejection:**
   - Does not directly differentiate position
   - Filters measurements through motor dynamics
   - Lower sensitivity to measurement noise

5. **Captures transients:**
   - Accounts for current dynamics
   - Proper voltage-to-velocity transfer function
   - Better response during acceleration/deceleration

---

## 6. Expected Results

### 6.1 Performance Metrics

- **Convergence time:** Observer pole at -20 → ~0.15s settling time (5τ where τ = 1/20 = 0.05s)
- **Steady-state error:** Zero (assuming correct model parameters)
- **Noise attenuation:** Better than finite difference due to dynamic filtering

### 6.2 Plot Interpretation

**Subplot 1:** Position (encoder counts)
- Shows motor position trajectory

**Subplot 2:** Velocity comparison
- Red dashed line: Finite difference (ω_diff)
- Blue solid line: Minimum-order observer (ω_obs)
- Expected: Observer line smoother, less noisy
- During acceleration: Observer responds with correct dynamics
- Steady-state: Both converge to similar values

**Subplot 3:** Current
- Gray dotted: Raw measurement
- Magenta solid: Filtered (moving average)
- Shows motor loading

**Subplot 4:** Applied voltage
- Control input to motor

---

## 7. MATLAB Implementation

Complete code provided in `dc_motor_minimum_order_observer.m`

Key sections:
- **Lines 13-17:** Observer parameters
- **Lines 94-103:** Observer update equations
- **Line 100:** State reconstruction

---

## 8. Conclusions

This minimum-order observer design:

1. **Follows rigorous control theory** (from lecture material)
2. **Utilizes all available information** (position, current, voltage)
3. **Based on complete DC motor model** (electrical + mechanical)
4. **Provides systematic design procedure** (pole placement)
5. **Expected to outperform finite difference** especially in noisy conditions

The implementation allows direct comparison between the observer estimate and finite-difference calculation, demonstrating the advantages of the state-space approach.

---

## References

[1] Manara University. (2024-2025). *Minimum-Order Observer Lecture Notes*. Department of Robotics and Intelligent Systems.

[2] Ogata, K. (2010). *Modern Control Engineering* (5th ed.). Prentice Hall.

[3] Franklin, G. F., Powell, J. D., & Emami-Naeini, A. (2015). *Feedback Control of Dynamic Systems* (7th ed.). Pearson.
