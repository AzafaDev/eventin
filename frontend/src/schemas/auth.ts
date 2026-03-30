import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(5, "Full name must be at least 5 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Email format is not valid")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain small letter")
    .matches(/[A-Z]/, "Password must contain capital letter")
    .matches(/[0-9]/, "Password must contain number")
    .max(20, "Password must be max 20 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  role: Yup.string()
    .oneOf(["customer", "organizer"], "Invalid role selection")
    .required("Role is required"),
  referralCode: Yup.string().ensure().optional(),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain small letter")
    .matches(/[A-Z]/, "Password must contain capital letter")
    .matches(/[0-9]/, "Password must contain number")
    .max(20, "Password must be max 20 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});
