import { VscCheck, VscChromeClose, VscError, VscWarning } from "react-icons/vsc";

type IconProps = {
  icon?: string;
};

const Icon: React.FC<IconProps> = ({ icon }) => {
  switch (icon) {
    case "success":
      return <VscCheck />;
    case "fail":
      return <VscChromeClose />;
    case "error":
      return <VscError />;
    case "warn":
      return <VscWarning />;
  }
  return null;
};

export default Icon;
