import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const SidebarMenuItem = ({ item, activeColorId, setColorId, isChild}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const hasChildren = item.children?.length > 0;

  const handleClick = () => {
    if (item.path) {
      navigate(item.path);
      setColorId(item.id);
    }
    if (hasChildren) setExpanded(!expanded);
  };

  return (
    <div className="sidebar__menu__item  block" style={{display:"block"}}>
      <div className="flex justify-between items-center">
        <div
          className={`flex items-center justify-between rounded cursor-pointer hover:bg-gray-100 ${
            activeColorId === item.id ? "bg-gray-200 font-semibold" : ""
          }`}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
            {hasChildren &&
            (expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
          </div>
          
        </div>
      </div>
      


      {hasChildren && expanded && (
        
        <div className="border-l border-gray-200 ml-3 mt-2 block ">
          {item.children.map((child) => (
            <SidebarMenuItem
              key={child.id}
              item={child}
              activeColorId={activeColorId}
              setColorId={setColorId}
              isChild={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;
