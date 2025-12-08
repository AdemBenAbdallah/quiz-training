/**
 * Reusable section header component for consistent page headings
 *
 * @example
 * // Basic usage
 * <SectionHeader
 *   subtitle="All Certifications"
 *   title="Explore our complete catalog of AWS certification"
 * />
 *
 * @example
 * // With custom size and alignment
 * <SectionHeader
 *   subtitle="How it works?"
 *   title="Find revenue opportunities in 3 steps"
 *   size="md"
 *   align="center"
 * />
 *
 * @example
 * // With description and custom styling
 * <SectionHeader
 *   subtitle="Features"
 *   title="Everything you need"
 *   description="Comprehensive toolset for modern development"
 *   className="mb-16"
 *   subtitleClassName="text-blue-500"
 * />
 *
 * @example
 * // Left aligned with smaller size
 * <SectionHeader
 *   subtitle="Section"
 *   title="Left Aligned Title"
 *   align="left"
 *   size="sm"
 * />
 */

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  className?: string;
  subtitleClassName?: string;
  titleClassName?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl";
}

export default function SectionHeader({
  subtitle,
  title,
  description,
  className = "",
  subtitleClassName = "",
  titleClassName = "",
  align = "center",
  size = "lg",
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const sizeClasses = {
    sm: {
      subtitle: "text-xs",
      title: "text-2xl md:text-3xl",
      margin: "mb-8 md:mb-12",
    },
    md: {
      subtitle: "text-xs",
      title: "text-2xl md:text-4xl",
      margin: "mb-10 md:mb-16",
    },
    lg: {
      subtitle: "text-sm",
      title: "text-3xl md:text-5xl",
      margin: "mb-12 md:mb-20",
    },
    xl: {
      subtitle: "text-sm",
      title: "text-4xl md:text-6xl",
      margin: "mb-16 md:mb-24",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`
        flex w-full flex-col
        ${alignmentClasses[align]}
        ${currentSize.margin}
        ${className}
      `}
    >
      <p
        className={`
          mb-3 font-medium uppercase tracking-wider text-red-500
          ${currentSize.subtitle}
          ${subtitleClassName}
        `}
      >
        {subtitle}
      </p>

      <h2
        className={`
          mx-auto font-extrabold tracking-tight
          ${currentSize.title}
          ${titleClassName}
          ${align !== "center" ? "max-w-none" : "max-w-4xl"}
        `}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`
            mt-4 mx-auto text-gray-400 max-w-2xl
            ${align !== "center" ? "max-w-none" : ""}
            ${size === "sm" ? "text-sm" : "text-base"}
          `}
        >
          {description}
        </p>
      )}
    </div>
  );
}
