import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCourseById,
  fetchCourseProgress,
  fetchOrders,
  fetchReviews,
  initCourseProgress,
  updateLessonProgress,
  createCompletedOrderForTest,
} from "~/apis/endpoints";
import Loading from "~/components/Loading/Loading";
import useCourseLearning from "~/hooks/useCourseLearning";
import CourseContent from "~/pages/Courses/Course/CourseContent/CourseContent";
import CourseInstructor from "~/pages/Courses/Course/CourseInstructor/CourseInstructor";
import CourseLinkBox from "~/pages/Courses/Course/CourseLinkBox/CourseLinkBox";
import CourseReviews from "~/pages/Courses/Course/CourseReviews/CourseReviews";
import CourseSuggestion from "~/pages/Courses/Course/CourseSuggestion/CourseSuggestion";
import CourseProgress from "~/pages/Courses/CourseLearning/CourseProgress/CourseProgress";
import CourseVideo from "~/pages/Courses/CourseLearning/CourseVideo/CourseVideo";

const CourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Test function để tạo order completed
  const handleCreateTestOrder = async () => {
    try {
      const orderData = {
        courseId: parseInt(courseId),
        userEmail: currentUser?.email || "test@example.com",
        userName: currentUser?.name || "Test User",
        courseName: courseInfo?.courseName || "Test Course",
        courseThumbnail: courseInfo?.thumbnail || courseInfo?.courseThumbnail,
        instructor: courseInfo?.instructor || "Test Instructor",
        totalPrice: courseInfo?.price || 0,
        paymentMethod: "TEST",
      };

      const result = await createCompletedOrderForTest(orderData);
      console.log("✅ Test order created:", result);
      alert("Test order created successfully! Please refresh the page.");
    } catch (error) {
      console.error("❌ Failed to create test order:", error);
      alert("Failed to create test order: " + error.message);
    }
  };

  const contentRef = useRef(null);
  const instructorRef = useRef(null);
  const lessonsRef = useRef(null);
  const reviewsRef = useRef(null);

  const handleScrollToSection = (index) => {
    const refs = [contentRef, instructorRef, lessonsRef, reviewsRef];
    const ref = refs[index];
    if (ref && ref.current)
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const {
    reviews,
    orders,
    currentUser,
    courseInfo,
    loading,
    openItemList,
    currentActiveLesson,
    currentVideoUrl,
    progressInfo,
    progressPercent,
    lessonDurations,
    isCourseOrdered,
    handleChangeActiveLesson,
    handleToggleList,
    handleVideoComplete,
    handleDuration,
  } = useCourseLearning({
    courseId,
    fetchProgressFn: fetchCourseProgress,
    fetchCourseById,
    fetchOrderFn: fetchOrders,
    fetchReviewFn: fetchReviews,
    updateProgressFn: updateLessonProgress,
    initProgressFn: initCourseProgress,
  });

  useEffect(() => {
    if (!loading && !isCourseOrdered && courseInfo) navigate("/");
  }, [navigate, loading, isCourseOrdered, courseInfo]);

  if (loading) return <Loading />;

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Side - Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center lg:h-screen h-64">
          <div className="w-full max-w-4xl mx-auto px-4">
            <CourseVideo
              thumbnail={courseInfo?.thumbnail || courseInfo?.courseThumbnail}
              videoUrl={currentVideoUrl}
              onVideoComplete={handleVideoComplete}
              lessonId={currentActiveLesson}
              handleDuration={handleDuration}
            />
          </div>
        </div>

        {/* Right Side - Progress and Lessons */}
        <div
          ref={lessonsRef}
          className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col lg:h-screen h-auto"
        >
          {/* Progress Section */}
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-lg lg:text-xl font-semibold mb-4">
              Tiến độ hoàn thành
            </h3>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tiến độ: {Math.round(progressPercent)}%</span>
                <span>
                  {progressInfo?.completedLessons?.length || 0}/
                  {progressInfo?.totalLessons || 0} bài học
                </span>
              </div>
            </div>

            {/* Test Button - Chỉ hiển thị khi có lỗi progress */}
            {!progressInfo && (
              <div className="mb-4">
                <button
                  onClick={handleCreateTestOrder}
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded transition-colors"
                >
                  🧪 Tạo Order Test (Chỉ dành cho testing)
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Nếu bạn chưa mua khóa học, click để tạo order test
                </p>
              </div>
            )}
          </div>

          {/* Course Progress - Scrollable */}
          <div className="flex-1 overflow-y-auto max-h-96 lg:max-h-none">
            <CourseProgress
              openItemList={openItemList}
              courseModule={courseInfo?.courseModules}
              currentActiveLesson={currentActiveLesson}
              handleToggleList={handleToggleList}
              handleChangeActiveLesson={handleChangeActiveLesson}
              progressInfo={progressInfo}
              lessonDurations={lessonDurations}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Tabs */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <CourseLinkBox onScrollToSection={handleScrollToSection} />
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div ref={contentRef}>
          <CourseContent courseInfo={courseInfo} />
        </div>

        <div ref={instructorRef}>
          <CourseInstructor
            courseInfo={courseInfo}
            reviews={reviews}
            orders={orders}
          />
        </div>

        <CourseSuggestion reviews={reviews} style="bg-white" />

        <div ref={reviewsRef}>
          <CourseReviews
            loading={loading}
            currentUser={currentUser}
            reviews={reviews}
            courseInfo={courseInfo}
          />
        </div>
      </div>
    </section>
  );
};

export default CourseLearning;
