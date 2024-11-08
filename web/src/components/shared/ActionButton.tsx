import { Button } from "catalyst/button";
import clsx from "clsx";

export function ActionButton(props: {
  type: "button" | "submit" | "reset";
  secondary?: boolean;
  destructive?: boolean;
  inProgress?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const {
    type,
    secondary = false,
    destructive = false,
    inProgress = false,
    onClick,
    className,
    children,
  } = props;

  return (
    // @ts-ignore
    <Button
      className={className}
      type={type}
      disabled={inProgress}
      onClick={onClick}
      color={destructive ? "red" : "dark/zinc"}
      outline={secondary ? true : undefined}
    >
      {inProgress && (
        <div className="mr-0.5">
          <Spinner className="stroke-zinc-600" />
        </div>
      )}
      {children}
    </Button>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={clsx("size-5 stroke-white", className)}
    >
      <style>
        {
          "@keyframes spinner_zKoa{to{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,to{stroke-dasharray:42 150;stroke-dashoffset:-59}}"
        }
      </style>
      <g
        style={{
          transformOrigin: "center",
          animation: "spinner_zKoa 2s linear infinite",
        }}
      >
        <circle
          cx={12}
          cy={12}
          r={9.5}
          fill="none"
          strokeWidth={2.5}
          style={{
            strokeLinecap: "round",
            animation: "spinner_YpZS 1.5s ease-in-out infinite",
          }}
        />
      </g>
    </svg>
  );
}
