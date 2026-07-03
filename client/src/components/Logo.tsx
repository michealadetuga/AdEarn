import { Link } from "react-router-dom";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  linkToHome?: boolean;
  className?: string;
};

const fullLogoSizes = {
  sm: "h-10",
  md: "h-16",
  lg: "h-32",
};

const iconLogoSizes = {
  sm: "h-9",
  md: "h-11",
  lg: "h-14",
};

export default function Logo({ size = "sm", linkToHome = true, className = "" }: LogoProps) {
  const useIcon = size === "sm";
  const src = useIcon ? "/logo-icon.png" : "/logo.png";
  const sizeClass = useIcon ? iconLogoSizes[size] : fullLogoSizes[size];

  const image = (
    <img
      src={src}
      alt="AdEarn — Monetize Your Attention"
      className={`w-auto object-contain ${sizeClass} ${className}`}
    />
  );

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex shrink-0 items-center">
        {image}
      </Link>
    );
  }

  return image;
}
