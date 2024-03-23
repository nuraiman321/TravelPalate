import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { FaInfo, FaTiktok } from "react-icons/fa6";
import { useState } from "react";

interface InfoData {
  info: String | null | undefined;
}

const Tooltips = (info: InfoData) => {
  const [ttOpen, setTTOpen] = useState(false);
  return (
    <Tooltip
      showArrow
      placement="right"
      content={info.info}
      isOpen={ttOpen}
      classNames={{
        base: [
          // arrow color
          "before:bg-neutral-400 dark:before:bg-white",
        ],
        content: [
          "py-2 px-4 shadow-xl",
          "text-black bg-gradient-to-br from-white to-neutral-400",
        ],
      }}
    >
      <Button
        className=""
        variant="flat"
        size="sm"
        isIconOnly
        onMouseEnter={() => {
            setTTOpen(true);
          }}
          onMouseLeave={() => {
            setTTOpen(false);
          }}
        onPress={() => {
          setTTOpen((prev) => !prev);
        }}
      >
        <FaInfo />
      </Button>
    </Tooltip>
  );
};

export default Tooltips;
