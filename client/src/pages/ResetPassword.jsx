import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomButton, Loading, TextInput } from "../components";

const ResetPassword = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  // handleResetSubmit
  const handleResetSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: "/users/reset-password",
        method: "POST",
        data,
      });
      setErrMsg(res);
    } catch (e) {
      setErrMsg(e);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full h-[100vh] bg-bgColor flex items-center justify-center p-6">
      <div className="w-full px-6 py-8 rounded-lg shadow-md bg-primary md:w-1/3 2xl:w-1/4">
        <p className="text-lg font-semibold text-ascent-1">Email Address</p>

        <span className="text-sm text-ascent-2">
          Enter email address used during registration
        </span>

        <form
          onSubmit={handleSubmit(handleResetSubmit)}
          className="flex flex-col gap-5 py-4"
        >
          <TextInput
            name="email"
            placeholder="email@example.com"
            type="email"
            register={register("email", {
              required: "Email Address is required!",
            })}
            styles="w-full rounded-lg"
            labelStyle="ml-2"
            error={errors.email ? errors.email.message : ""}
          />
          {errMsg?.message && (
            <span
              role="alert"
              className={`text-sm ${
                errMsg?.status === "failed"
                  ? "text-[#f64949fe]"
                  : "text-[#2ba150fe]"
              } mt-0.5`}
            >
              {errMsg?.message}
            </span>
          )}

          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title="Submit"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
