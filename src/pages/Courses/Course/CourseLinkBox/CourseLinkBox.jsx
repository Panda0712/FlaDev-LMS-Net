import { useState } from "react";
import { linkBoxInfo } from "~/pages/Courses/Course/CourseLinkBox/constants";

const CourseLinkBox = ({ onScrollToSection }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (idx) => {
    setActiveTab(idx);
    onScrollToSection && onScrollToSection(idx);
  };

  return (
    <div className="flex items-center border-b border-gray-200 overflow-x-auto">
      {linkBoxInfo.map((item, idx) => (
        <button
          key={item.name}
          className={`px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === idx
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabClick(idx)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default CourseLinkBox;
