import React from "react";

export const Spinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  const colorClasses = {
    blue: "border-blue-600 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-600 border-t-transparent",
    emerald: "border-emerald-600 border-t-transparent",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
    ></div>
  );
};

export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" color="blue" />
        <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export const ContentLoader = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="lg" color="blue" />
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export const InlineLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center gap-2">
      <Spinner size="sm" color="white" />
      <span>{text}</span>
    </div>
  );
};

export const CenteredLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-100">
      <Spinner size="lg" color="blue" />
      <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};

export default PageLoader;