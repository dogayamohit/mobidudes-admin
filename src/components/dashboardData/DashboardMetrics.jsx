import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogCount } from "../../api/blog";
import { getServiceCount } from "../../api/service";
import { getCareerCount, getVacancyOpenRoleCount } from "../../api/career";

const metrics = [
    {
        name: "Blog",
        key: "blogs",
        value: "466",
        path: "blogs",
        gradient: "from-purple-200 to-white",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-purple-600"
            >
                <circle cx="12" cy="8" r="3" />
                <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
                <circle cx="5" cy="9" r="2" />
                <path d="M1 20v-1a4 4 0 0 1 4-4" />
                <circle cx="19" cy="9" r="2" />
                <path d="M23 20v-1a4 4 0 0 0-4-4" />
            </svg>
        ),
    },
    {
        name: "Career",
        key: "career",
        value: "6",
        path: "careers/open-jobs",
        gradient: "from-orange-200 to-white",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-6 h-6 text-orange-600`}
            >
                {/* Briefcase */}
                <rect x="3" y="7" width="18" height="13" rx="2" ry="2" />

                {/* Handle */}
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />

                {/* Middle line */}
                <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
        ),
    },
    {
        name: "Vaccancy",
        key: "vacancy",
        value: "120",
        path: "careers/open-jobs",
        gradient: "from-green-200 to-white",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-green-600"
            >
                <path d="M3 12h7l2-5 4 10 2-5h3" />
            </svg>
        ),
    },
    {
        name: "Services",
        key: "services",
        value: "389",
        path: "/",
        gradient: "from-blue-200 to-white",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-blue-600"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="16" y1="2" x2="16" y2="6" />
            </svg>
        ),
    },

];

export default function DashboardMetrics() {
    const navigate = useNavigate();

    const [counts, setCounts] = useState({
        blogs: 0,
        career: 0,
        vacancy: 0,
        services: 0,
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [
                    blogTotal,
                    serviceTotal,
                    vacancyTotal,
                    careerTotal,
                ] = await Promise.all([
                    getBlogCount(),
                    getServiceCount(),
                    getVacancyOpenRoleCount(),
                    getCareerCount(),
                ]);

                setCounts((prev) => ({
                    ...prev,
                    blogs: blogTotal,
                    services: serviceTotal,
                    vacancy: vacancyTotal,
                    career: careerTotal, 
                }));
            } catch (error) {
                console.error(error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((item, index) => (
                <div
                    key={index}
                    onClick={() => navigate(item.path)}
                    className={`flex cursor-pointer items-center gap-5 rounded-2xl border border-gray-200 bg-gradient-to-br ${item.gradient} p-6 transition hover:scale-[1.02] hover:shadow-lg`}
                >
                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/70">
                        {item.icon}
                    </div>

                    {/* Text */}
                    <div>
                        <h4 className="text-2xl font-semibold text-gray-800">
                            {counts[item.key]}
                        </h4>

                        <span className="text-sm text-gray-500">
                            {item.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
