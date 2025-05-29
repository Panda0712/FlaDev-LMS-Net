import { ChevronDown, ChevronUp } from "lucide-react";
import BlankCheckBoxImg from "~/assets/images/blank-checkbox.png";
import CheckBoxImg from "~/assets/images/checkbox.png";
import RecorderImg from "~/assets/images/recorder.png";

const CourseProgress = ({
  openItemList,
  courseModule = [],
  currentActiveLesson,
  handleChangeActiveLesson,
  handleToggleList,
  progressInfo,
  lessonDurations,
}) => {
  return (
    <div className="flex flex-col w-full">
      {courseModule?.map((item, index) => (
        <div key={index} className="flex flex-col">
          <div
            onClick={() => handleToggleList(index)}
            className={`${
              index < courseModule?.length - 1 ? "border-b border-gray-200" : ""
            } flex items-center gap-3 cursor-pointer transition
            hover:bg-gray-50 py-3 lg:py-4 px-4 lg:px-6 w-full`}
          >
            {openItemList?.[index]?.active ? (
              <ChevronDown size={20} className="text-gray-600" />
            ) : (
              <ChevronUp size={20} className="text-gray-600" />
            )}
            <p className="font-semibold text-sm text-gray-800">
              {index + 1}. {item?.title}
            </p>
          </div>
          <div
            className={`${
              openItemList?.[index]?.active ? "flex w-full flex-col" : "hidden"
            } transition bg-gray-50`}
          >
            {courseModule?.[index]?.lessons?.map((lesson, lessonIndex) => (
              <div
                key={lessonIndex}
                onClick={() => handleChangeActiveLesson(lesson?.name)}
                className={`${
                  currentActiveLesson === lesson?.name
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                } flex w-full items-start gap-3 py-2 lg:py-3 px-4 lg:px-6 cursor-pointer transition`}
              >
                <img
                  src={
                    lesson?.completed ||
                    (progressInfo?.completedLessons?.length &&
                      progressInfo?.completedLessons?.includes(lesson?.name))
                      ? CheckBoxImg
                      : BlankCheckBoxImg
                  }
                  className="w-5 h-5 mt-0.5"
                  alt=""
                />
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-medium">
                    {lessonIndex + 1}. {lesson?.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <img src={RecorderImg} className="w-4 h-4" alt="" />
                    <p
                      className={`text-xs ${
                        currentActiveLesson === lesson?.name
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {lessonDurations[lesson?.name] &&
                        `${Math.floor(
                          lessonDurations[lesson?.name] / 60
                        )}:${String(
                          Math.floor(lessonDurations[lesson?.name] % 60)
                        ).padStart(2, "0")}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseProgress;
