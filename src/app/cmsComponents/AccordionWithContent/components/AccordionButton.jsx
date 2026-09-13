import Button from "@/components/ui/Button";

const POSITION_CLASS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const WIDTH_CLASS = {
  auto: "w-full max-w-xs sm:w-auto sm:max-w-none sm:px-10",
  full: "w-full",
};

export default function AccordionButton({
  label,
  href,
  icon,
  cId,
  position = "center",
  variant = "primary",
  width = "auto",
}) {
  if (!label) {
    return null;
  }

  return (
    <div
      className={`mt-8 flex sm:mt-10 ${width === "full" ? "w-full" : ""} ${POSITION_CLASS[position] ?? POSITION_CLASS.center}`}
    >
      <Button
        label={label}
        href={href || "#"}
        icon={icon}
        cId={cId}
        variant={variant}
        fullWidth={width === "full"}
        className={`leading-none ${WIDTH_CLASS[width] ?? WIDTH_CLASS.auto}`}
      />
    </div>
  );
}
