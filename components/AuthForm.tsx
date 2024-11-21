"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";

import { useState } from "react";
import OtpModal from "./OPTModal";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),

    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};



function AuthForm({ type }: { type: FormType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);


// z.infer<typeof formSchema> is a utility from Zod that generates a TypeScript type based on a Zod schema. In your code, it is used to automatically infer the shape of the form data (like email and fullName) from the authFormSchema and ensure type safety when working with the form data in the useForm hook. This eliminates the need to manually define the types for the form.

  const form = useForm<z.infer<typeof formSchema>>({
    // In the parent component AuthForm, the useForm hook manages the form state, including the email field.
    // form.getValues("email") is used to get the current value of the email field, which is part of the form's internal state.
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user =
        type === "sign-up" // If `type` is "sign-up"
          ? await createAccount({
              fullName: values.fullName || "", // Use fullName or an empty string if not provided
              email: values.email, // User's email
            }) // Call `createAccount` and wait for its result
          : await signInUser({ email: values.email }); // Otherwise, call `signInUser` and wait for its result

      setAccountId(user.accountId);
    } catch {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      // Code that always runs, no matter what happens
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign in" : "Sign up"}
          </h1>
          {type === "sign-up" && (
            <>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Full Name
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>

                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {" "}
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && (

        // the reason why this elemnet can accuse the from is beacuse of a built in react hook called useForm, 
        // look up, the code is in const form = useForm<z.infer<typeof formSchema>>({ 
        // pretty cool
        <OtpModal email={form.getValues("email")} accountId={accountId} /> 

        // If accountId is valid, render the OTP modal and pass in the email and
        // accountId as props. Within the modal, verify it via a server action using
        // the function called verifySecret. If verifySecret returns valid, use the router
        // to push the user to the index (basically the home page).
      )}
    </>
  );
}

export default AuthForm;
