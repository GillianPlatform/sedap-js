import { VscError, VscInfo, VscPass, VscWarning } from "react-icons/vsc";

export type highlight = "error" | "warning" | "info" | "success";

export type HighlightIconProps = {
  highlight: highlight | undefined;
};

export function HighlightIcon({ highlight }: HighlightIconProps) {
  const hightlight = (() => {
    switch (highlight) {
      case "error":
        return <VscError />;
      case "warning":
        return <VscWarning />;
      case "info":
        return <VscInfo />;
      case "success":
        return <VscPass />;
    }
  })();
  return highlight && <div className="sedap__highlightIcon">{hightlight}</div>;
}
