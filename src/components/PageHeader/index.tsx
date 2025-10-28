interface PageHeaderProps {
  title: string;
  subtitle: string;
  currentView: "pagination" | "load-more";
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  currentView,
}) => {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-3">{title}</h1>
      <p className="text-gray-600 mb-6 text-lg">{subtitle}</p>
      <div className="flex justify-center gap-3">
        <a
          href="/"
          className={`px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all ${
            currentView === "pagination"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Page Controls
        </a>
        <a
          href="/load-more"
          className={`px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all ${
            currentView === "load-more"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Infinite Scroll
        </a>
      </div>
    </header>
  );
};

export default PageHeader;
