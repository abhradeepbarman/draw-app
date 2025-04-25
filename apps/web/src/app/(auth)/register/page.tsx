"use client";
import axiosInstance from "@/lib/axios";
import React from "react";
import { useForm } from "react-hook-form";

const page = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm_password: "",
        },
    });

    const onSubmit = async (data: any) => {
        try {
            const response = await axiosInstance.post("/auth/register", data);
            console.log("response", response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "Name is required",
                                },
                            })}
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Email is required",
                                },
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Password is required",
                                },
                            })}
                        />
                        {errors.password && (
                            <span>{errors.password.message}</span>
                        )}
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirm_password", {
                                required: {
                                    value: true,
                                    message: "Confirm password is required",
                                },
                                validate: (value) => {
                                    const { password } = getValues();
                                    return (
                                        password === value ||
                                        "Passwords do not match"
                                    );
                                },
                            })}
                        />
                        {errors.confirm_password && (
                            <span>{errors.confirm_password.message}</span>
                        )}
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default page;
