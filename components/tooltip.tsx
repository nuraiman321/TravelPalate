import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { FaInfo, FaTiktok } from "react-icons/fa6";

interface InfoData {
    info: String | null | undefined;
}

const Tooltips = (info: InfoData) =>{
    return (
        <Tooltip 
        showArrow
        placement="right"
        content={info.info}
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
        <Button className="" variant="flat" size="sm" isIconOnly><FaInfo /></Button>
      </Tooltip>
    );
}

export default Tooltips;