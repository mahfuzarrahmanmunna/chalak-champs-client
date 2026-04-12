import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  bgColor?: string;
  textColor?: string;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  icon,
  iconPosition = "left",
  bgColor = "#F3056D", // Base Pink
  textColor = "#FFFFFF",
  className = "",
  ...props
}) => {
  // Composite shadow built strictly from the 4 provided screenshots
  const complexShadows = `
    /* 1. Outer Soft Glow (From Image 4) */
    /* X:0, Y:3.01, Blur:7.52, Color: #F3066E (30%) */
    0 3px 7.5px 0 rgba(243, 6, 110, 0.3),

    /* 2. Sharp Outer Drop (From Image 2) */
    /* X:0, Y:1.5, Blur:1.5, Color: #F3066E */
    0 1.5px 1.5px 0 rgba(243, 6, 110, 0.4),

    /* 3. Inner Top Highlight (From Image 1) */
    /* X:0, Y:1.5, Blur:0, Color: #FF8FCA */
    inset 0 1.5px 0 0 #FF8FCA,

    /* 4. Inner Border / Bottom Definition (From Image 3) */
    /* X:0, Y:0, Blur:0, Spread:1.5, Color: #C6005F */
    inset 0 0 0 1.5px #C6005F
  `;

  return (
    <button
      {...props}
      style={
        {
          "--theme-color": bgColor,
          "--text-color": textColor,
          boxShadow: complexShadows,
        } as React.CSSProperties
      }
      className={`
        group relative flex items-center justify-center gap-2 px-8 py-2
        rounded-lg font-bold transition-all duration-300 shadow-[inset_0_3px_0_rgba(255,255,255,0.5)] border-none cursor-pointer overflow-hidden
        
        /* Base Colors */
        bg-[var(--theme-color)] text-[var(--text-color)]
        
        /* Hover State: Inverts colors but keeps the 3D shape */
        hover:bg-white hover:text-[var(--theme-color)]
        
        /* Active State */
        active:scale-95 active:shadow-inner
        
        ${className}
      `}
    >
      {icon && iconPosition === "left" && (
        <span className="w-5 h-5 flex items-center z-10">{icon}</span>
      )}

      <span className="relative z-10 select-none">{children}</span>

      {icon && iconPosition === "right" && (
        <span className="w-5 h-5 flex items-center z-10">{icon}</span>
      )}
    </button>
  );
};

export default Button;
