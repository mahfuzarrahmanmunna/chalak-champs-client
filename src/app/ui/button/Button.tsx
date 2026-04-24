import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  // Color Props
  bgColor?: string;
  highlightColor?: string;
  darkShadowColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  // Spacing Props
  px?: string;
  py?: string;
  mx?: string;
  my?: string;
  fullWidth?: boolean;
  // Text Size Prop
  textSize?: string;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  icon,
  iconPosition = "left",
  bgColor = "#214187",
  highlightColor = "#30A1E6",
  darkShadowColor = "#001D3A",
  textColor = "#FFFFFF",
  hoverBgColor = "#FFFFFF",
  hoverTextColor = "#214187",
  px = "px-8",
  py = "py-2.5",
  mx = "mx-0",
  my = "my-0",
  fullWidth = false,
  textSize = "text-base", // Added default text size
  className = "",
  ...props
}) => {
  // Normal and Hover Shadow Logic
  const shadowStyles = {
    "--normal-shadow": `
      inset 0px 1.5px 0px 0px ${highlightColor}, 
      0px 1.5px 1.5px 0px ${bgColor}B5, 
      0px 0px 0px 1.5px ${darkShadowColor}, 
      0px 3.01px 7.52px 0px ${bgColor}4D
    `.trim(),
    "--hover-shadow": `
      0px 1.5px 1.5px 0px ${bgColor}4D, 
      0px 0px 0px 1.5px ${bgColor}, 
      0px 3.01px 7.52px 0px ${bgColor}26
    `.trim(),
    "--bg-color": bgColor,
    "--text-color": textColor,
    "--hover-bg": hoverBgColor,
    "--hover-text": hoverTextColor,
  } as React.CSSProperties;

  return (
    <button
      {...props}
      style={shadowStyles}
      className={`
        group relative cursor-pointer flex items-center justify-center gap-2 
        rounded-lg font-bold active:animate-pulse transition-all duration-300
        
        /* Base Styles */
        ${textSize} /* Dynamic Text Size applied here */
        bg-[var(--bg-color)] text-[var(--text-color)] [box-shadow:var(--normal-shadow)]
        
        /* Dynamic Hover State */
        hover:bg-[var(--hover-bg)] hover:text-[var(--hover-text)] 
        hover:[box-shadow:var(--hover-shadow)]
        
        /* Active/Disabled States */
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        
        ${px} ${py} ${mx} ${my}
        ${fullWidth ? "w-full" : "w-auto"}
        ${className}
      `}
    >
      {icon && iconPosition === "left" && (
        <span className="w-5 h-5 flex items-center shrink-0 transition-colors">
          {icon}
        </span>
      )}

      <span className="relative select-none">{children}</span>

      {icon && iconPosition === "right" && (
        <span className="w-5 h-5 flex items-center shrink-0 transition-colors">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
