import { Request, Response } from "express";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator";

import {
  registerUser,
  loginUser,
} from "../services/auth.service";
export async function register(
  req: Request,
  res: Response
): Promise<void> {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Invalid registration details",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const user = await registerUser(validation.data);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        message: "An account with this email already exists",
      });
      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function login(
  req: Request,
  res: Response
): Promise<void> {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Invalid login details",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const result = await loginUser(validation.data);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}