"use client";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const page = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: any) => {
        try {
            await axiosInstance.post("/auth/login", data);
            router.push("/dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default page;
